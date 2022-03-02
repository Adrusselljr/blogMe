const { isAlpha, isAlphanumeric, isEmail, isStrongPassword } = require('validator')

const validateCreateUser = (req, res, next) => {

    const { firstName, lastName, username, email, password } = req.body
    let errObj = {}

    if(!isAlpha(firstName)) {
        errObj.firstName = "First name should not include numbers or special characters!"
    }
    if(!isAlpha(lastName)) {
        errObj.lastName = "Last name should not include numbers or special characters!"
    }
    if(!isAlphanumeric(username)) {
        errObj.username = "Username should not have any special characters!"
    }
    if(!isEmail(email)) {
        errObj.email = "Email is not in the correct format!"
    }
    if(!isStrongPassword(password)) {
        errObj.password = "Password must contain a minimum of 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character and 8 characters in length!"
    }
    
    let checkObj = Object.keys(errObj)

    if(checkObj.length > 0) {
        return res.status(500).json({ message: "Error", error: errObj })
    }
    else {
        next()
    }

}


module.exports = {
    validateCreateUser
}