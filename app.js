//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config({ path: "vars/.env" });

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//? "mongodb://127.0.0.1:27017/wikiDB"
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database!!" + err.message);
  });

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articlesSchema);

app.get("/articles", (req, res) => {
  //? Code to query our db and find all the docs inside the articles collection.
  Article.find().then((foundArticles) => {
    console.log(foundArticles);
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
