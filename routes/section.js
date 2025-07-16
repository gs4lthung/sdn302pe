var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  console.log("Session page accessed by:", req.session.username);
  res.render("session", {
    username: req.session.username,
    error: req.session.error,
  });
});

module.exports = router;
