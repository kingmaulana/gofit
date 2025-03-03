const UserModel = require("../models/userModel")
// const { ObjectId } = require('mongodb')

// * Data User
const typeDefs = `#graphql

    # Collection User
    type User {
        _id: ID!
        username: String
        name: String
        email: String
        gender: String
        activity: String
        weight: Int
        age: Int
        height: Int
        goal: String
        categoryId: ID
        createdAt: String!
        updatedAt: String!
    }

    # Token
    type Token {
        access_token: String
    }

    # Type cek user
    type CheckUserResponse {
        success: Boolean
        message: String
    }

    # Query (Read Operation)
    type Query {
        users: [User]
        checkUser(username: String, email: String): CheckUserResponse
        getUserDetails: User
    }

    # Collection Token
    type Token {
        access_token: String
    }

    # Mutation untuk write
    type Mutation {
        # Register
        register(
        username: String, 
        name: String, 
        email: String, 
        password: String, 
        weight: Int,  
        height: Int,  
        age: Int,  
        gender: String, 
        activity: String,
        goal: String,
        bmi: Int,
        goalWeight: Int,
        endGoal: String,
        injuries: [String]
    ) : Token

        # Login
        login(email: String, password: String): Token
    }

`;


// * Resolvers
const resolvers = {
    Query: {
        // * Query cek keunikan username dan email
        checkUser: async (parents, { username, email }) => {
            try {
                const userExists = await UserModel.checkUser(username, email)

                // * Kalau ada return error message
                if (userExists) {
                    return { success: false, message: "Username or email already exists." };
                }
                
                // * Kalau berhasil set success ke true dan kirim message
                return { success: true, message: "Username and email are available, please continue." }
            } catch (error) {
                return { success: false, message: error.message };
            }
        },

        // * Query Fetch User Details (Ketika user sudah login)
        getUserDetails: async (parents, __, context) => {
            try {
                const decodedUser = await context.authentication();

        
                const userDetails = await UserModel.userDetails(decodedUser);
        
                return userDetails;
            } catch (error) {
                throw new Error(error.message);
            }

        }
    },
    Mutation: {
        // * Mutation Register User
        register: async (parents, { username, name, email, password, weight, age, height, gender, activity, goal, bmi, goalWeight, endGoal, injuries }) => {
            const newUser = {
                username,
                name,
                email,
                password,
                weight,
                age,
                height,
                gender, 
                activity, 
                goal, 
                bmi, 
                goalWeight,
                endGoal,
                injuries
            }
            const user = await UserModel.register(newUser)
            return user
        },

        // * Mutation Login User
        login: async (parents, { email, password }) => {
            const user = await UserModel.login(email, password)

            return user
        }
    }
}

module.exports = { userTypeDefs: typeDefs, userResolvers: resolvers };