// @flow
'use strict'
import { sendTx, getGasPrice } from '../eth/sendEth'
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
import axios from 'axios'

export const getUsdtBalance: GetTokenBalanceType = async ({ web3 }, wallet) => {
  const contract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS)
  const balance = await contract.methods.balanceOf(wallet).call()
  return balance
}
export const estimateUsdtGas: EstimateGasType = async ({ web3 }, to, amount) => {
  return '60000'
  // const contract = new web3.eth.Contract(USDT_ABI, USDT_CONTRACT_ADDRESS)
  // const data = contract.methods.transfer(to, amount).encodeABI()
  // console.log({ data })
  // const body = {
  //   jsonrpc: '2.0',
  //   method: 'eth_estimateGas',
  //   params: [{
  //     gasLimit: web3.utils.numberToHex(100000),
  //     gas: web3.utils.numberToHex(100000),
  //     data
  //   }],
  //   id: '1'
  // }
  // await axios.post(process.env.NODE_URL, body).then(res => {
  //   console.log(res.data)
  //   return res.data
  // })
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
