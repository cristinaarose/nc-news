const db = require("../db/connection.js");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return result.rows[0];
    });
};

exports.fetchArticleData = (sort_by = "created_at") => {
  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`;

  const allowedQuerySort = ["created_at"];

  if (!allowedQuerySort.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort by query" });
  } else {
    query += ` ORDER BY ${sort_by} DESC;`;
  }

  return db.query(query).then((res) => {
    return res.rows;
  });
};
