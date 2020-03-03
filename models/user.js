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
                enum: ["member", "popular", "runner-up", "winner", "writer", "judge", "admin", "super-admin"]
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
        // Status
        if (setTopRole(role, "super-admin")) return;
        if (setTopRole(role, "admin")) return;
        if (setTopRole(role, "judge")) return;
        if (setTopRole(role, "writer")) return;
        // Achievement
        if (setTopRole(role, "winner")) return;
        if (setTopRole(role, "runner-up")) return;
        if (setTopRole(role, "popular")) return;
        topRole = "member";
    });
    return topRole;
};


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

