// Load mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserAvailabilitySchema = Schema({
    emailId: {
        type: String,
        unique: true
    },
    timeSlot: [
        {
            slotType: {
                type: String,
                enum: ["week_day", "date"]
            },
            weekDay: {
                type: String,
                enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
            },
            date: {
                type: Date
            },
            interval: [
                {
                    from: {
                        type: String
                    },
                    to: {
                        type: String
                    }
                }
            ]
        }
    ]
},
    {
        collection: "userAvailability"
    }
);

// Create `userAvailability` model and expose it
module.exports = mongoose.model("userAvailabilitySchema", UserAvailabilitySchema);

