const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/not-found-err');

const app = express();
const sendErr = require('./middlewares/sendErr');
const { loginUser, createUser } = require('./controlers/users');
// celebrate
const { celebrateSignin, celebrateSignup } = require('./utils/celebrate');
// body-parser
app.use(express.json());
// cookie
app.use(cookieParser());
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
// use routes
app.use('/', auth, routes);
// wrong path
app.use('/*', (req, res, next) => {
  next(new NotFound('Неправильный путь'));
});
app.use(errors());
app.use(sendErr);
// check npm run
app.listen(PORT, () => {
  console.log(`приложение запущено на ${PORT} порту`);
});
