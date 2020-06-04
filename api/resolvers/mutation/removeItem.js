const { UserInputError } = require('apollo-server')

const removeItemResolver = async (_, { input }, { db }) => {
  const { cartId, id: _id } = input

  try {
    const cart = await db.Cart.findOneAndUpdate(
      { _id: cartId, 'items._id': _id },
      {
        $pull: {
          items: {
            _id,
          },
        },
      },
      { new: true }
    ).exec()

    if (!cart) {
      throw new UserInputError('Cart item does not exist', {
        invalidArgs: ['cartId', 'id'],
      })
    }

    return cart
  } catch (err) {
    return err
  }
}

module.exports = removeItemResolver
