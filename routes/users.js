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
});
router.get("/profilelink/discord/:discordusername", function(req, res) {
    User.findOne({ discordUsername: req.params.discordUsername }, function(err, foundUser) {
        if (err) {
            req.flash("error", "Error finding user!");
        } else if(!foundUser) {
            req.flash("error", "No user found!");
        } else {
            return res.redirect("/profile/" + foundUser.username);
        }
        res.redirect("back");
    });
});

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

// User Management
router.get("/profile/:username/manage", middleware.isAdmin, function(req, res) {
    User.findOne({ username: req.params.username }, function(err, profile) {
        if (err) {
            req.flash("error", "Error finding user!");
        } else if (!profile) {
            req.flash("error", "No user found!");
        } else {
            var roles = ["s-member", "s-popular", "s-runner-up", "s-winner", "judge", "writer"];
            if (req.user.roles.indexOf("super-admin") >= 0) {
                roles.push("admin");
                if (req.user.username == req.params.username || req.params.username == "theParadox42") {
                    roles.push("s-super-admin");
                } else {
                    roles.push("super-admin");
                }
            } else {
                roles.push("s-admin", "s-super-admin");
            }
            var roleList = [];
            roles.forEach(function(role) {
                var static = role.includes("s-");
                if (static) {
                    role = role.replace("s-", "");
                }
                roleList.push({
                    name: role,
                    checked: profile.roles.includes(role),
                    static: static
                });
            });
            return res.render("users/manage", { profile: profile, roleList: roleList });
        }
        res.redirect("/");
    });
});
// Update Roles
router.put("/profile/:username/roles", middleware.isAdmin, function(req, res) {
    User.findOne({ username: req.params.username }, function(err, profile) {
        if (err) {
            req.flash("error", "Error finding user");
        } else if (!profile) {
            req.flash("error", "No user found!");
        } else {
            var rolesThatCanChange = ["writer", "judge", "admin"];
            if (req.user.roles.indexOf("super-admin") >= 0) {
                rolesThatCanChange.push("admin");
                if (req.user.username != req.params.username && req.params.username != "theParadox42") {
                    rolesThatCanChange.push("super-admin");
                }
            }
            rolesThatCanChange.forEach(function(role) {
                if (req.body.roles.includes(role) && !profile.roles.includes(role)) {
                    profile.roles.push(role);
                } else if(!req.body.roles.includes(role) && profile.roles.includes(role)) {
                    var i = profile.roles.indexOf(role);
                    if (i >= 0) {
                        profile.roles.splice(i, 1);
                    }
                }
            });
            profile.save();
            return res.redirect("/profile/" + profile.username);
        }
        res.redirect(`/profile/${req.params.username}/manage`);
    });
});
// Delete User
router.delete("/profile/:username", middleware.canDelete, function(req, res) {
    User.findOneAndDelete({ username: req.params.username }).populate("stories").exec(function(err, deletedUser) {
        if (err) {
            req.flash("error", "Error deleting user");
        } else if (!deletedUser) {
            req.flash("error", "No user found to delete!");
        } else {
            if (deletedUser.username == req.user.username) {
                req.logout();
            }
            Story.deleteMany({ "author.username": req.params.username }, function(err) {
                res.send("not yet finished");
            });
            return;
        }
        res.redirect("/");
    });
});

module.exports = router;

























