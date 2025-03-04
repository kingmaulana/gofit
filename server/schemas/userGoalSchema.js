const UserGoalModel = require("../models/userGoalModel");


const typeDefs = `#graphql
    type UserGoal {
        _id: ID!
        goalName: String
        userId: String
        startWeight: Float
        goalWeight: Float
        startDate: String
        endGoal: String
        exercise: ExerciseAI
    }

    type ExerciseAI {
        exercise: [String]
        duration: Int
    }

    type WeightProgress {
        _id: ID!
        userId: String
        weight: Float
        date: String
    }

    type Query {
        userGoals(userId: String): UserGoal
    }

    type Mutation {
        createUserGoal(
            goalName: String,
            userId: String,
            startWeight: Int,
            endGoal: String,
            startDate: String,
            activity: String, 
            goal: String, 
            bmi: Int, 
            goalWeight: Int
            ): UserGoal
        updateWeightProgress(userId: String, weight: Float): WeightProgress
        createSuggestionAI(userId: String): UserGoal
        giveAnalyticByAI(userId: String): UserGoal
    }
`;

const resolvers = {
    Query: {
        userGoals: async (_, args) => {
            try {
                const workouts = await UserGoalModel.findGoal(args)
                return workouts
            } catch (error) {
                throw new Error(error)
            }
        },
    },
    Mutation: {
        createUserGoal: async (_, args) => {
            try {
                const workout = await UserGoalModel.createGoal(args)
                return workout
            } catch (error) {
                throw new Error(error)
            }
        },
        updateWeightProgress: async (_, args) => {
            try {
                const workout = await UserGoalModel.updateWeightProgress(args)
                return workout
            } catch (error) {
                throw new Error(error)
            }
        },
        createSuggestionAI: async (_, args) => {
            try {
                const workout = await UserGoalModel.createSuggestionAI(args)
                return workout
            } catch (error) {
                throw new Error(error)
            }
        },
        giveAnalyticByAI: async (_, args) => {
            try {
                const workout = await UserGoalModel.giveAnalyticByAI(args)
                return workout
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}

module.exports = { userGoalTypeDefs: typeDefs, userGoalResolvers: resolvers };