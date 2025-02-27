const { database } = require("../config/mongodb")
const { ObjectId } = require('mongodb')
const { hashPassword, comparePassword } = require("../helpers/bcrypt")


class UserModel {
    // * Ambil collection users
    static collection() {
        return database.collection("users")
    }

    // * Fitur register user
    static async register(newUser) {
        // * Validasi username
        if (newUser.username === "" || newUser.username === undefined ) {
            throw new Error("Please input your username.")
        }

        // * validasi username length
        if (newUser.username.length < 2) {
            throw new Error ("Your username must be atleast 2 characters.")
        }

        // * Validasi username unik
        const uniqueUsername = await this.collection().findOne({
            username: newUser.username
        })

        if (uniqueUsername) {
            throw new Error("This username has already been used, please use another username.")
        }


        // * Validasi email user
        if (newUser.email === "" || newUser.email === undefined) {
            throw new Error ("Please input your email")
        }

        // * Validasi email unik
        const uniqueEmail = await this.collection().findOne({
            email: newUser.email
        })

        if (uniqueEmail) {
            throw new Error("This email has already been used, please use another email.")
        }

        // * Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!emailRegex.test(newUser.email)) {
            throw new Error("Invalid email format");
        }

        // * validasi password user
        if (newUser.password === "" || newUser.password === undefined) {
            throw new Error("Password is required");
        }

        // * validasi password length
        if (newUser.password.length < 5) {
            throw new Error("Password must be at least 6 characters");
        }

        // * hash password
        const hashedPass = hashPassword(newUser.password)

        // * register user baru
        const registeredUser = await this.collection().insertOne({
            username: newUser.username,
            email: newUser.email,
            password: hashedPass,
            weight: null,
            age: null,
            height: null,
            goalsId: null,
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // * untuk dapat createdAt dan updatedAt
        const userCreatedUpdated = await this.collection().findOne({
            _id: registeredUser.insertedId
        })

        // * return user yang baru daftar
        return {
            _id: registeredUser.insertedId,
            username: newUser.username,
            email: newUser.email,
            password: hashedPass,
            createdAt: userCreatedUpdated.createdAt,
            updatedAt: userCreatedUpdated.updatedAt
        }
    }
}

module.exports = UserModel