var vs = require("./validate-string");

function validateContest(body, noTag) {
    if (vs(body.title) &&
        ((vs(body.tag) &&
        body.tag != "new") ||
        noTag) &&
        vs(body.description) &&
        vs(body.prompt) &&
        body.closingDate &&
        vs(body.status)) {
        var validatedContest = {
            title: body.title,
            description: body.description,
            prompt: body.prompt,
            closingDate: new Date(body.closingDate),
            status: body.status
        }
        if (!noTag) validatedContest.tag = body.tag;
        return validatedContest;
    }
    return false;
};

module.exports = validateContest;