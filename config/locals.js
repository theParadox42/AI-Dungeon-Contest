module.exports = function (req, res, next) {
    res.locals.user = req.user;
    if (req.user) {
        res.locals.isAdmin = req.user.roles.indexOf("admin") >= 0;
        res.locals.isJudge = res.locals.isAdmin || req.user.roles.indexOf("judge") >= 0;
    } else {
        res.locals.isAdmin = false;
        res.locals.isJudge = false;
    }
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
};