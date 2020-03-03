module.exports = function(status) {
    switch(status) {
        // Contest Status
        case "pending":
            return "info";
        case "open":
            return "success";
        case "closed":
            return "danger";
        case "judging":
            return "primary";
        // User Status
        case "super-admin":
            return "light";
        case "admin":
            return "danger";
        case "writer":
            return "info";
        case "judge":
            return "primary";
        case "winner":
            return "warning";
        case "runner-up":
            return "warning";
        case "popular":
            return "warning";
        default:
            return "secondary";
    }
}