// Require external modules
const request = require("supertest");
const app = require("../../app");
const {
	mongoConnect,
	mongoDisconnect
} = require("../../services/mongo.service");

describe("Launches API tests", () => {
	beforeAll( async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe("Test GET /v1/launches", () => {
		test("It should respond with 200 success", async () => {
			const response  = await request(app).get("/v1/launches");
			expect (response.statusCode).toBe(200);
		});
	});

	describe("Test POST /launch", () => {
		const completeLaunchData = {
			mission: "USS Enterpise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
			launchDate: "January 4, 2028"
		};

		const launchDataWithoutDate = {
			mission: "USS Enterpise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
		};

		const launchDataWithInvalidDate = {
			mission: "USS Enterpise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
			launchDate: "k",
		};

		const launchDataWithoutTarget = {
			mission: "USS Enterpise",
			rocket: "NCC 1701-D",
			launchDate: "January 4, 2028",
		};


		test("It should respond with 201 created", async () => {
			const response = await request(app).post("/v1/launches")
			.send(completeLaunchData)
			.expect("Content-Type", /json/)
			.expect(201);

			const requestDate = new Date(completeLaunchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();

			expect(requestDate).toBe(responseDate);

			expect(response.body).toMatchObject({
				mission: "USS Enterpise",
				rocket: "NCC 1701-D",
				target: "Kepler-62 f",
			});
		});

		test("It should catch missing required properties", async () => {
			const response = await request(app)
									.post("/v1/launches")
									.send(launchDataWithoutTarget)
									.expect("Content-Type", /json/)
									.expect(400);

			expect(response.body).toStrictEqual({
				error: "Missing required launch property."
			});	
		});

		test("It should catch invalid dates", async () => {
			const response = await request(app)
			.post("/v1/launches")
			.send(launchDataWithInvalidDate)
			.expect("Content-Type", /json/)
			.expect(400);

			expect(response.body).toStrictEqual({
				error: "Invalid launch date",
			});

		});

		test("It should catch abort unknown launches", async () => {
			const response = await request(app)
			.delete("/v1/launches/500")
			.expect(404)

			expect(response.body).toStrictEqual({
				error: "No launch with specified flight id.",
			});
		});
	});
});