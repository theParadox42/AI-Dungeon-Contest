var expressSession = require("express-session");

module.exports = expressSession({
    secret: process.env.PASSPORT_SECRET || "secret",
    resave: false,
    saveUninitialized: false
});