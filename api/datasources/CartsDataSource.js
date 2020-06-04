const { DataSource } = require('apollo-datasource')

// TODO: Move all Mongoose virtuals to this DataSource,
// replace Mongoose with MongoClient

class CartsDataSource extends DataSource {
  constructor({ Cart }) {
    super()
    this.Cart = Cart
  }

  async findOrCreateById({ id: _id, currency }) {
    const existingCart = await this.Cart.findById(_id)

    if (existingCart) return existingCart

    const newCart = await new this.Cart({ _id, currency })

    await newCart.save()

    return newCart
  }
}

module.exports = CartsDataSource
