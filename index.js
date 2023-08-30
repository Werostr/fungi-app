// npm init -y
// npm i express mongoose ejs path method-override ejs-mate joi

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const Fungus = require('./models/fungus');
const Review = require('./models/review');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { fungusSchema, reviewSchema } = require('./schemas');

const fungi = require('./routes/fungi');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/fungi-app');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("DATABASE CONNECTED");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("/public"));

app.use('/fungi', fungi);
app.use('/fungi/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'something went wrong';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('ON PORT 3000');
});
;;
