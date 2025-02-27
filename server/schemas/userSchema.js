const UserModel = require("../models/userModel")
// const { ObjectId } = require('mongodb')

// * Data User
const typeDefs = `#graphql

    # Collection User
    type User {
        _id: ID!
        username: String
        email: String
        weight: Int
        age: Int
        height: Int
        goalsId: ID
        categoryId: ID
        createdAt: String!
        updatedAt: String!
    }

    # Token
    type Token {
        access_token: String
    }

    # Query (Read Operation)
    type Query {
        users: [User]
    }

    # Collection Token
    type Token {
        access_token: String
    }

    # Mutation untuk write
    type Mutation {
        # Register
        register(username: String, email: String, password: String) : User

        # Login
        login(email: String, password: String): Token
    }

`;


// * Resolvers
const resolvers = {
    Mutation: {
        // * Mutation Register User
        register: async (parents, { username, email, password }) => {
            const newUser = {
                username,
                email,
                password
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