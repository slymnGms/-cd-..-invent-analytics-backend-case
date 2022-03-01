module.exports = app => {
  const books = require("../controllers/book.controller.js");
  var router = require("express").Router();
  router.post("/", books.create);
  router.get("/", books.findAll);
  router.get("/:id", books.findOne);

  app.use('/books', router);
};