var middleware = {};

middlware.loggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("Login to do that!");
    res.redirect("/login");
};

middleware.isAdmin = function(req, res, next) {
    middleware.loggedIn(req, res, function() {
        if (req.user.isAdmin) {
            next();
        } else {
            req.flash("error", "You need to be an admin to do that!");
            res.redirect("/");
        }
    });
};

middleware.isJudge = function(req, res, next) {
    middleware.loggedIn(req, res, function() {
        if (req.user.isJudge) {
            next();
        } else {
            req.flash("error", "You need to be an judge to do that!");
            res.redirect("/");
        }
    });
};


module.exports = middleware;