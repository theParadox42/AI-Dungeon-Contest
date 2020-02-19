var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Story   = require("../models/story");

router.get("/stories", function(req, res) {
    var search = req.query.q;
    var query = typeof search == "string" ? 
        Story.find({}) : 
        Story.find({ $text: { $search: req.query.q} });
    query.sort("-createdAt").exec(function(err, stories) {
        if (err) {
            req.flash("error", "Error finding stories");
            return res.redirect("/");
        }
        stories = stories || [];
        res.render("stories/search", {
            query: typeof search == "string" ? search : "",
            stories: stories
        });
    });
});

module.exports = router;