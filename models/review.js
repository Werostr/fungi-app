const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: Boolean,
});

module.exports = mongoose.model("Review", reviewSchema);