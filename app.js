const express = require('express');
const mongoose = require('mongoose');

const app = express();
// launch app
const { PORT = 3000 } = process.env;
// mongodb
mongoose.connect('mongodb://localhost:27017/mestodb ');

app.listen(PORT, () => {
  console.log(`приложение запущено на ${PORT} порту`);
});
