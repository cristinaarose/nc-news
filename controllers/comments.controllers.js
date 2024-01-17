const { removeComment } = require("../models/comments.models");

exports.deleteComment = (req, res, next) => {
  console.log("here");
  const { comment_id } = req.params;
  console.log(comment_id);
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log("error");
      next(err);
    });
};
