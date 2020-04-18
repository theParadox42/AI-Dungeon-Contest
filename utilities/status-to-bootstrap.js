module.exports = status => {
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
        // Achievement status
        case "winner":
            return "success";
        case "runner-up":
            return "success";
        case "popular":
            return "success";
        default:
            return "secondary";
    }
}