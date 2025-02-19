const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1/shop_db')
    .then((result) => {
        console.log('Connected to the database');
    }).catch((err) => {
        console.log(err);
    });

const seedProducts = [
    {
        name: 'Black T-shirt',
        brand: 'Nike',
        price: 100,
        color: 'Black',
        size: 'M'
    },
    {
        name: 'Red Hoodie',
        brand: 'Adidas',
        price: 200,
        color: 'Red',
        size: 'L'
    },
    {
        name: 'Blue Jeans',
        brand: 'Levis',
        price: 150,
        color: 'Blue',
        size: 'S'
    },
    {
        name: 'White Shirt',
        brand: 'Puma',
        price: 120,
        color: 'White',
        size: 'XL'
    }
];

Product.insertMany(seedProducts)
    .then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });