const db = require("../db/connection.js");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return result.rows[0];
    });
};

exports.fetchArticleData = (sort_by = "created_at", topic) => {
  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`;

  const allowedQuerySort = ["created_at"];

  if (!topic && sort_by === undefined) {
    return db.query(query).then((res) => {
      return res.rows;
    });
  }

  if (topic) {
    return db
      .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE topic = $1 GROUP BY articles.article_id ORDER BY created_at DESC`,
        [topic]
      )
      .then((res) => {
        if (res.rows.length === 0) {
          return Promise.reject({
            status: 400,
            msg: "Topic does not exist or have any related articles",
          });
        } else {
          return res.rows;
        }
      });
  }

  if (!allowedQuerySort.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort by query" });
  } else {
    query += ` ORDER BY ${sort_by} DESC;`;
  }

  return db.query(query).then((res) => {
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
