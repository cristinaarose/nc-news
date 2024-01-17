const db = require("../db/connection.js");

exports.removeComment = (comment_id) => {
  console.log("in models");
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
