const {
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunchById
} = require("../../models/launches.model");

const {getPagination} = require("../../services/query.service");

async function httpGetAllLaunches (req, res){
	const {skip, limit} = getPagination(req.query);
	const result = await getAllLaunches(skip, limit)
	return res.status(200).json(result);
}

async function httpAddNewLaunch (req, res){
	const launch = req.body;
	if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
		return res.status(400).json({
			error: "Missing required launch property.",
		});
	}

	launch.launchDate = new Date(launch.launchDate);
	if(isNaN(launch.launchDate)){
		return res.status(400).json({
			error: "Invalid launch date",
		});
	}

	launch.launchDate = new Date(launch.launchDate);
	// addNewLaunch(launch);
	await scheduleNewLaunch(launch);
	return res.status(201).json(launch)
}

async function httpAbortLaunch (req, res){
	const launchId = +req.params.id;
	// if launch doesn't exists

	const existsLaunch = await existsLaunchWithId(launchId);

	if(!existsLaunch){
		return res.status(404).json({
		error: "No launch with specified flight id.",
		});
	}

	// if launch does exist
	const aborted  = await abortLaunchById(launchId);

	if(aborted.modifiedCount === 1 && aborted.matchedCount === 1){
		return res.status(200).json({
			message: "Success"
		});
	} else if(aborted.modifiedCount === 0 && aborted.matchedCount === 1){
		return res.status(200).json({
			message: "Launch already aborted."
		});
	}
	return res.status(400).json({
		error: "An error occurred in aborting a launch"
	});
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch
};