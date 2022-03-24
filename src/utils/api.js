// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

const qs = require('querystring')
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
    options.limit = 20
  }

  // Standard URL for blocks query.
  let query = '?'
  for (const key in options) {
    query += `${key}=${options[key]}&`
  }
  let url = `${INDEX_API_URL}/blocks${query.substring(0, query.length - 1)}`

  if (blockId) {
    // Single block query.
    let query = '?'
    for (const key in options) {
      query += `${key}=${options[key]}&`
    }
    let url = `${INDEX_API_URL}/block/${blockId}${query.substring(0, query.length - 1)}`

    return fetchData(url)
      .then(results => {
        if (results.results && Array.isArray(results.results) && !results.results[0]) {
          return {
            blocks: [],
            metadata: {}
          }
        }
        const block = { ...results }

        // Add average XE.
        block.average = block.txCount ? parseInt(block.total / block.txCount) : 0
        
        return {
          blocks: [block],
          metadata: {}
        }
      })
  }

  return fetchData(url)
    .then(response => {
      const { results, metadata } = response
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
        metadata: {}
      }
    })
}

const fetchPendingTransactions = (address, options = {}) => {
  const url = `${BLOCKCHAIN_API_URL}/transactions/pending/${address}`
  return fetchData(url)
}

const fetchStake = (stakeId) => fetchData(`${INDEX_API_URL}/stake/${stakeId}`)

const fetchStakeHistory = (stakeId) => fetchData(`${INDEX_API_URL}/stake/${stakeId}/history?limit=999`)

const fetchStakeStats = () => fetchData(`${INDEX_API_URL}/stats/stakes`)

const fetchStakes = (options) => {
  if (!options.page) options.page = 1
  if (!options.limit) options.limit = 20
  const url = `${INDEX_API_URL}/stakes?page=${options.page}&limit=${options.limit}`
  return fetchData(url)
}

const fetchStakesByWallet = (address, options) => {
  if (!options.page) options.page = 1
  if (!options.limit) options.limit = 10
  const url = `${INDEX_API_URL}/stakes/${address}?page=${options.page}&limit=${options.limit}`
  return fetchData(url)
}

const fetchExchangeTransaction = (hash) => {
  const url = `${INDEX_API_URL}/exchange/${hash}`
  return fetchData(url)
}

const fetchWallet = async (address) => {
  const url = `${INDEX_API_URL}/wallet/${address}`
  const results = await fetchData(url)
  return results
}

const fetchWallets = async (options = {}) => {
  if (!options.page) options.page = 1
  if (!options.limit) options.limit = 20

  let query = '?'
  for (const key in options) {
    query += `${key}=${options[key]}&`
  }
  const url = `${INDEX_API_URL}/wallets${query.substring(0, query.length - 1)}`

  const results = await fetchData(url)

  return results
}

const fetchTransactions = async ({ address, hash, options = {} }) => {
  if (typeof address !== 'string') address = ''
  if (!options.page) options.page = 1
  if (!options.limit) options.limit = 20

  const pendingTxUrl = `${BLOCKCHAIN_API_URL}/transactions/pending/${address}`
  let txUrl = `${INDEX_API_URL}/transactions/${address}?${qs.encode(options)}`
  let txResults = []

  if (hash) {
    txUrl = `${INDEX_API_URL}/transaction/${hash}`

    return fetchData(txUrl)
      .then(async results => {
        if (results.results && Array.isArray(results.results) && !results.results[0]) {
          const pendingTxs = await fetchData(`${BLOCKCHAIN_API_URL}/transactions/pending`)
          if (Array.isArray(pendingTxs) && pendingTxs.length > 0) {
            const pendingTx = pendingTxs.find(tx => tx.hash === hash)
            if (pendingTx !== undefined) {
              return {
                transactions: [{
                  ...pendingTx,
                  amount: xeStringFromMicroXe(pendingTx.amount),
                  memo: pendingTx.data.memo,
                  date: new Date(pendingTx.timestamp).toLocaleString(),
                  block: { height: 0, hash: '' },
                  confirmations: 0
                }],
                metadata: {}
              }
            }
          }
          return {
            transactions: [],
            metadata: {}
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
            memo: tx.data.memo,
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

  // On the first page only, fetch pending transactions first.
  if (options.page === 1) return fetchData(pendingTxUrl)
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

  // Fetch confirmed transactions.
  return fetchData(txUrl)
    .then(response => {
      const { results, metadata } = response
      return {
        transactions: formatTransactions(address, results),
        metadata
      }
    })
}

const formatTransactions = (address, data, pending) => {
  return data.map(tx => {
    return {
      address: tx.sender === address ? tx.recipient : tx.sender,
      amount: xeStringFromMicroXe(tx.amount),
      date: new Date(tx.timestamp).toLocaleString(), // '16/04/2021 13:06',
      memo: tx.data.memo,
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

const fetchSession = async (address) => {
  const url = `${INDEX_API_URL}/session/${address}`
  const results = await fetchData(url)
  return results
}

const search = async input => {
  const addressRegex = /^xe_[0-9a-fA-F]{40}$/
  const blockHeightRegex = /^[0-9]+$/
  const hashRegex = /[0-9a-f]{64}/

  if (addressRegex.test(input)) {
    const wallet = await fetchWallet(input)
    const node = await fetchSession(input)

    return Promise.resolve({
      node: node.results ? null : node,
      wallet: wallet.results ? null : wallet,
    })
  } else if (hashRegex.test(input)) {
    // The hash format is the same for blocks, transactions, and stakes,
    // so we need to query all of them for the input.
    const { blocks } = await fetchBlocks({ blockId: input })
    const { transactions } = await fetchTransactions({ hash: input })
    const stake = await fetchStake(input)

    return Promise.resolve({
      blocks: blocks.length ? blocks : null,
      stake: stake.results ? null : stake,
      transactions: transactions.length ? transactions : null
    })
  } else if (blockHeightRegex.test(input)) {
    return fetchBlocks({ blockId: input })
  } else {
    return Promise.resolve({})
  }
}

export {
  fetchBlocks,
  fetchPendingTransactions,
  fetchStake,
  fetchStakeHistory,
  fetchStakeStats,
  fetchStakes,
  fetchStakesByWallet,
  fetchExchangeTransaction,
  fetchTransactions,
  fetchWallet,
  fetchWallets,
  formatTransactions,
  search
}
