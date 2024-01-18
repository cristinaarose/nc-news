const db = require("../db/connection.js");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return result.rows;
  });
};
