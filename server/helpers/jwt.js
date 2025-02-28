const jwt = require(`jsonwebtoken`)
const secret = process.env.JWT_SECRET

// * signToken untuk user register
function signToken(payload) {
    return jwt.sign(payload, secret)
}


// * Verify Token untuk user login
function verifyToken(token) {
    return jwt.verify(token, secret)
}

module.exports = { signToken, verifyToken }