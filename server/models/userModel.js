const { database } = require("../config/mongodb")
const { ObjectId } = require('mongodb')
const { hashPassword, comparePassword } = require("../helpers/bcrypt")
const { signToken, verifyToken } = require("../helpers/jwt")
const { calculateBMI } =  require("../helpers/bmiFormula")
const UserGoalModel = require("./userGoalModel")



class UserModel {
    // * Ambil collection users
    static collection() {
        return database.collection("users")
    }

    static collectionGoal() {
        return database.collection("user_goal")
    }

    // * Fitur register user
    static async register(newUser) {

        // Validate user input (username, email, password, etc.)
        if (newUser.username === "" || newUser.username === undefined) {
            throw new Error("Please input your username.");
        }
    
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
        
        // Hash password
        const hashedPass = hashPassword(newUser.password);
    
        // Register user in the database
        const registeredUser = await this.collection().insertOne({
            username: newUser.username,
            email: newUser.email,
            password: hashedPass,
            weight: newUser.weight,
            age: newUser.age,
            height: newUser.height,
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    
        const newUserId = registeredUser.insertedId;
    
        // Calculate BMI and the weight change recommendation
        // const bmiResult = calculateBMI(newUser.weight, newUser.height / 100);
    
        // Check if the user has set their own goal weight
        // let goalWeight = newUser.goalWeight || null; // If user provides their goal weight
        
        // if (!goalWeight) {
        //     // If no goal weight is provided, use the BMI result to suggest a goal weight
        //     if (bmiResult.category === "Underweight") {
        //         // Calculate goal weight to reach BMI of 18.5
        //         goalWeight = 18.5 * (newUser.height / 100 * newUser.height / 100);  // This is the target weight for BMI 18.5
        //     } else if (bmiResult.category === "Normal weight") {
        //         goalWeight = newUser.weight; // No change in weight if already normal
        //     } else if (bmiResult.category === "Overweight" || bmiResult.category === "Obesity") {
        //         // Calculate goal weight to reach BMI of 24.9
        //         goalWeight = 24.9 * (newUser.height / 100 * newUser.height / 100);  // This is the target weight for BMI 24.9
        //     }
        // }
    
        // Create a goal for the user with the target weight
        await UserGoalModel.createGoal({
            goalName: newUser.goal,
            userId: newUserId,
            startWeight: newUser.weight,
            endGoal: newUser.endGoal,
            startDate: new Date(),
            activity: newUser.activity, 
            goal: newUser.goal, 
            bmi: newUser.bmi, 
            goalWeight: newUser.goalWeight, 
            endGoal: newUser.endGoal
        });

        const argsForAI = {
            userId: newUserId,
            weight: newUser.weight,
            height: newUser.height,
            age: newUser.age,
            gender: newUser.gender,
            activity: newUser.activity,
            goal: newUser.goal,
            endGoal: newUser.endGoal,
            bmi: newUser.bmi,
            goalWeight: newUser.goalWeight,
            endGoal: newUser.endGoal
        }

        //disini untuk ai suggestion ter create
        await UserGoalModel.createSuggestionAI(argsForAI)
    
        // Generate a JWT token for the user
        const payload = {
            _id: registeredUser.insertedId
        };
        const token = signToken(payload);
    
        // Return the access token
        return {
            access_token: token
        };
    }

    // * Fitur mendapatkan detail user berdasarkan ID
    static async userDetails(decodedToken) {
        try {
            // * cari user berdasarkan id dari token
            const user = await this.collection().findOne({
                _id: new ObjectId(decodedToken._id)
            })

            if(!user) {
                throw new Error("User not found");
            }

            const dataUser = {
                _id: user._id,
                username: user.username,
                email: user.email,
                age: user.age,
                height: user.height,
                weight: user.weight,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }

            return dataUser
        } catch (error) {
            throw new Error(error.message)

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

    // * Cek User (saat menggunakan app) apakah sudah menggunakan email atau usernamenya
    static async checkUser(username, email) {
        // * Cari di database users, username atau email sudah ada atau belum
        const existUser = await this.collection().findOne({
            $or: [{ username }, { email }]
        })

        // * Validasi username dan email
        if(existUser) {
            if (existUser.username === username) {
                throw new Error("This username has already been used, please use another username.")
            }
            if (existUser.email === email) {
                throw new Error("This email has already been used, please use another email.")
            }
        }

        // * kalau validasi lewat return false
        return false
    }

    // ! Buat model baru untuk validasi email dan username (unik)
}

module.exports = UserModel