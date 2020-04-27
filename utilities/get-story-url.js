module.exports = (story) => {
    var path = story.storyType == "story" ? "/public/stories?publicId=" : "/public/adventure/";
    return "https://api.aidungeon.io" + path + story.referenceId;
};