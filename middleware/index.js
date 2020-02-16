var middleware = {};

middlware.loggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("Login to do that!");
    res.redirect("/login");
});

middleware.isAdmin = function(req, res, next) {

});