const mongoose = require("mongoose");
const Fungus = require("../models/fungus");
const varieties = require("./varieties");

mongoose.connect("mongodb://127.0.0.1:27017/fungi-app");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

const seedDB = async () => {
  await Fungus.deleteMany({});
  for (let i = 0; i < 5; i++) {
    const f = new Fungus({
      variety: `${varieties[i].variety}`,
      poisonous: `${varieties[i].poisonous}`,
      description: `${varieties[i].description}`,
      city: `${varieties[i].city}`,
      country: `${varieties[i].country}`,
      image: `${varieties[i].image}`,
    });
    await f.save();
  }
};

seedDB();
