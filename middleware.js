const ExpressError = require('./utils/ExpressError');
const Fungus = require('./models/fungus');
const { fungusSchema, reviewSchema } = require('./schemas');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.fungusValidation = (req, res, next) => {

    const { error } = fungusSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const fungus = await Fungus.findById(id);
    if (!fungus.author.equals(req.user._id)) {
        req.flash('error', "You can't do that");
        return res.redirect(`/fungi/${id}`);
    }
    next();
};


module.exports.reviewValidation = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};