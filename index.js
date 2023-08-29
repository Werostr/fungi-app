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

const fungusValidation = (req, res, next) => {

    const { error } = fungusSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const ratingValidation = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/fungi', async (req, res) => {
    const fungi = await Fungus.find({});
    res.render('fungi/index', { fungi });
});

app.get('/fungi/new', (req, res) => {
    res.render('fungi/new');
});

app.post('/fungi', fungusValidation, catchAsync(async (req, res, next) => {
    //if (!req.body.fungus) throw new ExpressError('Invalid Camprogund Data', 400);
    const fungus = new Fungus(req.body.fungus);
    await fungus.save();
    res.redirect(`fungi/${fungus._id}`);

}));

app.get('/fungi/:id', catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id).populate('reviews');
    res.render('fungi/show', { fungus });
}));

app.get('/fungi/:id/edit', catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id);
    res.render('fungi/edit', { fungus });
}));

app.put('/fungi/:id', fungusValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fungus = await Fungus.findByIdAndUpdate(id, { ...req.body.fungus });
    res.redirect(`/fungi/${fungus._id}`);
}));

app.delete('/fungi/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Fungus.findByIdAndDelete(id);
    res.redirect('/fungi');
}));

app.post('/fungi/:id/reviews', ratingValidation, catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id);
    const review = new Review(req.body.review);
    fungus.reviews.push(review);
    await review.save();
    await fungus.save();
    res.redirect(`/fungi/${fungus._id}`);
}));

app.delete('/fungi/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Fungus.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/fungi/${id}`);
}));

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
