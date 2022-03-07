const Post = require('../model/Post')
const User = require('../../users/model/User')
const Comment = require('../../comments/model/Comment')

const createPost = async(req, res) => {

    const { title, post } = req.body

    try {
        const decodedToken = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found" }

        const newPost = new Post({
            title: title,
            post: post,
            owner: foundUser.id
        })

        const savedPost = await newPost.save()
        foundUser.postHistory.push(savedPost.id)
        await foundUser.save()

        res.status(200).json({ mesaage: "Saved new post", payload: savedPost })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.message })
    }

}

const getAllPosts = async(req, res) => {
    try {
        const decodedToken = res.locals.decodedToken
        const foundUser = await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found!" }

        const foundPosts = await Post.find({ owner: foundUser.id }).populate("owner", "username").populate("commentHistory")

        res.status(200).json({ message: "Current post and comment history", payload: foundPosts })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.mesaage })
    }
}

const deletePost = async(req, res) => {

    const { id } = req.params

    try {
        const deletePost = await Post.findByIdAndDelete(id)
        if(deletePost === null) throw { mesaage: "No post with id found!" }

        const decodedToken = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found" }

        const foundPost = await Post.findById({ owner: foundUser.id })

        if(foundUser.id === foundPost.owner) {
            foundUser.postHistory.pull(id)
            await foundUser.save()

            const deleteComments =  await Comment.deleteMany({ post: id })

            res.status(200).json({ message: "Post was deleted", deletedPost: deletePost, deletedComments: deleteComments })
        }
        else {
            throw { message: "You do not have permission!" }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.mesaage })
    }
    
}

const updatePost = async(req, res) => {

    const { postId } = req.body

    try {
        const decodedToken = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found" }

        if(foundUser.id === postId.owner) {
            const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true })
            res.status(200).json({ message: "Post has been updated", payload: updatedPost })
        }
        else {
            throw { message: "You do not have permission!" }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.mesaage })
    }

}

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    updatePost
}