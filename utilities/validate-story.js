var vs = require("./validate-string");

function validateStory(body) {
    if (vs(body.title) &&
        vs(body.description) &&
        vs(body.link) &&
        body.link.match(/https?:\/\/play.aidungeon.io\/stories\?story=.*/)) {
        return {
            title: body.title,
            description: body.description,
            link: body.link.replace("http:", "https:")
        }
    }
    return false;
};

module.exports = validateStory;