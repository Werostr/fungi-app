const Fungus = require("../models/fungus");

module.exports.index = async (req, res) => {
  const fungi = await Fungus.find({});
  res.render("fungi/index", { fungi });
};

module.exports.renderNewForm = (req, res) => {
  res.render("fungi/new");
};

module.exports.createFungus = async (req, res, next) => {
  const fungus = new Fungus(req.body.fungus);
  fungus.author = req.user._id;
  await fungus.save();
  req.flash("success", "Succesfully made");
  res.redirect(`fungi/${fungus._id}`);
};

module.exports.showFungus = async (req, res) => {
  const fungus = await Fungus.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!fungus) {
    req.flash("error", "This fungus doesn't exist");
    return res.redirect("/fungi");
  }
  res.render("fungi/show", { fungus });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const fungus = await Fungus.findById(id);
  if (!fungus) {
    req.flash("error", "This fungus doesn't exist");
    return res.redirect("/fungi");
  }
  res.render("fungi/edit", { fungus });
};

module.exports.updateFungus = async (req, res) => {
  const { id } = req.params;
  const fungus = await Fungus.findByIdAndUpdate(id, { ...req.body.fungus });
  req.flash("success", "Successfully updated");
  res.redirect(`/fungi/${fungus._id}`);
};

module.exports.deleteFungus = async (req, res) => {
  const { id } = req.params;
  await Fungus.findByIdAndDelete(id);
  req.flash("success", "Deleted fungus");
  res.redirect("/fungi");
};
