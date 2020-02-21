var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Story = require("../models/story"),
    Contest = require("../models/contest");

router.get("/", middleware.isJudge, function(req, res) {
    res.render("judge/index");
});

router.get("/criteria", function(req, res) {
    res.render("judge/criteria");
});

router.get("/contests", middleware.isJudge, function(req, res) {
    Contest.find({ status: "judging" }, function (err, contests) {
        if (err) {
            req.flash("error", "Error finding contest!");
        } else {
            contests = contests || [];
            return res.render("judge/contests", { contests: contests });
        }
        res.redirect("back");
    });
});

router.get("/contests/:tag", middleware.isJudge, middleware.contestIsJudging, function(req, res) {
    Contest.findById(req.contest._id).populate("stories").exec(function(err, foundContest) {
        if (err) {
            req.flash("error", "Error finding contest!");
        } else if (!foundContest) {
            req.flash("error", "No contest found!");
        } else {
            var judged = foundContest.stories.filter(function(story) {
                return story.scores.length > 0;
            }).length;
            var total = foundContest.stories.length;
            return res.render("judge/contest", { 
                contest: foundContest, 
                ration: { judged: judged, total: total }
            });
        }
        res.redirect("back");
    });
});
router.get("/contests/:tag/stories", middleware.isJudge, middleware.contestIsJudging, function(req, res) {
    Contest.findById(req.contest._id).populate("stories").exec(function (err, foundContest) {
        if (err) {
            req.flash("error", "Error finding contest!");
        } else if (!foundContest) {
            req.flash("error", "No contest found!");
        } else {
            return res.render("judge/stories");
        }
        res.redirect("back");
    });
});

router.get("/contests/:tag/stories/:storyid", middleware.isJudge, middleware.contestIsJudging, middleware.storyMatchesContest, function(req, res) {
    res.render("judge/story", { story: req.story });
});

module.exports = router;