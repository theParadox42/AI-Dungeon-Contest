module.exports = value => {
    return typeof value == "string" && value.length > 0;
}