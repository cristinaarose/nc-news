const db = require("../db/connection.js");
const { sort } = require("../db/data/test-data/articles.js");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.body, articles.article_img_url,  COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return result.rows[0];
    });
};

exports.fetchArticleData = (sort_by = "created_at", topic, order) => {
  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.body, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  // error check order
  let upperCaseOrder;
  if (order !== undefined) {
    upperCaseOrder = order.toUpperCase();
  }
  if (upperCaseOrder !== "ASC" && upperCaseOrder !== undefined) {
    if (upperCaseOrder !== "DESC" && upperCaseOrder !== undefined) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  // querying the database
  if (topic) {
    query = query + ` WHERE topic = '${topic}'`;
  }
  query = query + ` GROUP BY articles.article_id`;

  if (order && sort_by) {
    query = query + ` ORDER BY ${sort_by} ${upperCaseOrder}`;
  }
  if (sort_by && order === undefined) {
    query = query + ` ORDER BY ${sort_by} DESC`; //might be asc, check
  }
  query = query + `;`;

  return db.query(query).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return res.rows;
  });
};

exports.fetchArticleCommentData = (article_id, sort_by = "created_at") => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertCommentData = (newComment, article_id) => {
  if (
    newComment.author === undefined ||
    newComment.body === undefined ||
    article_id === undefined
  ) {
    return Promise.reject({ status: 400, msg: "Invalid data entry" });
  }
  return db
    .query(
      `INSERT INTO comments (author, body, article_id, created_at, votes) 
        VALUES ($1, $2, $3 ,$4, $5) RETURNING*;`,

      [newComment.author, newComment.body, article_id, new Date(), 0]
    )
    .then((newComment) => {
      return newComment.rows[0];
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;`,
        [inc_votes, article_id]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }

        return result.rows[0];
      });
  }
};
