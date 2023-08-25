const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FungusSchema = new Schema({
    variety: String,
    poisonous: Boolean,
    description: String,
    city: Number,
    country: String,
    image: String
});

module.exports = mongoose.model("Fungus", FungusSchema);