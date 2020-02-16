var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    discordUsername: String,
    AIDUsername: String,
    roles: {
        type: [
            {
                type: String,
                enum: ["member", "winner", "judge", "admin"]
            }
        ],
        default: ["member"]
    },
    stories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }
    ]
});

// Checks if user has a role
userSchema.virtual.isJudge = function() {
    return this.roles.indexOf("judge") >= 0;
};
userSchema.virtual.isAdmin = function() {
    return this.roles.indexOf("admin") >= 0;
};

// Gets the highest role a user has
userSchema.virtual.topRole = function() {
    var topRole = "";
    function setTopRole(role, key) {
        if (role == key || topRole == key) {
            topRole = key;
            return true;
        }
        return false;
    }
    this.roles.forEach(role => {
        if (setTopRole(role, "admin")) return;
        if (setTopRole(role, "judge")) return;
        if (setTopRole(role, "winner")) return;
        topRole = "member";
    });
    return topRole;
};


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

