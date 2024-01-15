const { topicsData } = require("../db/data/test-data");
const db = require("../db/connection.js");

exports.fetchTopicData = () => {
  let query = `SELECT * FROM topics;`;

  return db.query(query).then((res) => {
    return res.rows;
  });
};
