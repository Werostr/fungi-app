const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Fungus = require('../models/fungus');
const Review = require('../models/review');
const { reviewValidation } = require('../middleware');



router.post('/', reviewValidation, catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id);
    const review = new Review(req.body.review);
    fungus.reviews.push(review);
    await review.save();
    await fungus.save();
    req.flash('success', 'Created new review');
    res.redirect(`/fungi/${fungus._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Fungus.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Deleted review");
    res.redirect(`/fungi/${id}`);
}));

module.exports = router;