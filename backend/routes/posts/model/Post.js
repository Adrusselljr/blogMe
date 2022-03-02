const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({

    title: {
        type: String
    },

    post: {
        type: String
    },

    commentHistory: [{
        type: mongoose.Schema.ObjectId,
        ref: "comments"
    }],

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }

}, { timestamps: true })

module.exports = mongoose.model("post", PostSchema)