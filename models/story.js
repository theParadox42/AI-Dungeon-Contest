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
    storyType: {
        type: String,
        enum: ["story", "adventure"],
        default: "adventure"
    },
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
    averageScore: Number,
    votes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    achievement: {
        type: String,
        enum: ["winner", "runner-up", "popular"]
    }
});

storySchema.index({ title: "text", description: "text" })

module.exports = mongoose.model("Story", storySchema);

