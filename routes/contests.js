var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Contest = require("../models/contest"),
    validateContest = require("../utilities/validate-contest");

router.get("/", function(req, res) {
    Contest.find({}, function(err, contests) {
        if (err) {
            req.flash("error", "Error finding contests!");
            res.redirect("/");
        } else {
            contests = contests || [];
            var valueMap = ["open", "judging", "closed", "hidden"];
            var sortedContests = contests.sort(function(a, b) {
                return valueMap.indexOf(a) - valueMap.indexOf(b);
            });
            res.render("contests/index", { contests: sortedContests });
        }
    });
});

router.get("/new", middleware.isAdmin, function (req, res) {
    res.render("contests/new");
});

router.post("/", middleware.isAdmin, function(req, res) {
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
                if (newContest.status == "open") {
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

router.get("/:tag", middleware.contestExists, function(req, res) {
    res.render("contests/show", { contest: req.contest });
});

router.get("/:tag/manage", middleware.contestExists, middleware.isAdmin, function (req, res) {
    res.render("contests/manage", { contest: req.contest });
});

module.exports = router;