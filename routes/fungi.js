const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Fungus = require('../models/fungus');
const { fungusSchema } = require('../schemas');


const fungusValidation = (req, res, next) => {

    const { error } = fungusSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', async (req, res) => {
    const fungi = await Fungus.find({});
    res.render('fungi/index', { fungi });
});

router.get('/new', (req, res) => {
    res.render('fungi/new');
});

router.post('/', fungusValidation, catchAsync(async (req, res, next) => {
    //if (!req.body.fungus) throw new ExpressError('Invalid Camprogund Data', 400);
    const fungus = new Fungus(req.body.fungus);
    await fungus.save();
    res.redirect(`fungi/${fungus._id}`);

}));

router.get('/:id', catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id).populate('reviews');
    res.render('fungi/show', { fungus });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id);
    res.render('fungi/edit', { fungus });
}));

router.put('/:id', fungusValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fungus = await Fungus.findByIdAndUpdate(id, { ...req.body.fungus });
    res.redirect(`/fungi/${fungus._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Fungus.findByIdAndDelete(id);
    res.redirect('/fungi');
}));

module.exports = router;