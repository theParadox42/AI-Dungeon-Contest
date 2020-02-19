var vs = require("./validate-string");

function validateStory(body) {
    if (vs(body.title) &&
        vs(body.description) &&
        vs(body.link) &&
        body.link.match(/https?:\/\/play.aidungeon.io\/stories\?story=.*/)) {
        var link = body.link.replace("http:", "https:");
        return {
            title: body.title,
            description: body.description,
            link: link,
            referenceId: link.replace("https:/"+"/play.aidungeon.io/stories?story=", "")
        }
    }
    return false;
};

module.exports = validateStory;