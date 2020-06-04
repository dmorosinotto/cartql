const { UserInputError } = require('apollo-server')

const incrementItemQuantityResolver = async (_, { input }, { db }) => {
  const { cartId, id, by } = input

  if (by <= 0) {
    throw new UserInputError(
      'Negative or zero value increment value provided',
      {
        invalidArgs: ['by'],
      }
    )
  }

  try {
    const cart = await db.Cart.findOneAndUpdate(
      { _id: cartId, 'items._id': id },
      { $inc: { 'items.$.quantity': by } },
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

module.exports = incrementItemQuantityResolver
