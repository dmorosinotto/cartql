const Query = require('./query')
const Mutation = require('./mutation')
const Root = require('./root')

const resolvers = {
  Query,
  Mutation,
  ...Root,
}

module.exports = resolvers
