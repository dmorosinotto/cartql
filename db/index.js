const mongoose = require('mongoose')

const { Cart } = require('./Cart')
const { Order } = require('./Order')

const connectToDatabase = async (uri) => {
  let cachedConnection

  if (cachedConnection) return cachedConnection

  const connection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })

  cachedConnection = connection

  return connection
}

connectToDatabase(process.env.MONGODB_URI)

module.exports = {
  Cart,
  Order,
}
