// Load mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = Schema({
    summary: {
        type: String
    },
    location: {
        type: String
    },
    description: {
        type: String
    },
    start: {
        type: String
    }
},
    {
        collection: "event"
    }
);

// Create `user` model and expose it
module.exports = mongoose.model("eventSchema", eventSchema);

