var mongoose = require("mongoose");

var contestSchema = new mongoose.Schema({
    title: String,
    tag: String,
    host: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    closingDate: Date,
    status: {
        type: String,
        enum: ["hidden", "open", "judging", "closed"],
        default: "hidden"
    },
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }
    ]
});

module.exports = mongoose.model("Contest", contestSchema);