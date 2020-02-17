var vs = require("./validate-string");

function validateStory(body) {
    if (vs(body.title) &&
        vs(body.description) &&
        vs(body.link)) {
        return {
            title: body.title,
            description: body.description,
            link: body.link
        }
    }
    return false;
};

module.exports = validateStory;