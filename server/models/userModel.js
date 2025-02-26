const { database } = require("../config/mongodb")
const { ObjectId } = require('mongodb')
const { hashPassword, comparePassword } = require("../helpers/bcrypt")


class UserModel {
    // * Ambil collection users
    static collection() {
        return database.collection("users")
    }
}

module.exports = UserModel