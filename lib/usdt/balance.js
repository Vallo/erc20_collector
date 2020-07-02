// @flow
'use strict'
import { sendTx } from '../eth/sendEth'
import { USDT_CONTRACT_ADDRESS, USDT_ABI } from '../constants/usdt'

import type { Wallet, Address } from '../model/wallet'
import type { Web3 } from '../model/web3'

export async function getUsdtBalance ({ web3 }: Web3, wallet: Address): Promise<string> {
  const contract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS)
  const balance = await contract.methods.balanceOf(wallet).call()
  return balance
}

export async function sendUsdt ({ web3 }: Web3, from: Wallet, to: Address, amount: string): Promise<any> {
  const contract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS)
  const data = await contract.methods.transfer(to, amount).encodeABI()
  return sendTx({ web3 }, from, USDT_CONTRACT_ADDRESS, { data }, 'sendUsdt')
}

export async function estimateGas ({ web3 }: Web3, to: Address, amount: string): Promise<string> {
  const contract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS)
  return contract.methods.transfer(to, amount).estimateGas()
}

export async function collectUsdt ({ web3 }: Web3, from: Wallet, amount: string): Promise<any> {
  const to = process.env.USDT_HOT_WALLET_ADDRESS
  if (!to) {
    throw new Error('Missing USDT HOT Wallet!!!')
  }
  return sendUsdt({ web3 }, from, to, amount)
}
