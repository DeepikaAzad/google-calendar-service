const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const uri = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + "@" + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/calendar?authSource=admin";
// mongoose.connection.openUri("mongodb://0.0.0.0:27017/calendar?authSource=admin", {
mongoose.connection.openUri(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Event = require("./event");
module.exports.Event = require("./userAvailability");