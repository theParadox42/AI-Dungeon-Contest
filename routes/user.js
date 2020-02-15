var express     = require("express"),
    router      = express.Router({ mergeParams: true });
    passport    = require("passport"),
    mongoose    = require("mongoose"),
    User        = require("../models/user");

