const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    VendorType: {
        type: String,
        required: true
    },
    VendorName: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Rating: {
        type: Number,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
});


const UserFormData = mongoose.model("FormData", UserSchema);

module.exports = {
    UserFormData
}