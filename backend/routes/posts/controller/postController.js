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
        const foundPosts = await Post.find({}).populate("owner", "username").populate("commentHistory", "comment")

        res.render('index', { posts: foundPosts })
        // res.status(200).json({ message: "Current post and comment history", payload: foundPosts })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.mesaage })
    }
}

const deletePost = async(req, res) => {

    const { id } = req.params

    try {
        const decodedToken = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found" }

        const foundPost = await Post.findById(id)
        if(!foundPost) throw { mesaage: "No post with id found!" }
        
        if(foundUser._id.toString() === foundPost.owner.toString()) {
            const deletePost = await Post.findByIdAndDelete(id)
            if(!deletePost) throw { mesaage: "No post with id found!" }

            if(foundPost.commentHistory.length > 0) {
                const foundComments = await Comment.find({ post: id })
                if(!foundComments) throw { mesaage: "No post with id found!" }
                
                await foundComments.map(async comment => {
                    let commentUser = await User.findById(comment.owner)
                    await commentUser.commentHistory.pull(comment._id.toString())
                    await commentUser.save()
                })
                await Comment.deleteMany({ post: id })
            }

            await foundUser.postHistory.pull(id)
            await foundUser.save()

            res.status(200).json({ message: "Post was deleted", deletedPost: deletePost, deletedInUser: foundUser })
        }
        else {
            throw { message: "You do not have permission!" }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.message })
    }
    
}

const updatePost = async(req, res) => {

    const { postId } = req.body

    try {
        const decodedToken = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found" }
        const foundPost = await Post.findById(postId)
        if(!foundPost) throw { message: "Post not found" }

        if(foundUser._id.toString() === foundPost.owner.toString()) {
            const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true })
            res.status(200).json({ message: "Post has been updated", payload: updatedPost })
        }
        else {
            throw { message: "You do not have permission!" }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error", error: error })
    }

}

module.exports = {
    createPost,
    getAllPosts,
    deletePost,
    updatePost
}