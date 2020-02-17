var express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Story = require("../models/story"),
    Contest = require("../models/contest"),
    validateStory = require("../utilities/validate-story");

router.get("/")

module.exports = router;