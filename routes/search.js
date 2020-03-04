var express     = require("express"),
    router      = express.Router({ mergeParams: true }),
    Story       = require("../models/story"),
    vs          = require("../utilities/validate/string"),
    sortStories = require("../utilities/sort-stories");

router.get("/stories", function(req, res) {
    var query = vs(req.query.q) ? 
        Story.find({ $text: { $search: req.query.q} }) :
        Story.find({});
    query.exec(function(err, stories) {
        if (err) {
            req.flash("error", "Error finding stories");
            return res.redirect("/");
        }
        stories = stories || [];
        res.render("stories/search", {
            query: typeof search == "string" ? search : "",
            stories: sortStories(stories)
        });
    });
});

module.exports = router;