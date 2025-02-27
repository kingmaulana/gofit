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

    # Mutation untuk write
    type Mutation {
        # Register
        register(username: String, email: String, password: String) : User
    }

`;


// * Resolvers
const resolvers = {
    Mutation: {
        // * Fitur Register User
        register: async (parents, { username, email, password }) => {
            const newUser = {
                username,
                email,
                password
            }

            const user = await UserModel.register(newUser)
            return user
        }
    }
}

module.exports = { userTypeDefs: typeDefs, userResolvers: resolvers };