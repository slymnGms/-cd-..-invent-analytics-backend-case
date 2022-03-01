module.exports = app => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();
  router.post("/", users.create);
  router.get("/", users.findAll);
  router.get("/:id", users.findOne);
  router.post("/:user_id/borrow/:book_id", users.borrowBook);
  router.post("/:user_id/return/:book_id", users.returnBook);
  app.use('/users', router);
};