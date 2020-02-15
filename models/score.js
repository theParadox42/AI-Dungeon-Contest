var mongoose = require("mongoose");

var scoreBlock = {
    type: Number,
    min: 1,
    max: 10
};

var scoreSchema = new mongoose.Schema({
    judge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story"
    },
    relevancy: scoreBlock,
    humor: scoreBlock,
    entertainment: scoreBlock,
    creativity: scoreBlock
});

module.exports = mongoose.model("Score", scoreSchema);