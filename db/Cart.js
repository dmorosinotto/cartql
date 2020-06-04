const { model, models, Schema } = require('mongoose')
const currencyFormatter = require('currency-formatter')

const { CartItemSchema } = require('./CartItem')

const CartSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: String,
    currency: {
      code: String,
      symbol: String,
      thousandsSeparator: String,
      decimalSeparator: String,
      spaceBetweenAmountAndSymbol: 'Boolean',
      decimalDigits: 'Number',
    },
    price: {
      type: Number,
      default: 0,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    notes: String,
    attributes: [{ key: String, value: String }],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
)

CartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((sum, i) => sum + i.quantity, 0)
})

CartSchema.virtual('totalUniqueItems').get(function() {
  return this.items.length
})

CartSchema.virtual('subTotal').get(function() {
  const { items, currency } = this

  const amount = items.reduce((sum, i) => {
    if (i.type === 'SKU') return sum + i.quantity * i.price

    return sum
  }, 0)

  return {
    amount,
    currency,
    formatted: currencyFormatter.format(amount / 100, currency),
  }
})

CartSchema.virtual('shippingTotal').get(function() {
  const { items, currency } = this

  const amount = items.reduce((sum, i) => {
    if (i.type === 'SHIPPING') return sum + i.quantity * i.price

    return sum
  }, 0)

  return {
    amount,
    currency,
    formatted: currencyFormatter.format(amount / 100, currency),
  }
})

CartSchema.virtual('taxTotal').get(function() {
  const { items, currency } = this

  const amount = items.reduce((sum, i) => {
    if (i.type === 'TAX') return sum + i.quantity * i.price

    return sum
  }, 0)

  return {
    amount,
    currency,
    formatted: currencyFormatter.format(amount / 100, currency),
  }
})

CartSchema.virtual('grandTotal').get(function() {
  const { items, currency } = this

  const amount = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

  return {
    amount,
    currency,
    formatted: currencyFormatter.format(amount / 100, currency),
  }
})

const Cart = models.Cart || model('Cart', CartSchema)

module.exports = {
  Cart,
  CartSchema,
}
