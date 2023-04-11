// Imports
const http = require("http");

// Local imports
const app = require("./app.js");
const {loadPlanets} = require("./models/planets.model");
const {loadLaunchesData} = require("./models/launches.model");
const {
	mongoConnect,
	mongoDisconnect
} = require("./services/mongo.service.js");
// const {createLaunch, getAllLaunches} = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
	await mongoConnect();

	await loadPlanets();

	await loadLaunchesData();

	server.listen(PORT, () => {
	console.log(`Listening on port ${PORT} ...`);
	});

}

startServer();

