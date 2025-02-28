const { database } = require("../config/mongodb")
const { ObjectId } = require('mongodb')
const { hashPassword, comparePassword } = require("../helpers/bcrypt")
const { signToken } = require("../helpers/jwt")


class UserModel {
    // * Ambil collection users
    static collection() {
        return database.collection("users")
    }

    // * Fitur register user
    static async register(newUser) {
        // * Validasi username
        if (newUser.username === "" || newUser.username === undefined) {
            throw new Error("Please input your username.")
        }

        // * validasi username length
        if (newUser.username.length < 2) {
            throw new Error("Your username must be atleast 2 characters.")
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
            throw new Error("Please input your email")
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
            throw new Error("Please use correct email format");
        }

        // * validasi password user
        if (newUser.password === "" || newUser.password === undefined) {
            throw new Error("Please input your password");
        }

        // * validasi password length
        if (newUser.password.length < 5) {
            throw new Error("Your password must be at least 5 characters");
        }

        // * hash password
        const hashedPass = hashPassword(newUser.password)

        // * register user baru
        const registeredUser = await this.collection().insertOne({
            username: newUser.username,
            email: newUser.email,
            password: hashedPass,
            weight: newUser.weight,
            age: newUser.age,
            height: newUser.height,
            goalsId: null,
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        
        // * Kalau berhasil login buat token
        const payload = {
            _id: registeredUser.insertedId
        }

        const token = signToken(payload)

        // * Return access_token
        return {
            access_token: token
        }

        // * return user yang baru daftar
        // return {
        //     _id: registeredUser.insertedId,
        //     username: newUser.username,
        //     email: newUser.email,
        //     password: hashedPass,
        //     createdAt: userCreatedUpdated.createdAt,
        //     updatedAt: userCreatedUpdated.updatedAt
        // }
    }

    // * Fitur login user
    static async login(email, password) {

        // * Validasi pengisian email
        if (email === "" || email === undefined) {
            throw new Error("Please input your registered email")
        }

        // * Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error("Please use correct email format");
        }

        // * Cari user berdasarkan email di collection users
        const user = await this.collection().findOne({
            email: email
        })

        // * Validasi jika email tidak ditemukan
        if (!user){
            throw new Error("Email or Password is incorrect");
        }

        // * Validasi password
        if (password === "" || password === undefined) {
            throw new Error("Please input the password");
        }

        // * Validasi password length
        if (password.length < 5) {
            throw new Error("Password must be at least 5 characters");
        }

        // * Compare password saat user login
        const isPassValid = comparePassword(password, user.password)

        // * Jika salah throw Error
        if (!isPassValid) {
            throw new Error("Email or Password is incorrect");
        }

        // * Kalau berhasil login buat token
        const payload = {
            _id: user._id,
            email: user.email,
            username: user.username
        }

        const token = signToken(payload)

        // * Return access_token
        return {
            access_token: token
        }
    }

    // ! Buat model baru untuk validasi email dan username (unik)
}

module.exports = UserModel