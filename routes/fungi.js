const express = require("express");
const router = express.Router();
const fungi = require("../controllers/fungi");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, fungusValidation } = require("../middleware");

router
  .route("/")
  .get(catchAsync(fungi.index))
  .post(isLoggedIn, fungusValidation, catchAsync(fungi.createFungus));

router.get("/new", isLoggedIn, fungi.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(fungi.showFungus))
  .put(isLoggedIn, isAuthor, fungusValidation, catchAsync(fungi.updateFungus))
  .delete(isLoggedIn, isAuthor, catchAsync(fungi.deleteFungus));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(fungi.renderEditForm));

module.exports = router;
