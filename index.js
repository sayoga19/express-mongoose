const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const ErrorHandler = require('./ErrorHandler');

const Product = require('./models/product');
const { error } = require('console');

mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('Connected to the database');
    }).catch((err) => {
        console.log(err);
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

app.get('/', (req, res) => {
    res.send('index');
});

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }
});
    
app.get('/products/create', (req, res) => {
    res.render('products/create');
});

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/products/${product._id}`);
});

app.get('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const product = await Product.findById(id)
        res.render('products/show', { product });
}));

app.get('/products/:id/edit', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/edit', { product }); 
}));

app.put('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true});
        res.redirect(`/products/${product._id}`); 
}));

app.delete('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/products');  
}));

app.use((err, req, res, next) => {
    if(err.name === 'ValidationError') {
        err.status = 400;
        err.message = 'Validation Error';
    }
    if(err.name === 'CastError') {
        err.status = 404;
        err.message = 'Product not found';
    }
    next(err);
});

app.use((err, req, res, next) => {
    const { message = 'Something went wrong', status = 500 } = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});