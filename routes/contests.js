var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware");

router.get("/", function(req, res) {
    Contests.find({}, function(err, contests) {
        if (err) {
            req.flash("error", "Error finding contests!");
            res.redirect("/");
        } else  {
            res.render("contests/index", { contests: contests });
        }
    });
});

router.get("/:tag", middleware.contestExists, function(req, res) {
    res.render("contests/show", { contest: req.contest });
});

module.exports = router;