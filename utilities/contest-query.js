module.exports = function(req, res) {
    var query = {};
    if (!res.locals.isWriter) {
        query.status = {
            $not: /(hidden|pending)/
        };
    } else if (!res.locals.isAdmin) {
        query.status = {
            $not: "hidden"
        }
    }
    return query;
}