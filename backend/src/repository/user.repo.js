const User = require("../model/user.model")

const createUser = (data) =>  {
    return User.create(data)
}

const findEmail = (email) => {
    return User.findOne({email})
}

const findUserById = (id) => {
    return User.findById(id)
}

module.exports = {
    createUser,
    findEmail,
    findUserById
}