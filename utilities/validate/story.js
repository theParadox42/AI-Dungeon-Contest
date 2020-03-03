var vs = require("./string");

function validateStory(body) {
    if (vs(body.title) &&
        vs(body.description) &&
        vs(body.link) &&
        body.link.match(/https?:\/\/(play|beta).aidungeon.io\/stories\?story=.*/)) {
        var link = body.link.replace("http:", "https:").replace("/beta", "/play");
        return {
            title: body.title,
            description: body.description,
            link: link,
            referenceId: link.replace("https:/"+"/play.aidungeon.io/stories?story=", "")
        };
    }
    return false;
};

validateStory.fixStory = function(story) {
    story.title = story.title || "Unnamed";
    story.description = story.description || "No description";
    story.link = story.link || "https:/" + "/play.aidungeon.io/stories?story=notastory";
    story.referenceId = story.link.replace("https:/" + "/play.aidungeon.io/stories?story=", "")
    story.save();
    return story;
}

module.exports = validateStory;