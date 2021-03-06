// @flow
'use strict'

import { Transaction } from 'ethereumjs-tx'
import { getNonce } from './getNonce'
import type { Wallet, Address, Payload } from '../model/wallet'
import type { Web3 } from '../model/web3'

type RawTx = {
  nonce: number,
  gasPrice: string,
  gasLimit: string,
  to: Address,
  from: Address,
  data?: string,
  value?: any
}
export async function sendEth ({ web3 }: Web3, from: Wallet, to: Address, amount: string) {
  sendTx({ web3 }, from, to, { amount }, 'sendEth')
}

const DEBUG = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'

export async function sendTx ({ web3, db }: Web3, from: Wallet, to: Address, { amount, data }: Payload, method: string) {
  if (from.privateKey.indexOf('0x') !== -1) {
    from.privateKey = from.privateKey.substring(2, 66)
  }
  const privateKey = Buffer.from(from.privateKey, 'hex')
  const nonce = await getNonce({ web3 }, from.address)
  const gasPrice = await getGasPrice()
  const rawTx: RawTx = {
    nonce,
    gasPrice: web3.utils.numberToHex(gasPrice),
    gasLimit: web3.utils.numberToHex(60000), // amount ?  : web3.utils.numberToHex(50000),
    to,
    from: from.address
  }
  if (data) {
    rawTx.data = data
  }
  if (amount) {
    rawTx.value = web3.utils.numberToHex(amount)
  }
  DEBUG && console.log(`Enviando TX, gasPrice: ${rawTx.gasPrice}, gasLimit: ${rawTx.gasLimit}, data: ${rawTx.data || '-'}, value: ${rawTx.value || '-'}, method: ${method || 'not set'}`)
  const options = process.env.DEV && process.env.DEV.toLowerCase() === 'true' ? { chain: 'ropsten' } : {}
  const tx = new Transaction(rawTx, options)
  tx.sign(privateKey)

  const serializedTx = tx.serialize()
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', async (receipt) => {
      db && await db.collection('transactions').insertOne({ method, receipt })
      // DEBUG && console.log(receipt)
    })
    .on('error', async (error) => {
      DEBUG && console.log(error)
      db && await db.collection('exceptions').insertOne({ wallet: from.address, ex: error, t: new Date() })
    })
}

export async function getGasPrice (): Promise<number> {
  if (!process.env.GAS_PRICE_GWEI) {
    throw new Error('GAS_PRICE_GWEI MISSING')
  }
  return parseInt(process.env.GAS_PRICE_GWEI) * 1000000000
}
