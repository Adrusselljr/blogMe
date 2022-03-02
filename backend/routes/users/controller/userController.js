const User = require('../model/User')
const bcrypt = require('bcryptjs')
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
        res.status(500).json({ error: errorHandler(error) })
    }

}

module.exports = {
    createUser
}