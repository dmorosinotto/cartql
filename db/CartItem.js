const { Schema } = require('mongoose')
const currencyFormatter = require('currency-formatter')

const CartItemSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: String,
    description: String,
    type: {
      type: String,
      required: true,
    },
    images: [String],
    quantity: {
      type: 'Number',
      default: 1,
      min: 1,
    },
    price: {
      type: 'Number',
      default: 0,
    },
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

CartItemSchema.virtual('unitTotal').get(function() {
  const item = this
  const { currency } = item.parent()

  const amount = item.price

  return {
    amount,
    currency,
    formatted: currencyFormatter.format(amount / 100, currency),
  }
})

CartItemSchema.virtual('lineTotal').get(function() {
  const item = this
  const { currency } = item.parent()

  const amount = item.price * item.quantity

  return {
    amount,
    currency,
    formatted: currencyFormatter.format(amount / 100, currency),
  }
})

module.exports = {
  CartItemSchema,
}
