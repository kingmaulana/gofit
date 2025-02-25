// const UserModel = require("../models/userModel")
// const { ObjectId } = require('mongodb')

// * Data User
const typeDefs = `#graphql

    # Collection User
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
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

    # Mutation untuk write
    type Mutation {
        # Register
        register()
    }

`;


// * Resolvers
const resolvers = {
    Mutation: {
        // * Fitur Register User
        register: async (parents, { username, email, password, weight, age, height }) => {
            const newUser = {
                username,
                email,
                password,
                weight,
                age,
                height
            }

            const user = await UserModel.register(newUser)
            return user
        }
    }
}