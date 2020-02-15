module.exports = function (req, res, next) {
    res.locals.user = req.user;
    res.locals.errorFlashMessage = req.flash("error");
    res.locals.successFlashMessage = req.flash("success");
    next();
};