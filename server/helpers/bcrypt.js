const bcrypt = require('bcryptjs')

// * Function untuk hash password user register
function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    return hash
}

// * Function untuk compare password user login
function comparePassword(password, hashPassword) {
    const compare = bcrypt.compareSync(password, hashPassword)

    return compare
}

module.exports = { hashPassword, comparePassword }

