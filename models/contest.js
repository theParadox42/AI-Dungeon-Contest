var mongoose = require("mongoose"),

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
    openingDate: Date,
    closingDate: Date,
    submissionsOpen: {
        type: Boolean,
        default: false
    },
    judgingOpen: {
        type: Boolean,
        default: false
    },
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }
    ]
});

module.exports = mongoose.model("Contest", contestSchema);