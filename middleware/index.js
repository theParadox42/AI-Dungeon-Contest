var Contest = require("../models/contest"),
    Story   = require("../models/story"),
    moment  = require("moment");

var middleware = {};

// User Status Middleware
middleware.loggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Login to do that!");
    res.redirect("/login");
};
middleware.isntLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        req.flash("error", "Logout first!");
        return res.redirect("back");
    }
    next();
};
middleware.isAdmin = function(req, res, next) {
    middleware.loggedIn(req, res, function() {
        if (res.locals.isAdmin) {
            next();
        } else {
            req.flash("error", "You need to be an admin to do that!");
            res.redirect("/");
        }
    });
};
middleware.isJudge = function(req, res, next) {
    middleware.loggedIn(req, res, function() {
        if (res.locals.isJudge) {
            next();
        } else {
            req.flash("error", "You need to be an judge to do that!");
            res.redirect("/");
        }
    });
};

// Contest Checking
middleware.contestExists = function(req, res, next) {
    Contest.findOne({ tag: req.params.tag }, function(err, foundContest) {
        if (err) {
            req.flash("error", "Error finding contest!");
        } else if (!foundContest) {
            req.flash("error", "No contest found!");
        } else {
            // A bit of regular maintenence
            var today = new Date().getUTCDate();
            console.log()
            if ((foundContest.status == "open") && moment(foundContest.closingDate).isBefore(today)) {
                foundContest.status = "judging";
                foundContest.save();
            } else if (foundContest.status != "hidden" && moment(foundContest.closingDate).isAfter(today)) {
                foundContest.status = "open";
                foundContest.save();
            }
            // Check if its hidden or not
            if ((foundContest.status == "hidden" && res.locals.isAdmin) || foundContest.status != "hidden") {
                req.contest = foundContest;
                return next();
            } else {
                req.flash("error", "No contest found!");
            }
        }
        res.redirect("/contests");
    });
};
middleware.contestIsOpen = function (req, res, next) {
    middleware.contestExists(req, res, function () {
        if (req.contest.status == "open") {
            return next();
        }
        req.flash("error", "That contest isn't open!");
        res.redirect("/contests");
    });
};
middleware.contestIsJudging = function(req, res, next) {
    middleware.contestExists(req, res, function() {
        if (req.contest.status == "judging") {
            return next();
        }
        req.flash("error", "That contest isn't judging!");
        res.redirect("/judge/contests");
    });
};

// Relations Checking
middleware.storyMatchesContest = function(req, res, next) {
    middleware.contestExists(req, res, function() {
        Story.findById(req.params.storyid, function(err, foundStory) {
            if (err) {
                req.flash("error", "Error finding story!");
            } else if(!foundStory) {
                req.flash("error", "No story found!");
            } else {
                req.story = foundStory;
                return next();
            }
            res.redirect(`/contests/${req.contest.tag}/stories`)
        });
    });
};
middleware.ownsStory = function(req, res, next) {
    middleware.loggedIn(req, res, function() {
        middleware.storyMatchesContest(req, res, function() {
            if (req.story.author.username == req.user.username) {
                return next();
            } else {
                req.flash("error", "You do not own that story!");
            }
            res.redirect(`/contests/${req.contest.tag}/stories/${req.story._id}`)
        });
    });
};
middleware.canDelete = function(req, res, next) {
    middleware.loggedIn(req, res, function() {
        if (res.locals.isAdmin) {
            return next();
        } else if(req.params.storyid) {
            middleware.storyMatchesContest(req, res, function() {
                if (req.story.author.username == req.user.username) {
                    return next();
                } else {
                    req.flash("error", "You can't delete that!");
                    res.redirect("back");
                }
            });
        } else {
            req.flash("error", "You can't delete that!");
            res.redirect("back");
        }
    });
};

module.exports = middleware;