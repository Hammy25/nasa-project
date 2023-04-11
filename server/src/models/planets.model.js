// Import modules
const {parse} = require("csv-parse");
const fs = require("fs");

const planets = require("./planets.mongo");

const results = [];
// const habitablePlanets = [];

// console.log("Here:");
// console.log(planets.find({}).length);
async function getAllPlanets() {
  return await planets.find({}, {
    "_id": 0,
    "__v": 0
  });
};


const isHabitablePlanet = (planet) => {
	return planet["koi_disposition"] === "CONFIRMED" 
	&& planet["koi_insol"] > 0.36 
	&& planet["koi_insol"] < 1.11
	&& planet["koi_prad"] < 1.6;
};

const loadPlanets = async () => {
  fs.createReadStream("./data/kepler_data.csv")
  .pipe(parse({
    comment: "#",
    columns: true
  }))
  .on("data", async (data) => {
    results.push(data);
    if(isHabitablePlanet(data)){
      // habitablePlanets.push(data);
      // insert + update = upsert
      savePlanet(data);
      // console.log(`Added ${data.kepler_name}`);
    }
  })
  .on("error", err => {
    console.log("An error occurred.");
    console.log(err);
  })
  .on("end", async () => {
    const planetsFound =  (await getAllPlanets()).length;
    // console.log(habitablePlanets.map( planet => planet["kepler_name"]));
    // console.log(habitablePlanets.length);
    // console.log(`${planetsFound} planets have been found`);
    // console.log("Done!");
  });
}


const savePlanet = async(planet) => {
try {  
  await planets.updateOne({
    kepler_name: planet.kepler_name
  }, {
    kepler_name: planet.kepler_name
  }, {
    upsert: true
  });
} catch (err){
  console.error(`Could not add ${planet.kepler_name}!`)
  console.error(err);
}
};

// console.log(getAllPlanets());
  module.exports = {
    loadPlanets,
  	getAllPlanets
  }