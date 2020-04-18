var vs = require("./string");

function validateContest(body, noTag, noStatus) {
    if (vs(body.title) &&
        ((vs(body.tag) && body.tag.match(/^[a-zA-Z0-9_-]*$/) && body.tag != "new") || noTag) &&
        (vs(body.status) || noStatus) && 
        vs(body.description) &&
        vs(body.prompt) &&
        body.closingDate) {
        var validatedContest = {
            title: body.title,
            description: body.description,
            prompt: body.prompt,
            closingDate: new Date(body.closingDate)
        }
        if (!noTag) validatedContest.tag = body.tag;
        if (!noStatus) validatedContest.status = body.status;
        return validatedContest;
    }
    return false;
};

module.exports = validateContest;