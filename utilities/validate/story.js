var vs = require("./string");

function validateStory(body) {
    if (vs(body.title) &&
        vs(body.description) &&
        vs(body.storyType)) {
        var story = {
            title: body.title,
            description: body.description
        };
        if (body.storyType == "story") { 
            if (vs(body.link) &&
                body.link.match(/https?:\/\/(play|beta).aidungeon.io\/stories\?story=.*/)) {
                var link = body.link.replace("http:", "https:").replace("/beta", "/play");
                story.link = link;
                story.referenceId = link.replace("https:/" + "/play.aidungeon.io/stories?story=", "");
                story.storyType = "story";
            } else {
                return false;
            }
        } else if (body.storyType == "adventure") {
            if (vs(body.referenceId)) {
                story.referenceId = body.referenceId;
                story.storyType = "adventure";
            }
        } else {
            return false;
        }
        return story;
    }
    return false;
};

validateStory.fixStory = function(story) {
    story.title = story.title || "Unnamed";
    story.description = story.description || "No description";
    story.storyType = story.storyType || (story.link.length > 0 ? "story" : "adventure");
    story.link = story.link || (story.storyType == "story" ? "https:/" + "/play.aidungeon.io/stories?story=bad_id" : "");
    story.referenceId = story.referenceId || (story.storyType == "story" ? story.link.replace("https:/" + "/play.aidungeon.io/stories?story=", "") : "bad_id");
    story.save();
    return story;
}

module.exports = validateStory;