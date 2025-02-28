const { verifyToken } = require("../helpers/jwt")

// * Authentication
async function authentication({ req }) {
    try {
        // * Ambil token dari header authorization
        const bearerToken = req.headers.authorization || ""

        // * Validasi tidak ada token
        if (!bearerToken) {
            throw new Error("You must be logged in to access this feature");
        }

        // * Token di split
        const [type, token] = bearerToken.split(" ")
        if (type !== "Bearer" || !token) {
            throw new Error("Invalid token");
        }

        // * Verifikasi token pakai JWT
        const decodedToken = verifyToken(token)

        // console.log(decodedToken, "<< Tes token")

        return decodedToken
    } catch (error) {
        throw new Error(error.message || "Authentication failed");

    }
}

module.exports = authentication