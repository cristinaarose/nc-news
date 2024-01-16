const { parse } = require("path");
const { fetchTopicData } = require("../models/topics.models.js");
const fs = require("fs/promises");

exports.getTopics = (req, res, next) => {
  fetchTopicData()
    .then((topicsData) => {
      res.status(200).send({ topics: topicsData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  fs.readFile(`./endpoints.json`, "utf8")
    .then((endpoints) => {
      const parsedEndpoints = JSON.parse(endpoints);
      res.status(200).send({ endpoint: parsedEndpoints });
    })
    .catch((err) => {
      next(err);
    });
};
