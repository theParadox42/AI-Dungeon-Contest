var mongoose = require("mongoose");

var score = {
    type: Number,
    min: 1,
    max: 10
};

var storySchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String,
    referenceId: String,
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    contest: {
        tag: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    scores: [
        {
            relevancy: score,
            humor: score,
            entertainment: score,
            creativity: score,
            judge: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    achievment: {
        type: String,
        enum: ["winner", "runner-up", "popular"]
    }
});

storySchema.index({ title: "text", description: "text" })

storySchema.virtual.rating = function(story) {
    var categories = ["relevancy", "humor", "entertainment", "creativity"];
    var totalScore = 0;
    story.scores.forEach(function(score) {
        categories.forEach(function(category) {
            score += Math.max(Math.min(10, score[category]), 0);
        });
    });
    totalScore /= story.scores.length * categories.length;
    return totalScore;
};

module.exports = mongoose.model("Story", storySchema);

