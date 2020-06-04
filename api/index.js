const { ApolloServer } = require('apollo-server')
const cuid = require('cuid')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const db = require('../db')
const { Cart } = require('../db')
const CartsDataSource = require('./datasources/CartsDataSource')

const getCurrency = ({ req }) => {
  try {
    if (req.headers['x-cartql-currency']) {
      return req.headers['x-cartql-currency'].toUpperCase()
    }

    return null
  } catch (err) {
    return err
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (req) => ({
    ...req,
    db,
    requestId: cuid(),
    currency: getCurrency(req),
  }),
  dataSources: () => ({
    cartsAPI: new CartsDataSource({ Cart }),
  }),
  introspection: true,
  playground: true,
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
  },
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
