const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const cookieParser = require('cookie-parser');
const { loginUser , createUser} = require("./controlers/users");
// celebrate
const {celebrateSignin , celebrateSignup } = require("./utils/celebrate");
// launch app
const { PORT = 3000 } = process.env;
// mongodb
mongoose.connect("mongodb://localhost:27017/mestodb");
// cookie
app.use(cookieParser());
// body-parser
app.use(express.json());
// use routes
app.use(routes);
// create & login
app.post(
  "/signup",
  celebrateSignup,
  createUser
);
app.post(
  "/signin",
  celebrateSignin,
  loginUser,
);
// wrong path
app.use("/*", (req, res) => {
  res.status(404).send({ message: "Ничего не нашлось" });
});
// check npm run
app.listen(PORT, () => {
  console.log(`приложение запущено на ${PORT} порту`);
});
// сделать все тоже самое для cards
// пройти все тест