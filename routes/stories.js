var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Story   = require("../models/story");

// Gets the stories for the current contest
router.get("/", middleware.contestExists, function(req, res) {
    res.render("stories/index");
});

// gets a specific story
router.get("/:storyid", middleware.contestExists, function(req, res) {
    Story.findById(req.params.storyid, function(err, foundStory) {
        if (err) {
            req.flash("error", "Error finding story");
        } else if(!foundStory) {
            req.flash("error", "No story found");
        } else if(foundStory.contest.tag != req.contest.tag) {
            req.flash("error", "The story doesn't match the contest!");
        } else {
            return res.render("stories/show", { story: foundStory });
        }
        res.redirect(`/contests/${req.params.tag}/stories`);
    });
});

// Form to create a story
router.get("/new", middleware.contestExists, middleware.loggedIn, function(req, res) {
    res.render("stories/new");
});

// Create a story
router.post("/", middleware.contestExists, middleware.loggedIn, function(req, res) {
    var body = req.body;
    
    // Check the format
    if (typeof body.name == "string" &&
        typeof body.link == "string" &&
        typeof body.description == "string") {
        
        // Limit to one submission per contest
        Story.findOne({
            "contest.tag": req.params.tag,
            "author.username": req.user.username
        }, function(err, foundStory) {
            if (err) {
                req.flash("error", "Error validating story");
                res.redirect("back");
            } else if(foundStory) {
                req.flash("error", "You have already submitted a story for this contest, edit it instead");
                res.redirect(`/contests/${req.params.tag}/stories/${foundStory._id}/edit`);
            } else {
                // Create object
                var newStory = {
                    title: body.title,
                    link: body.link,
                    description: body.description,
                    author: {
                        username: req.user.username,
                        id: req.user._id
                    },
                    contest: {
                        tag: req.contest.tag,
                        id: req.contest._id
                    }
                }
                Story.create(newStory, function(err, createdStory) {
                    if (err) {
                        req.flash("error", "Error creating story!");
                    } else if(!createdStory) {
                        req.flash("error", "No story created!");
                    } else {
                        req.flash("success", "Successfully created story!");
                        return res.redirect(`/contests/${req.params.tag}/stories/${createdStory._id}`);
                    }
                    res.redirect("back");
                });
            }
        });
    } else {
        req.flash("error", "Bad Request!");
        res.redirect("back");
    }
});

// Form to edit a story
router.get("/:storyid/edit", middleware.contestExists, middleware.ownsStory, function(req, res) {
    res.render("stories/edit");
});

router.put("/:storyid", middleware.contestExists, middleware.ownsStory, function(req, res) {

});

module.exports = router;