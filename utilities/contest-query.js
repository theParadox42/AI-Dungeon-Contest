module.exports = (req, res) => {
    var query = {};
    if (!res.locals.isWriter) {
        query.status = {
            $not: /(hidden|pending)/
        };
    }
    return query;
}