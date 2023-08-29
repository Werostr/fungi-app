const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review');

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

FungusSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model("Fungus", FungusSchema);