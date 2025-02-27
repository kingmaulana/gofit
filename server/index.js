// * Require dotenv config
require("dotenv").config();

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")


// * Import Schemas
const { userTypeDefs, userResolvers } = require("./schemas/userSchema")


// * Apollo Server
const server = new ApolloServer({
  typeDefs: [userTypeDefs],
  resolvers: [userResolvers],
  introspection: true // ! Sementara dinyalain dulu
})


startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
})

