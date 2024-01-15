const express = require("express");

const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controllers.js");

app.get("/api/topics", getTopics);

//app.patch("/api/treasures", patchTreasures);

// app.use((err, req, res, next) => {
//   console.log(err);
//   if (err.msg && err.status) {
//     res.status(err.status).send({ msg: err.msg });
//   }
// });

module.exports = app;
