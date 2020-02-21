var express     = require("express"),
    router      = express.Router({ mergeParams: true }),
    passport    = require("passport"),
    User        = require("../models/user"),
    middleware  = require("../middleware"),
    vs          = require("../utilities/validate-string");

// View
router.get("/profile", middleware.loggedIn, function(req, res) {
    res.redirect(`/profile/${req.user.username}`);
});
router.get("/profile/:username", function(req, res) {
    User.findOne({ username: req.params.username }).populate("stories").exec(function(err, foundUser) {
        if (err) {
            req.flash("error", "Error finding user!");
        } else if (!foundUser) {
            req.flash("error", "No User Found!");
        } else {
            return res.render("users/profile", { profile: foundUser });
        }
        res.redirect("back");
    });
});
router.get("/profilelink/aid/:aidusername", function(req, res) {
    User.findOne({ AIDUsername: req.params.aidusername }, function(err, foundUser) {
        if (err) {
            req.flash("error", "Error finding user!");
        } else if(!foundUser) {
            req.flash("error", "No user found!");
        } else {
            return res.redirect("/profile/" + foundUser.username);
        }
        res.redirect("back");
    });
})

// CREATE A USER
router.get("/register", middleware.isntLoggedIn, function(req, res) {
    res.render("users/register");
});
router.post("/register", middleware.isntLoggedIn, function(req, res) {
    
    var body = req.body;
    if (vs(body.username) &&
        vs(body.password)) {
        
        var newUser = new User({ username: body.username });
        newUser.discordUsername = vs(body.discordUsername) ? body.discordUsername : body.username;
        newUser.AIDUsername = vs(body.AIDUsername) ? body.AIDUsername : body.username;
        
        User.findOne({ username: newUser.username }, function (err, existingUser) {
            if (err) {
                req.flash("error", err.messsage);
                res.redirect("/register");
            } else if(existingUser) {
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
router.get("/login", middleware.isntLoggedIn, function(req, res){
    res.render("users/login");
});
router.post("/login", middleware.isntLoggedIn, passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: "Bad username or password"
}));

// LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;

























