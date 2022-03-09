const Comment = require('../model/Comment')
const Post = require('../../posts/model/Post')
const User = require('../../users/model/User')

const createComment = async(req, res) => {

    const { comment } = req.body
    const { id } = req.params

    try {
        const decodedToken = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found" }
        
        const foundPost = await Post.findById(id)
        if(!foundPost) throw { message: "Post not found" }
        
        const newComment = new Comment({
            comment: comment,
            post: id,
            owner: foundUser.id
        })


        const savedComment = await newComment.save()
        foundUser.commentHistory.push(savedComment.id)
        foundPost.commentHistory.push(savedComment.id)
        await foundUser.save()
        await foundPost.save()

        res.status(200).json({ message: "Saved new comment", payload: savedComment })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.message })
    }

}

const getAllComments = async(req, res) => {
    try {
        const decodedToken = res.locals.decodedToken
        const foundUser = await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found!" }

        const foundComments = await Comment.find({ owner: foundUser.id })

        res.status(200).json({ payload: foundComments })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.mesaage })
    }
}

const deleteComment = async(req, res) => {

    const { id } = req.params

    try {
        const deleteComment = await Comment.findByIdAndDelete(id)
        if(!deleteComment) throw { message: "No comment with id found!"}

        const decodedToken = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found" }
        
        const foundPost = await Post.findById(deleteComment.post)
        if(!foundPost) throw { message: "Post not found" }

        const foundComment = await Comment.findById(id)
        if(!foundComment) throw { message: "Comment not found" }

        if(foundUser.toString() === foundComment.toString()) {
            foundUser.commentHistory.pull(id)
            foundPost.commentHistory.pull(id)
            await foundUser.save()
            await foundPost.save()

            res.status(200).json({ message: "Comment has been deleted", payload: deleteComment })
        }
        else {
            throw { message: "You do not have permission!" }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error })
    }

}

const updateComment = async(req, res) => {

    const { commentId } = req.body
    
    try {
        const decodedToken = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found" }
        const foundComment = await Comment.findById(id)
        if(!foundComment) throw { message: "Comment not found" }

        if(foundComment.owner.toString() === foundUser._id.toString()) {
            const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true })
            res.status(200).json({ message: "Comment has been updated", payload: updatedComment })
        }
        else {
            throw { message: "You do not have permission!" }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error })
    }

}

module.exports = {
    createComment,
    getAllComments,
    deleteComment,
    updateComment
}