// @flow
'use strict'
import type { Web3 } from '../model/web3'
import type { Address } from '../model/wallet'
const nonceMap: {[address: string]: number} = {}

export async function getNonce ({ web3 }: Web3, address: Address) {
  if (nonceMap[address]) {
    nonceMap[address] = nonceMap[address] + 1
    return nonceMap[address]
  }
  const nonce = await web3.eth.getTransactionCount(address, 'pending')
  if (!nonceMap[address]) {
    nonceMap[address] = nonce
  } else {
    nonceMap[address] = nonceMap[address] + 1
    return nonceMap[address]
  }
  return nonce
}
