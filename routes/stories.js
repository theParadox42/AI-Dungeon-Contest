var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Story   = require("../models/story");

router.get("/", function(req, res) {
    res.render("stories/index");
});

router.get("/:storyid", function(req, res) {
    Story.findById(req.params.storyid, function(err, foundStory) {
        if (err) {
            req.flash("error", "Error finding story");
            res.redirect("/stories");
        } else if(!foundStory) {
            req.flash("error", "No story found");
            res.redirect("/stories");
        } else {
            res.render("stories/show", { story: foundStory });
        }
    });
});

router.get("/new", middleware.loggedIn, function(req, res) {
    res.render("stories/new");
});

router.get("/edit/:storyid", function(req, res) {
    res.render("stories/edit");
});

module.exports = router;