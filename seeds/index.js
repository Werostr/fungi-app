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
      images: [
        {
          url: "https://res.cloudinary.com/dhxufgysz/image/upload/v1693849442/FungiApp/vpsi8jn9qotbbr9fohs7.jpg",
          filename: "FungiApp/vpsi8jn9qotbbr9fohs7",
        },
        {
          url: "https://res.cloudinary.com/dhxufgysz/image/upload/v1693849443/FungiApp/nbgqeryksusczj31l5x2.jpg",
          filename: "FungiApp/nbgqeryksusczj31l5x2",
        },
      ],
      author: `${varieties[i].author}`,
    });
    await f.save();
  }
};
seedDB();
