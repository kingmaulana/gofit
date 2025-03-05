const HistoryCategoryModel = require("../models/historyCategoryModel");



const typeDefs = `#graphql
type CategoryId {
    _id: ID!
    userId: String
    categoryId: String
    userGoalId: String
    userExerciseId: String
    createdAt: String
    updatedAt: String
    goalName: String
    categoryName: String
}

type Query {
    historyCategory: [CategoryId]
}

type Mutation {
    createHistoryCategory(categoryId: String, userGoalId: String, userExerciseId: String): CategoryId
}
`;

const resolvers = {
    Query: {
        historyCategory: async (_, __, ctx) => {
            try {
                const user = await ctx.authentication();
                const workouts = await HistoryCategoryModel.findAll({ userId: user._id })
                return workouts
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        createHistoryCategory: async (_, {categoryId, userGoalId, userExerciseId}, context) => {
            try {
                const user = await context.authentication();
                const workout = await HistoryCategoryModel.addToLogs({
                    userId: user._id,
                    categoryId,
                    userGoalId,
                    userExerciseId
                })
                return workout
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}

module.exports = { historyExerciseTypeDefs: typeDefs, historyExerciseResolvers: resolvers };