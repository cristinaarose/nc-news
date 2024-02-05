const { topicsData } = require("../db/data/test-data");
const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.fetchTopicData = () => {
  let query = `SELECT * FROM topics;`;

  return db.query(query).then((res) => {
    return res.rows;
  });
};

exports.checkTopicExists = (topic) => {
  console.log("topic=", topic);
  if (topic === "") {
    return true;
  }
  return db
    .query(`SELECT * FROM topics WHERE topics.slug = '${topic}'`)
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 200,
          msg: "Topic does not have any related articles",
        });
      } else {
        return true;
      }
    });
};
