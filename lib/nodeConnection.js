'use strict'

const Web3 = require('web3')
const web3 = new Web3(
  process.env.NODE_URL
)
export { web3 }
