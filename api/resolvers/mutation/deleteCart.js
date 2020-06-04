const { UserInputError } = require('apollo-server')

const deleteCartResolver = async (_, { input }, { db }) => {
  const { id: _id } = input

  try {
    const { deletedCount } = await db.Cart.deleteOne({ _id })

    if (deletedCount === 0) {
      throw new UserInputError('Cart does not exist', {
        invalidArgs: ['id'],
      })
    }

    return {
      success: true,
      message: 'Cart successfully deleted',
    }
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Unable to delete',
    }
  }
}

module.exports = deleteCartResolver
