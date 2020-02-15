var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    link: {
        type: String,
        required: String
    }
});

module.exports = mongoose.model("Story", storySchema);