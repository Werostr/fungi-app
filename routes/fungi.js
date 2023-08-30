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
    req.flash('success', 'Succesfully made');
    res.redirect(`fungi/${fungus._id}`);

}));

router.get('/:id', catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id).populate('reviews');
    if (!fungus) {
        req.flash('error', "This fungus doesn't exist");
        return res.redirect("/fungi");
    }
    res.render('fungi/show', { fungus });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id);
    if (!fungus) {
        req.flash('error', "This fungus doesn't exist");
        return res.redirect("/fungi");
    }
    res.render('fungi/edit', { fungus });
}));

router.put('/:id', fungusValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fungus = await Fungus.findByIdAndUpdate(id, { ...req.body.fungus });
    req.flash('success', 'Successfully updated');
    res.redirect(`/fungi/${fungus._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Fungus.findByIdAndDelete(id);
    req.flash('success', "Deleted fungus");
    res.redirect('/fungi');
}));

module.exports = router;