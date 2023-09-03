const Fungus = require("../models/fungus");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const fungus = await Fungus.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  fungus.reviews.push(review);
  await review.save();
  await fungus.save();
  req.flash("success", "Created new review");
  res.redirect(`/fungi/${fungus._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Fungus.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Deleted review");
  res.redirect(`/fungi/${id}`);
};
