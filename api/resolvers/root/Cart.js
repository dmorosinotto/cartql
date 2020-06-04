const isAfter = require('date-fns/isAfter')
const subHours = require('date-fns/subHours')

const RootCart = {
  abandoned: ({ updatedAt }) => isAfter(subHours(new Date(), 2), updatedAt),

  isEmpty: ({ totalUniqueItems }) => totalUniqueItems === 0,
}

module.exports = RootCart
