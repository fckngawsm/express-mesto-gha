const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');
const app = express();
// launch app
const { PORT = 3000 } = process.env;
// mongodb
mongoose.connect('mongodb://localhost:27017/mestodb');
// Пересмотреть вебинар

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`приложение запущено на ${PORT} порту`);
});


