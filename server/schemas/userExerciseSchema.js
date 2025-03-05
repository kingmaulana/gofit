const UserExerciseModel = require("../models/userExerciseModel");


const typeDefs = `#graphql
type UserExercise {
    _id: ID!
    name: String
    userId: String
    duration: Int
    restDuration: Int
    exerciseId: [String]
    exercises: [Workout]
}

type Workout {
        _id: ID!
        name: String
        force: String
        level: String
        mechanic: String
        equipment: String
        primaryMuscles: [String]
        secondaryMuscles: [String]
        instructions: [String]
        category: String
        images: [String]
    }


type ExerciseCategory {
    _id: ID!
    name: String
    exerciseId: [String]
    duration: Int
}

type CompleteCategoryExercise {
    _id: ID!
    name: String
    exerciseId: [String]
    duration: Int
    exercises: [Workout]
}


type Query {
    userExercises: [UserExercise]
    exerciseCategories: [ExerciseCategory]
    getAllExercises(level: [String], equipment: [String], category: [String], search: String): [Workout]
    getCategoryById(idCategory: String): CompleteCategoryExercise
}

type Mutation {
    addUserExercise(name: String, duration: Int, restDuration: Int,  exerciseId: [String]): UserExercise
    # untuk update belum perlu kirim userId karena di UI pas fetch semua koleksi exercise yg muncul hanya punya user
    updateName(name: String, id: String): UserExercise
    updateExercise(id: String, exerciseId: [String]): UserExercise
    deleteCollectionExercise(id: String): UserExercise
    deleteExercise(id: String, exerciseId: String): UserExercise
}

`;

const resolvers = {
    Query: {
        userExercises: async (_, args, context) => {
            try {
                const user = await context.authentication();
                return await UserExerciseModel.findAll(user._id)
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
        },
        getAllExercises: async (_, args) => {
            try {
                const exercises = await UserExerciseModel.getAllExercises(args)
                return exercises
            } catch (error) {
                throw new Error(error)
            }
        },
        getCategoryById: async (_, args) => {
            try {
                const categories = await UserExerciseModel.getCategoryById(args.idCategory)
                return categories
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        addUserExercise: async (_, args, context) => {
            try {
                const user = await context.authentication();
                return await UserExerciseModel.create(args, user._id)
            } catch (error) {
                throw new Error(error)
            }
        },
        updateName: async (_, args, context) => {
            try {
                const user = await context.authentication();
                return await UserExerciseModel.updateName(args, user._id)
            } catch (error) {
                throw new Error(error)
            }
        },
        updateExercise: async (_, args, context) => {
            console.log("🚀 ~ updateExercise: ~ args:", args)
            try {
                const user = await context.authentication();
                const userExercise = await UserExerciseModel.updateExercise(args, user._id)
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