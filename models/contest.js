var mongoose = require("mongoose"),

var contestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    host: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    openingDate: {
        type: Date,
        required: true
    },
    submissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }
    ]
});

module.exports = mongoose.model("Contest", contestSchema);