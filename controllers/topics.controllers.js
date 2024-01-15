const { fetchTopicData } = require("../models/topics.models.js");

exports.getTopics = (req, res, next) => {
  fetchTopicData()
    .then((topicsData) => {
      res.status(200).send({ topics: topicsData });
    })
    .catch((err) => {
      next(err);
    });
};
