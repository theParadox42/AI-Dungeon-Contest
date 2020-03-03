module.exports = function (req, res, next) {
    // User
    res.locals.user = req.user;
    // Roles
    if (req.user) {
        res.locals.isAdmin = req.user.roles.some(function(role) {
            return role.includes("admin");
        });
        res.locals.isJudge = res.locals.isAdmin || req.user.roles.indexOf("judge") >= 0;
        res.locals.isWriter = res.locals.isAdmin || req.user.roles.indexOf("writer") >= 0;
    } else {
        res.locals.isAdmin = false;
        res.locals.isJudge = false;
        res.locals.isWriter = false;
    }
    // Messages
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
};