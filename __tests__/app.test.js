const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const supertest = require("supertest");
const app = require("../app");
const fs = require("fs/promises");

beforeAll(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("GET all data from topics", () => {
    return supertest(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topics } = res.body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET /api", () => {
  test("GET description of all endpoints", () => {
    return supertest(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { endpoint } = res.body;
        let arrOfEndpoints = Object.keys(endpoint);
        expect(endpoint[arrOfEndpoints[0]]).toHaveProperty(
          "description",
          expect.any(String)
        );
      });
  });
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
});
