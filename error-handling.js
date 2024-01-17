const express = require("express");
const app = express();
app.use(express.json());

function errorHandling(app) {
  app.use((err, req, res, next) => {
    if (err.code === "23503") {
      res.status(404).send({ msg: "Not found" });
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err.msg === "Not found") {
      res.status(404).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err.msg && err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Bad request" });
    } else {
      next(err);
    }
  });
}

module.exports = { errorHandling };
