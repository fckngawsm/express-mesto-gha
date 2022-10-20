const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
// launch app
const { PORT = 3000 } = process.env;
// mongodb
mongoose.connect("mongodb://localhost:27017/mestodb");
// middleware
app.use((req, res, next) => {
  req.user = {
    _id: "635056510deb5bf198ecb622",
  };
  next();
});
// body-parser
app.use(express.json());
// use routes
app.use(routes);
// check npm run
app.listen(PORT, () => {
  console.log(`приложение запущено на ${PORT} порту`);
});
