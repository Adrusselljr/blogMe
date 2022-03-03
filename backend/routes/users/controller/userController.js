const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../../utils/errorHandler')

const createUser = async(req, res) => {

    const { firstName, lastName, username, email, password } = req.body

    try{
        let salt = await bcrypt.genSalt(10)
        let hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: hashPassword
        })

        const savedUser = await newUser.save()
        res.status(200).json({ message: "New user has been saved", payload: savedUser })
    }
    catch(error) {
        res.status(500).json({ message: "Error", error: errorHandler(error) })
    }

}

const userLogin = async(req, res) => {

    const { email, password } = req.body

    try {
        const foundUser = await User.findOne({ email: email})
        if(foundUser === null) throw { message: "Email not found!" }

        const comparedPassword = await bcrypt.compare(password, foundUser.password)
        if(!comparedPassword) throw { message: "Passowrd does not match"}

        const jwtToken = jwt.sign({
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
            username: foundUser.username
        },
            process.env.SECRET_KEY,
            { expiresIn: "12h" }
        )

        res.status(200).json({ payload: jwtToken })
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }

}

const updateUser = async(req, res) => {
    try {
        const decodedToken = res.locals.decodedToken

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashPassword

        const updatedUser = await User.findOneAndUpdate({ email: decodedToken.email }, req.body, { new: true })
        res.status(200).json({ message: "Updated user", payload: updatedUser })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error: errorHandler(error) })
    }
}

module.exports = {
    createUser,
    userLogin,
    updateUser
}