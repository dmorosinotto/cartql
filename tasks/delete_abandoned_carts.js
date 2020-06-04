const subDays = require('date-fns/subDays')

const { Cart } = require('../db')

const $lt = subDays(new Date(), 7)

;(async () => {
  try {
    const carts = await Cart.deleteMany({
      updatedAt: {
        $lt,
      },
    })

    console.log(carts)
    process.exit()
  } catch (e) {
    console.error(e)
  }
})()
