// Imports
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const app = express();

const api = require("./routes/api/api.version1");

app.use(cors({
	origin: "http://localhost:3000"
}));
app.use(morgan("combined"));
app.use(express.json());
app.use(api);
app.use(express.static(path.join(__dirname, "..", "public")));


module.exports = app;