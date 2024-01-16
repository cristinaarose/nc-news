const express = require("express");
const {
  getTopics,
  getEndpoints,
} = require("./controllers/topics.controllers.js");
const { getArticleById } = require("./controllers/articles.controllers.js");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg === "Not found") {
    res.status(404).send({ msg: err.msg });
  }
});

module.exports = app;
