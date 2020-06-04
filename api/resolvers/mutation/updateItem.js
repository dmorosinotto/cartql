const { UserInputError } = require('apollo-server')

const updateItemResolver = async (_, { input }, { db }) => {
  const { cartId, id: _id, ...data } = input

  if (data.quantity && data.quantity < 0) {
    throw new UserInputError(
      'You must provide a positive quantity or 0 to remove',
      {
        invalidArgs: ['quantity'],
      }
    )
  }

  try {
    const $set = Object.keys(data).reduce(
      (setters, key) => ({
        ...setters,
        [`items.$.${key}`]: data[key],
      }),
      {}
    )

    const $pull = { items: { _id } }

    const cart = await db.Cart.findOneAndUpdate(
      { _id: cartId, 'items._id': _id },
      {
        ...($set['items.$.quantity'] === 0 ? { $pull } : { $set }),
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

module.exports = updateItemResolver
