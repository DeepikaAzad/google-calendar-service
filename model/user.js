// Load mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
    id: {
        type: String
    },
    accessToken: {
        type: String
    },
    name: {
        type: String
    },
    displayPicture: {
        type: String
    }
},
    {
        collection: "user"
    }
);

// Create `user` model and expose it
module.exports = mongoose.model("userSchema", userSchema);

