const express = require("express");
const {
  getTopics,
  getEndpoints,
} = require("./controllers/topics.controllers.js");
const {
  getArticleById,
  getArticles,
  getArticleComments,
  postComment,
  patchArticle,
} = require("./controllers/articles.controllers.js");
const { errorHandling } = require("./error-handling.js");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

errorHandling(app);

module.exports = app;
