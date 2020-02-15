var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: String
    },
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    contest: {
        title: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest"
        }
    }
});

module.exports = mongoose.model("Story", storySchema);