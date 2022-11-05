const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { loginUser, createUser } = require('./controlers/users');
const { celebrateSignin, celebrateSignup } = require('./utils/celebrate');

const app = express();
// body-parser
app.use(express.json());
// cookie
app.use(cookieParser());
// use routes
app.use(routes);
// launch app
const { PORT = 3000 } = process.env;
// mongodb
mongoose.connect('mongodb://localhost:27017/mestodb');
// create & login
app.post(
  '/signup',
  celebrateSignup,
  createUser,
);
app.post(
  '/signin',
  celebrateSignin,
  loginUser,
);
// wrong path
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Ничего не нашлось' });
});
// check npm run
app.listen(PORT, () => {
  console.log(`приложение запущено на ${PORT} порту`);
});
// сделать все тоже самое для cards
// пройти все тест
