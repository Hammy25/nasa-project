// Import external modules
const request = require("supertest");
// Import internal modules
const app = require("../../app");
const {
	mongoConnect,
	mongoDisconnect
} = require("../../services/mongo.service");

describe("Test planets API", () => {
	beforeAll( async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe("Test GET /planets", () => {
		test("It should respond with 200 success code", async () => {
			const response = await request(app)
			.get("/v1/planets")
			.expect("Content-Type", /json/)
			.expect(200);
		});
	});
});
