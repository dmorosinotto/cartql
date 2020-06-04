const currencyFormatter = require('currency-formatter')

const cartResolver = async (
  _,
  { id, currency: { code, ...customCurrency } = { code: 'USD' } },
  { currency: currencyHeader, dataSources }
) => {
  const defaultCurrency = currencyFormatter.findCurrency(currencyHeader || code)

  const currency = {
    ...defaultCurrency,
    ...customCurrency,
  }

  return dataSources.cartsAPI.findOrCreateById({ id, currency })
}

module.exports = cartResolver
