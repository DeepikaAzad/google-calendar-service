const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').default;

const Helpers = require("../util/index");

let mongoServer;

exports.createDatabase = async function () {
    if (Helpers.isObjectEmpty(mongoServer)) {
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        mongoose.set("debug", true);
    }
    return mongoServer;
}

exports.clearDatabase = async function () {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
}

exports.closeDatabaseCon = async function () {
    if (!Helpers.isObjectEmpty(mongoServer)) {
        await mongoose.disconnect();
        await mongoServer.stop();
    }
}