module.exports = function (req, res, next) {
    // User
    res.locals.user = req.user;
    // Roles
    if (req.user) {
        res.locals.isAdmin = req.user.roles.indexOf("admin") >= 0;
        res.locals.isJudge = res.locals.isAdmin || req.user.roles.indexOf("judge") >= 0;
    } else {
        res.locals.isAdmin = false;
        res.locals.isJudge = false;
    }
    // Messages
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
};