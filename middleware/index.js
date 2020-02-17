var Contest = require("../models/contest"),
    Story   = require("../models/story");

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
        if (req.locals.isJudge) {
            next();
        } else {
            req.flash("error", "You need to be an judge to do that!");
            res.redirect("/");
        }
    });
};

// Data checking
middleware.contestExists = function(req, res, next) {
    Contest.findOne({ tag: req.params.tag }, function(err, foundContest) {
        if (err) {
            req.flash("error", "Error finding contest!");
        } else if (!foundContest) {
            req.flash("error", "No contest found!");
        } else {
            if (contest.status == "hidden") {
                if (res.locals.isAdmin) {
                    req.contest = foundContest;
                    return next();
                } else {
                    req.flash("error", "No contest found!");
                }
            } else {
                req.contest = foundContest;
                return next();
            }
        }
        res.redirect("/contests");
    });
};

// Relations Checking
middleware.ownsStory = function(req, res, next) {
    middleware.loggedIn(req, res, function() {
        Story.findById(req.params.storyid, function(err, foundStory) {
            if (err) {
                req.flash("error", "Error finding story!");
            } else if(!foundStory) {
                req.flash("error", "No story found!");
            } else if (foundStory.author.username == req.user.username) {
                req.story = foundStory;
                return next();
            } else {
                req.flash("error", "You do not own that story!");
            }
            res.redirect("back")
        });
    });
};

module.exports = middleware;