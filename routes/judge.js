var express     = require("express"),
    router      = express.Router({ mergeParams: true }),
    request     = require("request"),
    middleware  = require("../middleware"),
    Story       = require("../models/story"),
    Contest     = require("../models/contest");

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
        res.redirect("/judge");
    });
});
router.get("/contests/:tag", middleware.isJudge, middleware.contestIsJudging, function(req, res) {
    Contest.findById(req.contest._id).populate("stories").exec(function (err, foundContest) {
        if (err) {
            req.flash("error", "Error finding contest!");
        } else if (!foundContest) {
            req.flash("error", "No contest found!");
        } else {
            var judged = foundContest.stories.filter(function (story) {
                return story.scores.length > 0;
            });
            var unjudged = foundContest.stories.filter(function (story) {
                return story.scores.length == 0;
            });
            return res.render("judge/contest", { stories: { judged: judged, unjudged: unjudged }, contest: foundContest });
        }
        res.redirect(`/judge/contests/${req.contest.tag}/stories`);
    });
});

router.get("/contests/:tag/stories/:storyid", middleware.isJudge, middleware.contestIsJudging, middleware.storyMatchesContest, function(req, res) {
    if (!req.story.referenceId) {
        req.story = validateStory.fixStory(req.story);
    }
    request("https://api.aidungeon.io/explore/sessions/" + req.story.referenceId, function(error, response, body) {
        var storyData;
        var userVerified = false;
        if (error || response.statusCode != 200) {
            storyData = "error";
        } else {
            storyData = JSON.parse(body);
            if (storyData.user.username == req.story.author.username) {
                userVerified = true;
            }
        }
        res.render("judge/story", { story: req.story, storyData: storyData, userVerified: userVerified });
    });
});

router.post("/contests/:tag/stories/:storyid/score", middleware.isJudge, middleware.contestIsJudging, middleware.storyMatchesContest, function(req, res) {
    var scores = {};
    function validateScore(key) {
        var v = parseInt(req.body[key], 10);
        if (typeof v == "number" && v >= 1 && v <= 10) {
            scores[key] = v;
            return true;
        }
        return false;
    }
    if (validateScore("relevancy") &&
        validateScore("humor") &&
        validateScore("entertainment") &&
        validateScore("creativity")) {
        scores.judge = req.user._id;
        var scoreIndex = req.story.scores.findIndex(function (score) {
            return req.user._id.equals(score.judge);
        });
        if (scoreIndex >= 0) {
            req.story.scores[scoreIndex] = scores;
        } else {
            req.story.scores.push(scores);
        }
        req.story.save();
        req.flash("success", "Rated Story!");
        res.redirect(`/judge/contests/${req.contest.tag}`);
    } else {
        req.flash("error", "Bad scoring format!");
        res.redirect("back");
    }
});

module.exports = router;
