var mongoose = require("mongoose");

var contestSchema = new mongoose.Schema({
    title: String,
    tag: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    prompt: String,
    creator: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    openingDate: Date,
    closingDate: Date,
    status: {
        type: String,
        enum: ["hidden", "pending", "open", "judging", "closed"],
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