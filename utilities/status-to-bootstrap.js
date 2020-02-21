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
        case "admin":
            return "danger";
        case "judge":
            return "primary";
        case "writer":
            return "info";
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