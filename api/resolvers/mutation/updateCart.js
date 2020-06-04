const currencyFormatter = require('currency-formatter')
const { UserInputError } = require('apollo-server')

const updateCartResolver = async (
  _,
  { input },
  { db, currency: currencyHeader }
) => {
  const {
    id: _id,
    currency: { code, ...customCurrency } = { code: 'USD' },
    ...newCartData
  } = input

  const defaultCurrency = currencyFormatter.findCurrency(currencyHeader || code)

  const currency = {
    ...defaultCurrency,
    ...customCurrency,
  }

  // const $set = Object.keys(newCartData).reduce(
  //   (setters, key) => ({
  //     ...setters,
  //     key: newCartData[key]
  //   }),
  //   { currency }
  // )

  try {
    const cart = await db.Cart.findOneAndUpdate(
      { _id },
      {
        $set: {
          currency,
          ...newCartData,
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

module.exports = updateCartResolver
