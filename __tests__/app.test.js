const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const supertest = require("supertest");
const app = require("../app");
const fs = require("fs/promises");
const endpointsData = require("../endpoints.json");

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("GET /api is dynamic", () => {
    return supertest(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        fs.readFile(`./endpoints.json`, "utf8")
          .then((endpoints) => {
            let length = 0;
            const parsedEndpoints = JSON.parse(endpoints);
            length = Object.keys(parsedEndpoints).length;

            const { endpoint } = res.body;
            const numberOfEndpoints = Object.keys(res.body.endpoint).length;

            expect(numberOfEndpoints).toBe(length);
          })
          .catch((err) => {
            fail();
          });
      });
  });
  test("GET /api retrieves data about all endpoints", () => {
    return supertest(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const { endpoint } = res.body;
        expect(endpointsData).toEqual(endpoint);
      });
  });
});
