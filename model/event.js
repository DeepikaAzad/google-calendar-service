// Load mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = Schema({
    summary: {
        type: String
    },
    description: {
        type: String
    },
    start: {
        dateTime: {
            type: String,
            required: true,
            message: "Date Time is required for start time."
        },
        timeZone: {
            type: String,
            required: true,
            message: "Time zone is required for start time."
        }
    },
    end: {
        dateTime: {
            type: String,
            required: true,
            message: "Date Time is required for end time."
        },
        timeZone: {
            type: String,
            required: true,
            message: "Time zone is required for end time."
        }
    },
    attendees: {
        email: {
            type: String,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
        },
        name: {
            type: String
        }
    },
    publisherEmail: {
        type: String,
        required: true
    },
    isNewEvent: {
        type: Boolean
    }
},
    {
        timestamps:
        {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    },
    {
        collection: "event"
    }
);

// Create `user` model and expose it
module.exports = mongoose.model("eventSchema", eventSchema, "event");

