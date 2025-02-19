const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('Connected to the database');
    }).catch((err) => {
        console.log(err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('index');
    });

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});