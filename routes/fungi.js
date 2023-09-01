const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Fungus = require('../models/fungus');
const { isLoggedIn, isAuthor, fungusValidation } = require('../middleware');


router.get('/', async (req, res) => {
    const fungi = await Fungus.find({});
    res.render('fungi/index', { fungi });
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('fungi/new');
});

router.post('/', isLoggedIn, fungusValidation, catchAsync(async (req, res, next) => {
    //if (!req.body.fungus) throw new ExpressError('Invalid Camprogund Data', 400);
    const fungus = new Fungus(req.body.fungus);
    fungus.author = req.user._id;
    await fungus.save();
    req.flash('success', 'Succesfully made');
    res.redirect(`fungi/${fungus._id}`);

}));

router.get('/:id', catchAsync(async (req, res) => {
    const fungus = await Fungus.findById(req.params.id).populate('reviews').populate('author');
    if (!fungus) {
        req.flash('error', "This fungus doesn't exist");
        return res.redirect("/fungi");
    }
    res.render('fungi/show', { fungus });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fungus = await Fungus.findById(id);
    if (!fungus) {
        req.flash('error', "This fungus doesn't exist");
        return res.redirect("/fungi");
    }
    res.render('fungi/edit', { fungus });
}));

router.put('/:id', isLoggedIn, isAuthor, fungusValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    const fungus = await Fungus.findByIdAndUpdate(id, { ...req.body.fungus });
    req.flash('success', 'Successfully updated');
    res.redirect(`/fungi/${fungus._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Fungus.findByIdAndDelete(id);
    req.flash('success', "Deleted fungus");
    res.redirect('/fungi');
}));

module.exports = router;