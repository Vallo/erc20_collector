// @flow
'use strict'
import { sendTx } from '../eth/sendEth'
import { USDT_CONTRACT_ADDRESS, USDT_ABI, USDT_DECIMALS } from '../constants/usdt'
import { utils } from 'web3'

import type { Wallet, Address } from '../model/wallet'
import type { Web3 } from '../model/web3'
import {
  type GetTokenBalanceType,
  type CollectTokenType,
  type EstimateGasType,
  type MinWithdrawBalanceType
} from '../getTokenConfig'

export const getUsdtBalance: GetTokenBalanceType = async ({ web3 }, wallet) => {
  const contract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS)
  const balance = await contract.methods.balanceOf(wallet).call()
  return balance
}

export const estimateUsdtGas: EstimateGasType = async ({ web3 }, to, amount) => {
  // const contract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS)
  return '60000' //  contract.methods.transfer(to, amount).estimateGas()
}

export const collectUsdt: CollectTokenType = async ({ web3, db }, from, amount) => {
  const to = process.env.USDT_HOT_WALLET_ADDRESS
  if (!to) {
    throw new Error('Missing USDT HOT Wallet!!!')
  }
  return sendUsdt({ web3, db }, from, to, amount)
}

export const minimumUsdtWithdrawBalance: MinWithdrawBalanceType = () => {
  return utils.toBN(parseInt(process.env.USDT_MINIMUM_WITHDRAW_BALANCE) * Math.pow(10, USDT_DECIMALS))
}

async function sendUsdt ({ web3, db }: Web3, from: Wallet, to: Address, amount: string): Promise<any> {
  const contract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS)
  const data = await contract.methods.transfer(to, amount).encodeABI()
  return sendTx({ web3, db }, from, USDT_CONTRACT_ADDRESS, { data }, 'sendUsdt')
}
