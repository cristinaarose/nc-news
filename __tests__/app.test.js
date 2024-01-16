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

describe("GET /api/articles/:article_id", () => {
  test("200: GET /api/articles/:article_id returns article from given id", () => {
    return supertest(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const { article } = res.body;

        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id");
        expect(article.article_id).toBe(1);
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("400: responds with appropriate message when sent non-existent article id", () => {
    return supertest(app)
      .get("/api/articles/not_an_id")
      .expect(400)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Bad request");
      });
  });
  test("404: responds with appropriate message when sent a valid but non-existent article id", () => {
    return supertest(app)
      .get("/api/articles/200")
      .expect(404)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET /api retrieves data about all endpoints", () => {
    return supertest(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;

        expect(articles.length > 0).toBe(true);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });

  test("200: SORT data in descending order", () => {
    return supertest(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: Invalid sort by query)", () => {
    return supertest(app)
      .get("/api/articles?sort_by=nonsense")
      .expect(400)
      .then((res) => {
        const { msg } = res.body;
        expect(msg).toBe("Invalid sort by query");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: return all comments for a specific article", () => {
    return supertest(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("created_at");
        });
      });
  });
  test("200: SORT comments in descending order", () => {
    return supertest(app)
      .get("/api/articles/1/comments")

      .expect(200)
      .then((res) => {
        const { comments } = res.body;

        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("400: responds with appropriate message when sent non-existent article id", () => {
    return supertest(app)
      .get("/api/articles/not_an_id/comments")
      .expect(400)
      .then((res) => {
        const { msg } = res.body;

        expect(msg).toBe("Bad request");
      });
  });
});
