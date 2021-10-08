const { rem } = require('../utils')

const walletTableStyles = ({ theme }) => ({
  base: {
    'table': {
      width: '100%'
    },
    'thead': {
      'th': {
        padding: `${rem(13)} ${rem(5)}`,
        '&:first-of-type': {
          paddingLeft: rem(20)
        },
        '&:last-of-type': {
          paddingRight: rem(30)
        }
      }
    }
  }
})

const walletTable = ({ theme }) => {
  const {base} = walletTableStyles({ theme })
  return {
    '.wallet-table': base
  }
}

module.exports = { walletTable }
