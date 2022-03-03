const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({

    comment: {
        type: String
    },

    post: {
        type: mongoose.Schema.ObjectId,
        ref: "post"
    },

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }

}, { timestamps: true })

module.exports = mongoose.model("comment", CommentSchema)