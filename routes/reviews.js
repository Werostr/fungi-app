const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const {
  reviewValidation,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  reviewValidation,
  catchAsync(reviews.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
