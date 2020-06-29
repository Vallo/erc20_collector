// @flow
'use strict'

import { Transaction } from 'ethereumjs-tx'
import type { Wallet, Address, Payload } from '../model/wallet'
import type { Web3 } from '../model/web3'

export async function sendEth ({ web3 }: Web3, from: Wallet, to: Address, amount: string) {
  sendTx({ web3 }, from, to, { amount })
}

export async function sendTx ({ web3 }: Web3, from: Wallet, to: Address, { amount, data }: Payload) {
  if (from.privateKey.indexOf('0x') !== -1) {
    from.privateKey = from.privateKey.substring(2, 66)
  }
  const privateKey = Buffer.from(from.privateKey, 'hex')
  const nonce = await web3.eth.getTransactionCount(from.address)
  const gasPrice = await web3.eth.getGasPrice()
  var rawTx = {
    nonce,
    gasPrice: '0x' + gasPrice * 1.02,
    gasLimit: amount ? '0x21000' : '0x80000',
    to,
    from: from.address,
    data,
    value: '0x0'
  }
  if (amount) {
    rawTx.value = '0x' + amount
  }
  const options = process.env.DEV && process.env.DEV.toLowerCase() === 'true' ? { 'chain': 'ropsten' } : {}
  var tx = new Transaction(rawTx, options)
  tx.sign(privateKey)
  var serializedTx = tx.serialize()
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', console.log)
}
