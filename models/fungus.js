const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FungusSchema = new Schema({
    variety: String,
    poisonous: Boolean,
    description: String,
    city: Number,
    country: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model("Fungus", FungusSchema);