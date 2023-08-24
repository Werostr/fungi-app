// npm init -y
// npm i express mongoose ejs path method-override ejs-mate

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const Fungus = require('./models/fungus');

mongoose.connect('mongodb://127.0.0.1:27017/fungi-app');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("DATABASE CONNECTED");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/fungi', async (req, res) => {
    const fungi = await Fungus.find({});
    res.render('fungi/index', { fungi });
});

app.get('/fungi/new', (req, res) => {
    res.render('fungi/new');
});

app.post('/fungi', async (req, res) => {
    const fungus = new Fungus(req.body.fungus);
    await fungus.save();
    res.redirect(`fungi/${fungus._id}`);
});

app.get('/fungi/:id', async (req, res) => {
    const fungus = await Fungus.findById(req.params.id);
    res.render('fungi/show', { fungus });
});

app.get('/fungi/:id/edit', async (req, res) => {
    const fungus = await Fungus.findById(req.params.id);
    res.render('fungi/edit', { fungus });
});

app.put('/fungi/:id', async (req, res) => {
    const { id } = req.params;
    const fungus = await Fungus.findByIdAndUpdate(id, { ...req.body.fungus });
    res.redirect(`/fungi/${fungus._id}`);
});

app.delete('/fungi/:id', async (req, res) => {
    const { id } = req.params;
    const fungus = await Fungus.findByIdAndDelete(id);
    res.redirect('/fungi');
});

app.listen(3000, () => {
    console.log('ON PORT 3000');
});
;;
