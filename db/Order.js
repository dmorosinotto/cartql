const { model, models, Schema } = require('mongoose')
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')

const OrderSchema = new Schema(
  {
    cartId: String,
    email: {
      type: String,
      lowercase: true,
      required: true,
    },
    billing: Schema.Types.Mixed,
    shipping: Schema.Types.Mixed,
    items: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    subTotal: Schema.Types.Mixed,
    shippingTotal: Schema.Types.Mixed,
    taxTotal: Schema.Types.Mixed,
    grandTotal: Schema.Types.Mixed,
    totalItems: Number,
    totalUniqueItems: Number,
    notes: String,
    attributes: [{ key: String, value: String }],
    status: {
      type: String,
      required: true,
      default: 'UNPAID',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

OrderSchema.plugin(mongooseLeanVirtuals)

const Order = models.Order || model('Order', OrderSchema)

module.exports = {
  Order,
  OrderSchema,
}
