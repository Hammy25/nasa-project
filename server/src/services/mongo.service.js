const mongoose = require("mongoose");

// Cloud MongoDB
// const MONGO_URI = "mongodb+srv://nasa-api:CZuJsthu1aDQu9hL@nasa-cluster.kmpkp5d.mongodb.net/?retryWrites=true&w=majority";

// Local MongoDB / Test MongoDB
const MONGO_URI = "mongodb://127.0.0.1:27017/LearningNodeJS";

// Mongoose logging
mongoose.connection.once("open", () => {
	console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
	console.error(err);
});

const mongoConnect = async() => {
	await mongoose.connect(MONGO_URI);
};

const mongoDisconnect = async() => {
	await mongoose.disconnect();
};


module.exports = {
	mongoConnect,
	mongoDisconnect
}
