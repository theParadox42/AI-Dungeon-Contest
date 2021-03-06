/*
 * Welcome to the AI Dungeon Contests Backend/Frontend
 * All the frontend stuff is in ./public and ./views
 * All the backend stuff is literally everything else
 * Enjoy coding!
 */

// Dependencies
var _               = require("dotenv").config(),
    express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash-plus"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    mongooseConfig  = require("./config/mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    User            = require("./models/user");

// Set up app
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Set up mongoose
mongoose.connect(mongooseConfig.string, mongooseConfig.options).catch(e => console.warn("Failed to connect!", e));

// Set up passport
app.use(require("./config/express-session"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy.Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and locals
app.use(flash());
app.use(require("./config/locals"));
app.locals.statusToBootstrap = require("./utilities/status-to-bootstrap");
app.locals.moment = require("moment");
app.locals.appVersion = require("./package.json").version;

// Routes
app.use("/contests/:tag/stories", require("./routes/stories"));
app.use("/contests", require("./routes/contests"));
app.use("/judge", require("./routes/judge"));
app.use(require("./routes/search"));
app.use(require("./routes/users"));
app.use(require("./routes/index"));

// Run the app
var PORT = process.env.PORT || 8080;
app.listen(PORT, process.env.IP, function(){
    console.log(`App started on port ${PORT}`);
});
