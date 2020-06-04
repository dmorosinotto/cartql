const { UserInputError } = require('apollo-server')

const setItemsResolver = async (_, { input }, { db }) => {
  const { cartId: _id, items: rawItems } = input

  const hasNegativeQuantity = rawItems.some(({ quantity }) => quantity <= 0)

  if (hasNegativeQuantity) {
    throw new UserInputError('You must provide a positive quantity.', {
      invalidArgs: ['items.quantity'],
    })
  }

  try {
    const items = rawItems.map(({ id, ...obj }) => ({ _id, ...obj }))

    const cart = await db.Cart.findOneAndUpdate(
      { _id },
      { $set: { items } },
      { new: true }
    ).exec()

    if (!cart) {
      throw new UserInputError('Cart does not exist', {
        invalidArgs: ['cartId'],
      })
    }

    return cart
  } catch (err) {
    return err
  }
}

module.exports = setItemsResolver
