const { UserInputError } = require('apollo-server')
// const fetch = require('node-fetch')

const checkoutResolver = async (_, { input }, { db }) => {
  const { cartId, shipping: billing, ...checkoutInput } = input

  try {
    const cart = await db.Cart.findOne({
      _id: cartId,
    }).exec()

    if (!cart) {
      throw new UserInputError('Cart does not exist', {
        invalidArgs: ['cartId'],
      })
    }

    if (cart.isEmpty) {
      throw new UserInputError('Cannot checkout empty cart')
    }

    const {
      email,
      items,
      subTotal,
      shippingTotal,
      taxTotal,
      grandTotal,
      totalItems,
      totalUniqueItems,
      notes,
      attributes = [],
    } = cart

    const order = await new db.Order({
      cartId,
      email,
      billing,
      items,
      subTotal,
      shippingTotal,
      taxTotal,
      grandTotal,
      totalItems,
      totalUniqueItems,
      notes,
      attributes,
      ...checkoutInput,
    })

    await order.save()

    return order
  } catch (err) {
    return err
  }
}

module.exports = checkoutResolver
