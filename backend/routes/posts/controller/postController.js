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

module.exports = {
    createPost
}