const { UserInputError } = require('apollo-server')

const emptyCartResolver = async (_, { input }, { db }) => {
  const { id: _id } = input

  try {
    const cart = await db.Cart.findOneAndUpdate(
      { _id },
      {
        $set: {
          items: [],
        },
      },
      { new: true }
    ).exec()

    if (!cart) {
      throw new UserInputError('Cart does not exist', {
        invalidArgs: ['id'],
      })
    }

    return cart
  } catch (err) {
    return err
  }
}

module.exports = emptyCartResolver
