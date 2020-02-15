var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        unique: true
    },
    discordUsername: String,
    AIDUsername: String,
    roles: [
        {
            type: String,
            enum: ["Winner", "Judge", "Admin"]
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

