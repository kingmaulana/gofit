const UserExerciseModel = require("../models/userExerciseModel");


const typeDefs = `#graphql
type UserExercise {
    _id: ID!
    name: String
    userId: String
    duration: Int
    restDuration: Int
    exerciseId: [String]
}


type ExerciseCategory {
    _id: ID!
    name: String
    exerciseId: [String]
    duration: Int
}


type Query {
    userExercises(id: String): [UserExercise]

    exerciseCategories: [ExerciseCategory]
}

type Mutation {
    addUserExercise(name: String, userId: String, duration: Int, restDuration: Int,  exerciseId: [String]): UserExercise

    # untuk update belum perlu kirim userId karena di UI pas fetch semua koleksi exercise yg muncul hanya punya user
    updateName(name: String, id: String): UserExercise

    updateExercise(id: String, exerciseId: [String]): UserExercise

    deleteCollectionExercise(id: String): UserExercise

    deleteExercise(id: String, exerciseId: String): UserExercise
}

`;

const resolvers = {
    Query: {
        userExercises: async (_, args) => {
            try {
                const workouts = await UserExerciseModel.findAll(args.id)
                return workouts
            } catch (error) {
                throw new Error(error)
            }
        },
        exerciseCategories: async () => {
            try {
                const categories = await UserExerciseModel.findAllCategories()
                return categories
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        addUserExercise: async (_, args) => {
            try {
                const userExercise = await UserExerciseModel.create(args)
                return userExercise
            } catch (error) {
                throw new Error(error)
            }
        },
        updateName: async (_, args) => {
            try {
                const userExercise = await UserExerciseModel.updateName(args)
                return userExercise
            } catch (error) {
                throw new Error(error)
            }
        },
        updateExercise: async (_, args) => {
            console.log("🚀 ~ updateExercise: ~ args:", args)
            try {
                const userExercise = await UserExerciseModel.updateExercise(args)
                return userExercise
            } catch (error) {
                throw new Error(error)
            }
        },
        deleteCollectionExercise: async (_, args) => {
            try {
                const userExercise = await UserExerciseModel.deleteCollectionExercise(args)
                return "Delete success"
            } catch (error) {
                throw new Error(error)
            }
        },
        deleteExercise: async (_, args) => {
            try {
                const userExercise = await UserExerciseModel.deleteExercise(args)
                return "Delete success"
            } catch (error) {
                throw new Error(error)
            }
        }

    }
}

module.exports = { userExerciseTypeDefs: typeDefs, userExerciseResolvers: resolvers };