var Story   = require("../models/story"),
    Contest = require("../models/contest"),
    User    = require("../models/user");

function deleteStoryById(storyid, callback) {
    Story.findByIdAndDelete(storyid, function (err, deletedStory) {
        if (err) {
            callback("Error deleting story");
        } else if (!deletedStory) {
            callback("No story deleted!");
        } else {
            function findStory(item) {
                return deletedStory._id.equals(item);
            }
            Contest.findOne({ tag: deletedStory.contest.tag }, function(err, contest) {
                if (!err && contest) {
                    var contestIndex = contest.stories.findIndex(findStory);
                    if (contestIndex >= 0) {
                        contest.stories.splice(contestIndex, 1);
                        contest.save();
                    }
                }
                User.findOne({ username: deletedStory.author.username }, function(err, user) {
                    if (!err && user) {
                        var userIndex = user.stories.findIndex(findStory);
                        if (userIndex >= 0) {
                            user.stories.splice(userIndex, 1);
                            user.save();
                        }
                    }
                    return callback(null, "Succesfully deleted story!");
                })
            });
        }
    });
}
module.exports = deleteStoryById;