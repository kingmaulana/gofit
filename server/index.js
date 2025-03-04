// * Require dotenv config
require("dotenv").config();

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const authentication = require("./middlewares/authentication")


// * Import Schemas
const { userTypeDefs, userResolvers } = require("./schemas/userSchema");
const { workoutTypeDefs, workoutResolvers } = require("./schemas/workoutSchema");
const { userExerciseTypeDefs, userExerciseResolvers } = require("./schemas/userExerciseSchema");
const { historyExerciseTypeDefs, historyExerciseResolvers } = require("./schemas/historyCategorySchema");
const { userGoalTypeDefs, userGoalResolvers } = require("./schemas/userGoalSchema");


// * Apollo Server
const server = new ApolloServer({
  typeDefs: [userTypeDefs, workoutTypeDefs, userExerciseTypeDefs, historyExerciseTypeDefs, userGoalTypeDefs],
  resolvers: [userResolvers, workoutResolvers, userExerciseResolvers, historyExerciseResolvers, userGoalResolvers],
  introspection: true // ! Sementara dinyalain dulu
})



startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req }) => {
    return {
      authentication: () => authentication({ req })
    }
  },
  introspection: true
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
})

