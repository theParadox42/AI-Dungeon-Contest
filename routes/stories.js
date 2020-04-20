var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    request         = require("request"),
    middleware      = require("../middleware"),
    Story           = require("../models/story"),
    Contest         = require("../models/contest"),
    validateStory   = require("../utilities/validate/story"),
    sortStories     = require("../utilities/sort-stories"),
    deleteStory     = require("../utilities/delete-story");

// Gets the stories for the current contest
router.get("/", middleware.contestExists, function(req, res) {
    Contest.findById(req.contest._id).populate("stories").exec(function(err, foundContest) {
        if (err) {
            req.flash("error", "Error finding stories!");
        } else if (!foundContest) {
            req.flash("error", "No contest found!");
        } else {
            return res.render("stories/index", { stories: sortStories(foundContest.stories), contest: foundContest });
        }
        res.redirect("back");
    });
});

// Form to create a story
router.get("/new", middleware.contestIsOpen, middleware.loggedIn, function(req, res) {
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
router.post("/", middleware.contestIsOpen, middleware.loggedIn, function(req, res) {
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
                newStory.votes = [req.user._id];
                Story.create(newStory, function(err, createdStory) {
                    if (err) {
                        req.flash("error", "Error creating story!");
                    } else if(!createdStory) {
                        req.flash("error", "No story created!");
                    } else {
                        req.user.stories.push(createdStory._id);
                        req.user.save();
                        req.contest.stories.push(createdStory._id);
                        req.contest.save();
                        req.flash("success", "Successfully created story!");
                        res.redirect(`/contests/${req.params.tag}/stories/${createdStory._id}`);
                        return;
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
    if (!req.story.referenceId) {
        req.story = validateStory.fixStory(req.story);
    }
    request("https://api.aidungeon.io/public/stories?publicId=" + req.story.referenceId, function(error, response, body) {
        var storyData;
        if (error || response.statusCode != 200) {
            storyData = "error";
        } else {
            storyData = JSON.parse(body);
        }
        if (req.user) {
            if (req.story.votes.some(vote => req.user._id.equals(vote))) {
                req.story.voted = true;
            }
        }
        res.render("stories/show", { story: req.story, contest: req.contest, storyData: storyData });
    });
});


// Form to edit a story
router.get("/:storyid/edit", middleware.ownsStory, middleware.contestIsOpen, function(req, res) {
    res.render("stories/edit", { story: req.story, contest: req.contest });
});
// Update a story
router.put("/:storyid", middleware.ownsStory, middleware.contestIsOpen, middleware.storyMatchesContest, function(req, res) {
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
                return res.redirect(`/contests/${req.contest.tag}/stories/${updatedStory._id}`);
            }
            res.redirect("back");
        });
    } else {
        req.flash("error", "Bad story format!");
        res.redirect("back");
    }
});
// Vote story
router.post("/:storyid/vote", middleware.loggedIn, middleware.storyMatchesContest, function(req, res) {
    if (req.story.votes.some(vote => req.user._id.equals(vote))) {
        req.flash("error", "You have already voted for that story!");
    } else {
        req.story.votes.push(req.user._id);
        req.story.save();
        req.flash("success", "Voted story!");
    }
    res.redirect("back");
});
// Delete a story
router.delete("/:storyid", middleware.canDelete, function(req, res) {
    deleteStory(req.params.storyid, function(err, success) {
        if (err) {
            req.flash("error", err);
        } else {
            req.flash("success", success);
        }
        res.redirect(`/profile/${req.user.username}`);
    });
});

module.exports = router;