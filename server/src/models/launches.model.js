const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";


const downloadLaunches = async () => {
	const response = await axios.post(SPACEX_API_URL, {
			query: {},
			options: {
				pagination: false,
				populate: [
				{
					path: "rocket",
					select:
					{
						name: 1
					}
				},
				{
					path: "payloads",
					select: 
					{
						customers: 1
					}
				}
				]
			}
	});


	const launchDocs  = response.data.docs;
	for (const launchDoc of launchDocs){
		const payloads = launchDoc.payloads;
		const customers = payloads.flatMap((payload) => payload.customers);

		const launch = {
			flightNumber: launchDoc.flight_number,
			mission: launchDoc.name,
			rocket: launchDoc.rocket.name,
			launchDate: launchDoc.date_local,
			upcoming: launchDoc.payload,
			success: launchDoc.success,
			customers
		};

		await createLaunch(launch);
	}

};


const loadLaunchesData = async () => {
	const launchOne = await findLaunch({
		flightNumber: 1,
		rocket: "Falcon 1",
		mission: "FalconSat",
	});
	console.log("Loading launches data");
	if(launchOne){
		console.log("Launches already downloaded.")
	}else{
		await downloadLaunches();
	}
		
};

const getAllLaunches = async (skip, limit) => {
	return await launches.find({}, {
		"__v": 0,
		"_id": 0
	})
	.skip(skip)
	.limit(limit)
	.sort({flightNumber: 1});
};


const createLaunch = async (launch) => {
	if(launch.flightNumber){
		await launches.findOneAndUpdate({
			flightNumber: launch.flightNumber
		}, 
			launch
		,{
			upsert: true
		});
	}
};


const scheduleNewLaunch = async (launch) => {
	const planet = await planets.findOne({
		kepler_name: launch.target
	});


	if(!planet){
		throw new Error("Kepler planet does not exists.");
	}

	const latestLaunchNumber = (await getLatestFlightNumber()) + 1;

	const newLaunch = Object.assign(launch, {
		flightNumber: latestLaunchNumber,
		success: true,
		upcoming: true,
		customers: ["ZTM", "NASA"]
	});

	await createLaunch(newLaunch);	
};


const getLatestFlightNumber = async() => {
	const latestLaunch = await launches.findOne().sort("-flightNumber");

	if(!latestLaunch){
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
};


const findLaunch = async (filter) => {
	return await launches.findOne(filter);
}; 


const existsLaunchWithId = async (launchId) => {
	return await findLaunch({
		flightNumber: launchId
	});
};


const abortLaunchById = async (launchId) => {
	return result = await launches.updateOne({
		flightNumber: launchId
	}, {
		upcoming: false,
		success: false
	});

	// return result.modifiedCount === 1 && result.matchedCount === 1;
};

module.exports = {
	loadLaunchesData,
	scheduleNewLaunch,
	createLaunch,
	getAllLaunches,
	existsLaunchWithId,
	abortLaunchById,
};