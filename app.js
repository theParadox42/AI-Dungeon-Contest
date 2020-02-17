var _               = require("dotenv").config(),
    express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    mongooseConfig  = require("./config/mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    User            = require("./models/user");

// Set up app
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.moment = require("moment");
app.use(methodOverride("_method"));

// Set up mongoose
mongoose.connect(mongooseConfig.string, mongooseConfig.options).catch((e) => { console.log("Failed to connect!", e); });

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
app.locals.moment = require("moment");
app.locals.statusToBootstrap = require("./utilities/status-to-bootstrap");

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
