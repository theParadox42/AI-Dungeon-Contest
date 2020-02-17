var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Story = require("../models/story"),
    Contest = require("../models/contest");

router.get("/", middleware.isJudge, function(req, res) {
    res.render("judge/index");
});

router.get("/contests/:tag", middleware.isJudge, middleware.contestExists, function(req, res) {
    Contest.findById(req.contest._id).populate("stories").exec(function(err, foundContest) {
        if (err) {
            req.flash("error", "Error finding contest!");
        } else if (!foundContest) {
            req.flash("error", "No contest found!");
        } else {
            return res.render("judge/contests");
        }
        res.redirect("back");
    });
});

module.exports = router;