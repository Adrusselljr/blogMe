const { isEmpty } = require('validator')

const checkIsEmpty = (req, res, next) => {

    let body = req.body
    let errObj = {}

    for(let key in body) {
        if(isEmpty(body[key])) {
            errObj[key] = `${key} cannot be empty`
        }
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
    checkIsEmpty
}