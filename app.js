var _               = require("dotenv").config(),
    express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    flash           = require("flash"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    mongooseConfig  = require("./config/mongo-connection"),
    passport        = require("passport"),
    localStrategy   = require("passport-local").Strategy,
    User            = require("./models/user");

// Set up app
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.moment = require("moment");
app.use(methodOverride("_method"));

// Set up mongoose
mongoose.connect(mongooseConfig.string, mongooseConfig.options);

// Set up passport
app.use(require("./config/express-session"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and locals
app.use(flash());
app.use(require("./config/locals"));

// Routes
app.use("/stories", require("./routes/stories"));
app.use("/contests/", require("./routes/contests")),
app.use(require("./routes/users"));
app.use(require("./routes/index"));

// Run the app
var PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
    console.log(`App started on port ${PORT}`);
});
