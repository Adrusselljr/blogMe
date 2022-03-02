const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    username: {
        type: String,
        unique: true
    },
    
    email: {
        type: String,
        unique: true
    },

    password: {
        type: String
    },

    postHistory: [{
        type: mongoose.Schema.ObjectId,
        ref: "post"
    }],

    commentHistory: [{
        type: mongoose.Schema.ObjectId,
        ref: "comments"
    }]

}, { timestamps: true })

module.exports = mongoose.model("user", UserSchema)