var express = require("express"),
    router  = express.Router();

router.get("/", function(req, res) {
    res.send("Welcome!");
});

router.get("*", function(req, res) {
    res.render("404");
});

module.exports = router;