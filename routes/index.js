var express = require("express"),
    router  = express.Router({ mergeParams: true });

router.get("/", function(req, res) {
    res.render("home");
});

router.get("/preview", function(req, res) {
    res.render("preview");
});

router.get("*", function(req, res) {
    res.render("404");
});

router.post("*", function(req, res) {
    res.render("404");
})

module.exports = router;