const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const {loginUser , createUser} = require("./controlers/users");
const auth = require("./middlewares/auth")
const app = express();
// launch app
const { PORT = 3000 } = process.env;
// mongodb
mongoose.connect("mongodb://localhost:27017/mestodb");
// body-parser
app.use(express.json());
// use routes
app.use(routes);
//
app.post("/signup", createUser);
app.post("/signin", loginUser);
app.use(auth);
// wrong path
app.use("/*", (req, res) => {
  res.status(404).send({ message: "Ничего не нашлось" });
});
// check npm run
app.listen(PORT, () => {
  console.log(`приложение запущено на ${PORT} порту`);
});
// сделать валидацию joi ...
// до конца понять как должен работать вход
// сделать обработку ошибок в отдельной папке