var express     = require("express"),
    router      = express.Router({ mergeParams: true }),
    passport    = require("passport"),
    mongoose    = require("mongoose"),
    User        = require("../models/user");

// CREATE A USER
router.get("/register", function(req, res) {
    res.render("users/register");
});
router.post("/register", function(req, res) {
    console.log("recieved post request")
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
        User.findOne({ username: newUser.username }, function (err, user) {
            if (err) {
                req.flash("error", err.messsage);
                res.redirect("/register");
            } else if(user) {
                req.flash("error", "That username is already taken!");
                res.redirect("/register");
            }
            User.register(newUser, body.password, function(err, createdUser) {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect("/register");
                } else if (!createdUser) {
                    req.flash("error", "No user created!");
                    return res.redirect("/register");
                }
                passport.authenticate("local")(req, res, function() {
                    req.flash("success", "Welcome to AI Dungeon Contests " + createdUser.username);
                    res.redirect("/");
                });
            })
        });
    } else {
        req.flash("error", "Bad request");
        res.redirect("/register");
    }
});

// LOGIN A USER
router.get("/login", function(req, res){
    res.render("users/login");
});
router.post("/login", passport.authenticate("local", function(err, foundUser) {
    if (err) {
        req.flash("error", "Error Authenticating. " + err.message;
    } else if (!foundUser) {
        req.flash("error", "Failed to login, check username and password.");
    } else {
        req.flash("Succesfully logged in!");
        return res.redirect("/");
    } 
    res.redirect("/login");
});

module.exports = router;

























