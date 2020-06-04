const { UserInputError } = require('apollo-server')
const currencyFormatter = require('currency-formatter')

const addItemResolver = async (
  _,
  { input },
  { db, currency: currencyHeader }
) => {
  const {
    cartId,
    id,
    quantity = 1,
    currency: { code, ...customCurrency } = { code: 'USD' },
    ...newItemData
  } = input
  if (quantity <= 0) {
    throw new UserInputError('You must provide a positive quantity', {
      invalidArgs: ['quantity'],
    })
  }

  const defaultCurrency = currencyFormatter.findCurrency(currencyHeader || code)

  const currency = {
    ...defaultCurrency,
    ...customCurrency,
  }

  try {
    let cart
    let cartWithItem

    cartWithItem = await db.Cart.findOne({
      _id: cartId,
      'items._id': id,
    }).exec()

    if (cartWithItem) {
      const $set = Object.keys(newItemData).reduce(
        (setters, key) => ({
          ...setters,
          [`items.$.${key}`]: input[key],
        }),
        {}
      )

      cart = await db.Cart.findOneAndUpdate(
        {
          _id: cartId,
          'items._id': id,
        },
        {
          $set,
          // $setOnInsert: {
          //   currency,
          // },
          ...(newItemData.type === 'SKU' && {
            $inc: {
              'items.$.quantity': quantity,
            },
          }),
        },
        { new: true }
      )

      return cart
    }

    cart = await db.Cart.findOneAndUpdate(
      { _id: cartId },
      {
        $setOnInsert: {
          currency,
        },
        $push: {
          items: { ...newItemData, quantity, _id: id },
        },
      },
      { new: true, upsert: true }
    ).exec()

    return cart
  } catch (err) {
    return err
  }
}

module.exports = addItemResolver
