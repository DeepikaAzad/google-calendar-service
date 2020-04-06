const mongoose = require("mongoose");

mongoose.connection.openUri("mongodb://localhost/calender", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Event = require("./event");