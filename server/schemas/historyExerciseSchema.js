const HistoryExerciseModel = require("../models/historyExerciseModel");



const typeDefs = `#graphql
    type HistoryExercise {
        _id: ID!
        userId: String
        exerciseId: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        historyExercises(userId: String): [HistoryExercise]
    }

    type Mutation {
        createHistoryExercise(userId: String, exerciseId: String): HistoryExercise
    }
`;

const resolvers = {
    Query: {
        historyExercises: async (_, args) => {
            try {
                const workouts = await HistoryExerciseModel.findAll(args)
                return workouts
            } catch (error) {
                throw new Error(error)
            }
        }
    },
}

module.exports = { historyExerciseTypeDefs: typeDefs, historyExerciseResolvers: resolvers };