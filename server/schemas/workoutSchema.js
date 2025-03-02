const WorkoutModel = require("../models/workoutModel");

const typeDefs = `#graphql
    type Workout {
        _id: ID!
        name: String
        force: String
        level: String
        mechanic: String
        equipement: String
        primaryMuscles: [String]
        secondaryMuscles: [String]
        instructions: [String]
        category: String
        image: [String]
    }

    type CategoryWorkout {
        _id: ID!
        name: String
        workoutId: [String]
    }

    type Query {
        workouts: [Workout]
        workoutById(id: ID!): Workout
        workoutByCategory(category: String!): [Workout]
    }

`;

const resolvers = {
    Query: {
        workouts: async () => {
            try {
                const workouts = await WorkoutModel.findAll()
                return workouts
            } catch (error) {
                throw new Error(error)
            }
        },
        workoutById: async (_, args) => {
            try {
                const workout = await WorkoutModel.findById(args.id)
                return workout
            } catch (error) {
                throw new Error(error)
            }
        },
        workoutByCategory: async (_, args) => {
            try {
                const workouts = await WorkoutModel.findByCategory(args.category)
                return workouts
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}

module.exports = { workoutTypeDefs: typeDefs, workoutResolvers: resolvers };