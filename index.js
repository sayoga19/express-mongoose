const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('Connected to the database');
    }).catch((err) => {
        console.log(err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('index');
    });

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products });
    });
    
app.get('/products/create', (req, res) => {
    res.render('products/create');
    });

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/products/${product._id}`);
    });

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
    });


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});