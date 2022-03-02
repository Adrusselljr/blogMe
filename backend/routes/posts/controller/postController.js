const Post = require('../model/Post')
const User = require('../../users/model/User')
const { errorHandler } = require('../../utils/errorHandler')

const createPost = async(req, res) => {

    const { title, post } = req.body

    try {
        const decodedData = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedData.email })
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
        res.status(500).json({ error: errorHandler(error) })
    }

}

const getAllPosts = async(req, res) => {
    try {
        const decodedToken = res.locals.decodedToken
        const foundUser = await User.findOne({ email: decodedToken.email })
        if(!foundUser) throw { message: "User not found!" }

        const foundPosts = await Post.find({ owner: foundUser.id })

        res.status(200).json({ payload: foundPosts })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.mesaage })
    }
}

const deletePost = async(req, res) => {

    const { id } = req.params

    try {
        const deletePost = await Post.findByIdAndDelete(id)
        if(deletePost === null) throw { mesaage: "No post with id found" }

        const decodedData = res.locals.decodedToken
        const foundUser =  await User.findOne({ email: decodedData.email })
        if(!foundUser) throw { message: "User not found" }

        foundUser.postHistory.pull(id)
        await foundUser.save()

        res.status(200).json({ message: "Post was deleted", payload: deletePost })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: error.mesaage })
    }
    
}

module.exports = {
    createPost,
    getAllPosts,
    deletePost
}