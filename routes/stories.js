var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Story   = require("../models/story"),
    validateStory = require("../utilities/validate-story");

// Gets the stories for the current contest
router.get("/", middleware.contestExists, function(req, res) {
    Story.find({ "contest.tag": req.params.tag }, function(err, foundStories) {
        if (err) {
            req.flash("error", "Error finding stories");
            return res.redirect("back");
        }
        res.render("stories/index", { contest: req.contest, stories: foundStories });
    });
});

// Form to create a story
router.get("/new", middleware.contestExists, middleware.loggedIn, function(req, res) {
    Story.findOne({
        "contest.tag": req.params.tag,
        "author.username": req.user.username
    }, function(err, foundStory) {
        if (err) {
            req.flash("error", "Error validating story");
            res.redirect("back");
        } else if(foundStory) {
            req.flash("error", "Only 1 entry allowed per contest, edit yours instead!");
            res.redirect(`/contests/${req.params.tag}/stories/${foundStory._id}/edit`);
        } else {
            res.render("stories/new", { contest: req.contest });
        }
    });
});

// Create a story
router.post("/", middleware.contestExists, middleware.loggedIn, function(req, res) {
    var body = req.body;
    
    // Check the format
    var newStory = validateStory(body);
    if (newStory) {
        
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
                newStory.author = {
                    username: req.user.username,
                    id: req.user._id
                };
                newStory.contest = {
                    tag: req.contest.tag,
                    id: req.contest._id
                }
                Story.create(newStory, function(err, createdStory) {
                    if (err) {
                        req.flash("error", "Error creating story!");
                    } else if(!createdStory) {
                        req.flash("error", "No story created!");
                    } else {
                        req.user.stories.push(createdStory._id);
                        req.user.save();
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


// gets a specific story
router.get("/:storyid", middleware.storyMatchesContest, function(req, res) {
    res.render("stories/show", { story: req.story, contest: req.contest });
});


// Form to edit a story
router.get("/:storyid/edit", middleware.ownsStory, middleware.contestIsOpen, function(req, res) {
    res.render("stories/edit", { story: req.story, contest: req.contest });
});
// Update a story
router.put("/:storyid", middleware.ownsStory, middleware.contestIsOpen, function(req, res) {
    var updateStory = validateStory(req.body);
    if (updateStory) {
        Story.findByIdAndUpdate(req.story._id, { $set: updateStory }, { new: true }, function(err, updatedStory) {
            if (err) {
                req.flash("error", "Error updating story!");
            } else if (!updatedStory) {
                req.flash("error", "No story updated!");
            } else {
                if (updatedStory.status != "hidden" && !updatedStory.openingDate) {
                    updatedStory.openingDate = Date.now();
                    updatedStory.save();
                }
                req.flash("success", "Successfully updated story!");
                return res.redirect(`/contests/$(req.contest.tag}/stories/${updatedStory._id}`);
            }
            res.redirect("back");
        });
    } else {
        req.flash("error", "Bad story fomrat!");
        res.redirect("back");
    }
});

module.exports = router;