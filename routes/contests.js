var express         = require("express"),
    router          = express.Router({ mergeParams: true }),
    middleware      = require("../middleware"),
    Contest         = require("../models/contest"),
    Story           = require("../models/story"),
    User            = require("../models/user"),
    validateContest = require("../utilities/validate/contest"),
    contestQuery    = require("../utilities/contest-query");

// Contest Page
router.get("/", function(req, res) {
    Contest.find(contestQuery(req, res), function(err, contests) {
        if (err) {
            req.flash("error", "Error finding contests!");
            res.redirect("/");
        } else {
            contests = contests || [];
            var valueMap = ["hidden", "pending", "open", "judging", "closed"];
            var sortedContests = contests.sort(function(a, b) {
                return valueMap.indexOf(a.status) - valueMap.indexOf(b.status);
            });
            res.render("contests/index", { contests: sortedContests });
        }
    });
});
// Create form
router.get("/new", middleware.isWriter, function (req, res) {
    res.render("contests/new");
});
// Create contest
router.post("/", middleware.isWriter, function(req, res) {
    var newContest = validateContest(req.body);
    if (newContest) {
        Contest.findOne({ tag: newContest.tag }, function(err, existingContest) {
            if (err) {
                req.flash("error", "Error finding contests");
            } else if (existingContest) {
                req.flash("error", "Tag name already exists");
            } else {
                newContest.creator = {
                    username: req.user.username,
                    id: req.user._id
                };
                if (newContest.status != "pending" && !res.locals.isAdmin) {
                    newContest.status = "pending";
                } else if (newContest.status == "open") {
                    newContest.openingDate = Date.now();
                }
                Contest.create(newContest, function(err, createdContest) {
                    if (err) {
                        req.flash("error", "Error creating contest!");
                    } else if (!createdContest) {
                        req.flash("error", "No contest created!");
                    } else {
                        req.flash("success", "Successfully created contest!");
                        return res.redirect(`/contests/${createdContest.tag}`);
                    }
                    res.redirect("back");
                });
                return;
            }
            res.redirect("back");
        });
    } else {
        req.flash("error", "Bad contest format!");
        res.redirect("back");
    }
});
// Get specific contest
router.get("/:tag", middleware.contestExists, function(req, res) {
    res.render("contests/show", { contest: req.contest });
});
// Contest managing menu
router.get("/:tag/manage", middleware.contestExists, middleware.isAdmin, function (req, res) {
    res.render("contests/manage", { contest: req.contest });
});
// Edit the specifics of a contest
router.get("/:tag/edit", middleware.contestExists, middleware.isAdmin, function(req, res) {
    res.render("contests/edit", { contest: req.contest });
});
// Update a contest
router.put("/:tag", middleware.contestExists, middleware.isAdmin, function(req, res) {
    var updateContest = validateContest(req.body, true, true);
    if (updateContest) {
        Contest.findByIdAndUpdate(req.contest._id, { $set: updateContest }, function(err, updatedContest) {
            if (err) {
                req.flash("error", "Error updating contest");
            } else if(!updatedContest) {
                req.flash("error", "No contest found!");
            } else {
                req.flash("success", "Successfully updated contest!");
                return res.redirect(`/contests/${updatedContest.tag}/manage`);
            }
            res.redirect("back");
        });
    } else {
        req.flash("error", "Bad contest format");
        res.redirect("back");
    }
});
// Menu to change the status
router.get("/:tag/status/:status", middleware.newStatusIsValid, middleware.isAdmin, function(req, res) {
    res.render("contests/status", { contest: req.contest, newStatus: req.params.status });
});
// Update the status
router.post("/:tag/status/:status", middleware.newStatusIsValid, middleware.isAdmin, function(req, res) {
    Contest.findByIdAndUpdate(req.contest._id, { $set: { status: req.params.status } }, function(err, updatedContest){
        if (err) {
            req.flash("error", "Error setting status");
        } else if (!updatedContest) {
            req.flash("error", "No contest found to update!");
        } else {
            if (req.params.status == "open" && updatedContest.status != "open") {
                updatedContest.openingDate = Date.now();
                updatedContest.save();
            }
            req.flash("success", "Succesfully set the status of the contest!");
        }
        res.redirect(`/contests/${ req.params.tag }/manage`);
    });
});
// Get the delete confirmation
router.get("/:tag/delete", middleware.contestExists, middleware.isAdmin, function(req, res) {
    res.render("contests/delete", { contest: req.contest });
});
// Delete contest and associated contests
router.delete("/:tag", middleware.contestExists, middleware.isAdmin, function(req, res) {
    Contest.findByIdAndDelete(req.contest._id).populate("stories").exec(function(err, deletedContest) {
        if (err) {
            req.flash("error", "Error deleting contest!");
        } else if(!deletedContest) {
            req.flash("error", "No Contest found to delete");
        } else {
            Story.deleteMany({ "contest.tag": deletedContest.tag }, function(err) {
                if (err) {
                    req.flash("error", "Deleted Contest but not stories")
                } else if(!deletedContest.stories) {
                    req.flash("error", "No stories found to delete!");
                } else if(deletedContest.stories.length <= 0) {
                    req.flash("success", "Deleted contest!");
                } else {
                    var si = 0;
                    function findStory(item) {
                        return deletedContest.stories[si]._id.equals(item);
                    }
                    function deleteStory() {
                        User.findById(deletedContest.stories[si].author.id, function(err, userOwner) {
                            if (userOwner) {
                                var userIndex = userOwner.stories.findIndex(findStory);
                                if (userIndex >= 0) {
                                    userOwner.stories.splice(userIndex, 1);
                                    userOwner.save();
                                }
                            }
                            si ++;
                            if (si >= deletedContest.stories.length) {
                                req.flash("success", "Successfully deleted contest");
                                res.redirect("/contests");
                            } else {
                                deleteStory();
                            }
                        });
                    };
                    deleteStory();
                    return;
                }
                res.redirect("/contests");
            });
            return;
        }
        res.redirect("/contests");
    });
});

module.exports = router;