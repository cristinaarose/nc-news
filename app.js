const express = require("express");
const {
  getTopics,
  getEndpoints,
} = require("./controllers/topics.controllers.js");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

module.exports = app;
