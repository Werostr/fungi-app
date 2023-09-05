const Joi = require("joi");

module.exports.fungusSchema = Joi.object({
  fungus: Joi.object({
    variety: Joi.string().required(),
    city: Joi.number().required(),
    country: Joi.string().required(),
    //image: Joi.string().required(),
    description: Joi.string().required(),
    poisonous: Joi.boolean().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
