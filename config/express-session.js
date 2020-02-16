var session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    mongoose = require("mongoose");

module.exports = session({
    secret: process.env.PASSPORT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
});