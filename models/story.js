var mongoose = require("mongoose");

var score = {
    type: Number,
    min: 1,
    max: 10
};

var storySchema = new mongoose.Schema({
    title: String,
    link: String,
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
    votes: [
        {
            score: score,
            voter: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]
});

module.exports = mongoose.model("Story", storySchema);

