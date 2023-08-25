const Joi = require('joi');

module.exports.fungusSchema = Joi.object({
    fungus: Joi.object({
        variety: Joi.string().required(),
        city: Joi.number().required(),
        country: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        poisonous: Joi.boolean().required(),
    }).required()
});