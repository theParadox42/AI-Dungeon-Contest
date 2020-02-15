var _       = require("dotenv").config(),
    express = require("express"),
    app     = express(),
    bodyParser = require("body-parser");

app.use(express.static("public"));
app.set("view engine", "ejs");




var PORT = process.env.PORT || 8080;
app.listen(PORT, process.env.IP, function(){
    console.log(`App started on port ${PORT}`);
});
