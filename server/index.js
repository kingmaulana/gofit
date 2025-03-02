// * Require dotenv config
require("dotenv").config();

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const authentication = require("./middlewares/authentication")


// * Import Schemas
const { userTypeDefs, userResolvers } = require("./schemas/userSchema");
const { workoutTypeDefs, workoutResolvers } = require("./schemas/workoutSchema");
const { userExerciseTypeDefs, userExerciseResolvers } = require("./schemas/userExerciseSchema");


// * Apollo Server
const server = new ApolloServer({
  typeDefs: [userTypeDefs, workoutTypeDefs, userExerciseTypeDefs],
  resolvers: [userResolvers, workoutResolvers, userExerciseResolvers],
  introspection: true // ! Sementara dinyalain dulu
})


startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  ontext: async ({ req }) => {
    return {
      authentication: () => authentication({ req })
    }
  },
  introspection: true
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
})

