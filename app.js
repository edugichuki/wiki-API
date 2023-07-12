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

//? Request Targeting All Articles
app
  .route("/articles")
  .get((req, res) => {
    //? Code to query our db and find all the docs inside the articles collection.
    Article.find()
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(() => {
        res.send("Successfully created a new article");
      })
      .catch((err) => res.send(err));
  })
  .delete((req, res) => {
    //? Code for how the server will respond to this request
    Article.deleteMany()
      .then(() => {
        res.send("Successfully deleted all articles");
      })
      .catch((err) => res.send(err));
  });

//? Request Targeting A Specific Article
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        res.send(foundArticle);
      })
      .catch((error) => {
        res.send("No article matching that title was found");
      });
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle }, //! Condition
      { title: req.body.title, content: req.body.content }, //! Update
      { overwrite: true }
    )
      .then((updatedArticle) => {
        res.send("Successfully updated article ✅");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body }
    )
      .then(() => {
        res.send("Successfully updated the selected article");
      })
      .catch((err) => {
        res.send(err.message);
      });
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(() => {
        res.send("Successfully deleted " + req.params.articleTitle);
      })
      .catch((err) => {
        res.send(err.message);
      });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
