const express = require('express');
const app = express();
// const morgan = require('morgan'); // third party middleware - we will have to install this 
const logger = require('./logger.js');
const authorize = require('./authorize.js');

// req => middleware => res

// 1. use vs route
// 2. options - our own / express / third party

// Better to have the logger function in different file, and we can pass the middleware function to any route
// const logger = (req, res, next) => { // Must pass it on to next middleware unless you're terminating the whole cycle by sending back the response like we're sending 'Testing' here otherwise browser won't stop loading
//     const method = req.method;
//     const url = req.url;
//     const time = new Date().getFullYear();
//     console.log(method, url, time);
//     // res.send('Testing');
//     next();
// }

app.use([authorize, logger]); // Automatically pass the middleware, order matters so better to write this above if want to pass to all routes, this will be applied to routes below this line
// app.use('/api', logger); // Applies to url containing anything after /api 
// app.use([authorize, logger]); // Multiple middleware, can also be passed to single route in this way
// app.use(express.static('./public')); // build-in middleware
// app.use(morgan('tiny')); // third party - we will have to install it e.g. morgan

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>');
});

app.get('/about', (req, res) => {
    res.send('<h1>About Page</h1>');
});

app.get('/api/products', (req, res) => {
    res.send('<h1>Products Page</h1>');
});

app.get('/api/items', (req, res) => {
    res.send('<h1>Items Page</h1>');
});

app.listen(5000, () => {
    console.log('Server is listening on port 5000...');
});