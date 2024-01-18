const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((usersData) => {
      res.status(200).send({ users: usersData });
    })
    .catch((err) => {
      next(err);
    });
};
