var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: String
    }
});

module.exports = mongoose.model("Story", storySchema);