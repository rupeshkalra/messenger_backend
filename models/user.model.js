const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    communications: {
        type: Array,
        required: false
    }
}, {
    timestamps: true
})


const User = mongoose.model("User", UserSchema);

module.exports = User;