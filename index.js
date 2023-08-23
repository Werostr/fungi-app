// npm init -y
// npm i express mongoose ejs

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Fungus = require('./models/fungus');

mongoose.connect('mongodb://127.0.0.1:27017/fungi-app');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () =>{
    console.log("DATABASE CONNECTED");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req,res) =>{
    res.render('home')
});



app.get('/', (req,res) =>{
    res.render('home')
});

app.listen(3000, () => {
    console.log('ON PORT 3000')
});

