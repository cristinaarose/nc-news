const {
  fetchArticleById,
  fetchArticleData,
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
