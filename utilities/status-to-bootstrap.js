module.exports = function(status) {
    switch(status) {
        case "open":
            return "success";
        break;
        case "closed":
            return "danger";
        break;
        case "judging":
            return "info";
        break;
        case "winner":
            return "warning";
        break;
        case "runner-up":
            return "primary";
        break;
        case "popular":
            return "success";
        break;
        default:
            return "secondary";
    }
}