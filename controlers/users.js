const Users = require("../models/user.js");

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Некоректные данные" });
      }
      res.status(500).send({ message: "У вас случилась ошибка" });
    });
};
