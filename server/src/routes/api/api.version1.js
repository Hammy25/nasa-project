// Imports
const express = require("express");
const planetsRouter = require("../planets/planets.router");
const launchesRouter = require("../launches/launches.router");

const api = express();

//  /planets/
api.use("/v1/planets", planetsRouter);
// /launches/
api.use("/v1/launches", launchesRouter);

module.exports = api;

