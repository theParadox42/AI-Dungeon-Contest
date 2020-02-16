var express = require("express"),
    router  = express.Router({ mergeParams: true });

router.get("/", function(req, res) {
    res.render("home");
});

router.get("*", function(req, res) {
    res.status(404).render("404", { routeType: "GET" });
});

router.post("*", function(req, res) {
    res.status(404).render("404", { routeType: "POST" });
});

router.put("*", function(req, res) {
    res.status(404).render("404", { routeType: "PUT" });
});

router.delete("*", function(req, res) {
    res.status(404).render("404", { routeType: "DELETE" });
});

module.exports = router;