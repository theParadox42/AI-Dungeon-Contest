var express     = require("express"),
    router      = express.Router({ mergeParams: true }),
    passport    = require("passport"),
    mongoose    = require("mongoose"),
    User        = require("../models/user");

router.get("/register", function(req, res) {
    res.render("users/register");
});
router.post("/register", function(req, res) {
    var body = req.body;
    if(typeof body.username == "string" && 
    typeof body.AIDUsername == "string" && 
    typeof body.discordUsername == "string" &&
    typeof body.password == "string") {
        var newUser = new User({ 
            username: body.username, 
            discordUsername: body.discordUsername,
            AIDUsername: body.AIDUsername 
        });
        User.register(newUser, body.password, function(err, createdUser) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/register");
            } else if (!createdUser) {
                req.flash("error", err.message);
                return res.redirect("/register");
            }
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to AI Dungeon Contests " + createdUser.username);
                res.redirect("/");
            });
        })
    } else {
        req.flash("error", "Bad request");
    }
})

module.exports = router;