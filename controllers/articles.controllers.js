const {
  fetchArticleById,
  fetchArticleData,
  fetchArticleCommentData,
  insertCommentData,
  updateArticle,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((articleData) => {
      res.status(200).send({ article: articleData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  fetchArticleData(sort_by)
    .then((articleData) => {
      res.status(200).send({ articles: articleData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleCommentData(article_id)
    .then((articleCommentData) => {
      res.status(200).send({ comments: articleCommentData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  insertCommentData(newComment, article_id)
    .then((commentData) => {
      res.status(201).send({ comment: commentData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then((updatedArticleData) => {
      res.status(200).send({ article: updatedArticleData });
    })
    .catch((err) => {
      next(err);
    });
};
