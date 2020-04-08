const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connection.openUri("mongodb://localhost:27017/calendar?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Event = require("./event");
module.exports.Event = require("./user_availability");