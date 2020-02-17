var vs = require("./validate-string");

function validateContest(body) {
    if (vs(body.title) &&
        vs(body.tag) &&
        vs(body.description) &&
        vs(body.prompt) &&
        body.closingDate &&
        vs(body.status)) {
        return {
            title: body.title,
            tag: body.tag,
            description: body.description,
            prompt: body.prompt,
            closingDate: new Date(body.closingDate),
            status: body.status
        }
    }
    return false;
};

module.exports = validateContest;