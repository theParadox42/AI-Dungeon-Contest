var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Contest = require("../models/contest");

router.get("/", function(req, res) {
    Contest.find({}, function(err, contests) {
        if (err) {
            req.flash("error", "Error finding contests!");
            res.redirect("/");
        } else {
            contests = contests || [];
            var valueMap = ["open", "judging", "closed", "hidden"];
            var sortedContests = contests.sort(function(a, b) {
                return valueMap.indexOf(a) - valueMap.indexOf(b);
            });
            res.render("contests/index", { contests: sortedContests });
        }
    });
});

router.get("/new", middleware.isAdmin, function (req, res) {
    res.render("contests/new");
});

router.get("/:tag", middleware.contestExists, function(req, res) {
    res.render("contests/show", { contest: req.contest });
});

router.get("/:tag/manage", middleware.contestExists, middleware.isAdmin, function (req, res) {
    res.render("contests/manage", { contest: req.contest });
});

module.exports = router;