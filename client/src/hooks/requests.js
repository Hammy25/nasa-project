const API_URL = "http://localhost:8000/v1/";
// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}planets`);
  // console.log(response.json())
  // setTimeout(() => console.log(response.json()), 2000)
  return await response.json();
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  try {
    const response = await fetch(`${API_URL}launches`);
    const fetchedLaunches = await response.json();
    // fetchedLaunches = fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
    // console.log(fetchedLaunches);
    return (fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber));
  } catch (err) {
    console.error("An error occurred fetching launches:");
    console.error(err);
  }
}

async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.
  try {  return await fetch(`${API_URL}launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch),
    });
  } catch(err){
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
      return await fetch(`${API_URL}launches/${id}`, {
      method: "delete",
    });    
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    };
  }

}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};