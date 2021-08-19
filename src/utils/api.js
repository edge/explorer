const {
  xeStringFromMicroXe
} = require('@edge/wallet-utils')

const BLOCKCHAIN_API_URL = process.env.VUE_APP_BLOCKCHAIN_API_URL
const INDEX_API_URL = process.env.VUE_APP_INDEX_API_URL

const fetchBlocks = async ({ blockId, options = {} }) => {
  if (!options.page) {
    options.page = 1
  }

  if (!options.limit) {
    options.limit = 25
  }

  const url = blockId
    ? `${INDEX_API_URL}/block/${blockId}`
    : `${INDEX_API_URL}/blocks?page=${options.page}&limit=${options.limit}`

  if (blockId) {
    return fetchData(url)
      .then(results => {
        if (results.results && Array.isArray(results.results) && !results.results[0]) {
          return {
            blocks: [],
            metdata: {}
          }
        }

        const block = { ...results }

        block.transactions = pluckBlockTransactions(block)

        // Add total XE.
        block.total = block.transactions.reduce((accumulator, currentItem) => {
          accumulator += Number(currentItem.amount)
          return accumulator
        }, 0)

        // Add average XE.
        block.average = block.transactions.length ? block.total / block.transactions.length : 0

        return {
          blocks: [block],
          metadata: {}
        }
      })
  }

  return fetchData(url)
    .then(response => {
      const { results, metadata } = response

      results.forEach(block => {
        block.transactions = pluckBlockTransactions(block)

        // Add total XE.
        block.total = block.transactions.reduce((accumulator, currentItem) => {
          accumulator += Number(currentItem.amount)
          return accumulator
        }, 0)

        // Add average XE.
        block.average = block.transactions.length ? block.total / block.transactions.length : 0
      })

      return {
        blocks: results,
        metadata
      }
    })
}

const fetchData = (url, options = {}, payload) => {
  const fetchOptions = {
    method: options.method || 'get',
    headers: {
      'content-type': 'application/json'
    }
  }

  if (payload) {
    fetchOptions.body = JSON.stringify(payload, true, 2)
  }

  return fetch(url, fetchOptions)
    .then(res => {
      // a non-200 response code
      if (!res.ok) {
        // create error instance with HTTP status text
        const error = new Error(res.statusText)
        error.json = res.json()
        throw error
      }

      return res.json()
    })
    .catch(() => {
      return {
        results: [],
        metdata: {}
      }
    })
}

const fetchPendingTransactions = (address, options = {}) => {
  const url = `${BLOCKCHAIN_API_URL}/transactions/pending/${address}`

  return fetchData(url)
}

const fetchRates = async () => {
  return fetchData(`${INDEX_API_URL}/rates`)
}

const fetchTransactions = async ({ address, hash, options = {} }) => {
  if (typeof address !== 'string') {
    address = ''
  }

  if (!options.page) {
    options.page = 1
  }

  if (!options.limit) {
    options.limit = 25
  }

  const pendingTxUrl = `${BLOCKCHAIN_API_URL}/transactions/pending/${address}`
  const txUrl = hash
    ? `${INDEX_API_URL}/transaction/${hash}`
    : `${INDEX_API_URL}/transactions/${address}?page=${options.page}&limit=${options.limit}`

  let txResults = []

  if (hash) {
    return fetchData(txUrl)
      .then(results => {
        if (results.results && Array.isArray(results.results) && !results.results[0]) {
          return {
            transactions: [],
            metdata: {}
          }
        }

        const tx = { ...results }

        return {
          raw: {
            ...tx
          },
          transactions: [{
            amount: xeStringFromMicroXe(tx.amount),
            block: tx.block,
            date: new Date(tx.timestamp).toLocaleString(), // '16/04/2021 13:06',
            description: tx.data.memo || 'None',
            hash: tx.hash,
            recipient: tx.recipient,
            sender: tx.sender,
            timestamp: tx.timestamp,
            confirmations: tx.confirmations,
            pending: false
          }],
          metadata: {}
        }
      })
  }

  // Fetch pending transactions first.
  return fetchData(pendingTxUrl)
    .then(response => {
      // Pending transactions need to be reversed to show them in the correct order.
      response = response.reverse()
      txResults = txResults.concat(formatTransactions(address, response, true))

      // Fetch confirmed transactions.
      return fetchData(txUrl)
        .then(response => {
          const { results, metadata } = response
          txResults = txResults.concat(formatTransactions(address, results))

          return {
            transactions: txResults,
            metadata
          }
        })
    })
}

const fetchWallet = address => {
  return fetchData(`${BLOCKCHAIN_API_URL}/wallet/${address}`)
}

const formatTransactions = (address, data, pending) => {
  return data.map(tx => {
    return {
      address: tx.sender === address ? tx.recipient : tx.sender,
      amount: xeStringFromMicroXe(tx.amount),
      date: new Date(tx.timestamp).toLocaleString(), // '16/04/2021 13:06',
      description: tx.data.memo || 'None',
      hash: tx.hash,
      recipient: tx.recipient,
      sender: tx.sender,
      timestamp: tx.timestamp,
      type: tx.sender === address ? 'Sent' : 'Received',
      confirmations: tx.confirmations,
      block: tx.block,
      pending
    }
  })
}

const getNonce = async address => {
  const wallet = await fetchWallet(address)
  let nonce = wallet.nonce

  // Update nonce with pending transactions.
  let pendingTx = await fetchPendingTransactions(address)

  if (pendingTx.length) {
    pendingTx = pendingTx.sort((a, b) => {
      if (a.nonce === b.nonce) return 0
      return a.nonce > b.nonce ? -1 : 1
    })

    nonce = pendingTx[0].nonce + 1
  }

  return nonce
}

const pluckBlockTransactions = block => {
  const transactions = []
  const blockTransactionData = {
    ...block.data.transactions
  }

  Object.keys(blockTransactionData).forEach(address => {
    const addressData = blockTransactionData[address]

    Object.keys(addressData).forEach(tx => {
      transactions.push(addressData[tx])
    })
  })

  block.transactions = transactions.sort((a, b) => {
    if (a.timestamp === b.timestamp) return 0
    return a.timestamp < b.timestamp ? -1 : 1
  })

  return formatTransactions(null, block.transactions)
}

const search = input => {
  const blockHeightRegex = /^[0-9]+$/
  const txHashRegex = /[0-9a-f]{64}/

  if (txHashRegex.test(input)) {
    return fetchTransactions({ hash: input })
  }

  if (blockHeightRegex.test(input)) {
    return fetchBlocks({ hash: input })
  }

  return Promise.resolve({})
}

const sendTransaction = tx => {
  return fetchData(`${BLOCKCHAIN_API_URL}/transaction`, { method: 'post' }, tx)
}

export {
  fetchBlocks,
  fetchPendingTransactions,
  fetchRates,
  fetchTransactions,
  fetchWallet,
  formatTransactions,
  getNonce,
  search,
  sendTransaction
}
