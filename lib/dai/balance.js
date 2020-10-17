// @flow
'use strict'
import { sendTx } from '../eth/sendEth'
import { DAI_CONTRACT_ADDRESS, DAI_ABI, DAI_DECIMALS } from '../constants/dai'

import type { Wallet, Address } from '../model/wallet'
import type { Web3 } from '../model/web3'

import { utils } from 'web3'
import {
  type GetTokenBalanceType,
  type CollectTokenType,
  type EstimateGasType,
  type MinWithdrawBalanceType
} from '../getTokenConfig'

export const getDaiBalance: GetTokenBalanceType = async ({ web3 }, wallet) => {
  const contract = new web3.eth.Contract(DAI_ABI, DAI_CONTRACT_ADDRESS)
  const balance = await contract.methods.balanceOf(wallet).call()
  return balance
}

export const estimateDaiGas: EstimateGasType = async ({ web3 }, to, amount) => {
  // const contract = new web3.eth.Contract(DAI_ABI, DAI_CONTRACT_ADDRESS)
  return '60000' // contract.methods.transfer(to, amount).estimateGas()
}

export const collectDai: CollectTokenType = async ({ web3, db }, from, amount) => {
  const to = process.env.DAI_HOT_WALLET_ADDRESS
  if (!to) {
    throw new Error('Missing DAI HOT Wallet!!!')
  }
  return sendDai({ web3, db }, from, to, amount)
}

export const minimumDaiWithdrawBalance: MinWithdrawBalanceType = () => {
  return utils.toBN(parseInt(process.env.DAI_MINIMUM_WITHDRAW_BALANCE) * Math.pow(10, DAI_DECIMALS))
}
async function sendDai ({ web3, db }: Web3, from: Wallet, to: Address, amount: string): Promise<any> {
  const contract = new web3.eth.Contract(DAI_ABI, DAI_CONTRACT_ADDRESS)
  const data = await contract.methods.transfer(to, amount).encodeABI()
  return sendTx({ web3, db }, from, DAI_CONTRACT_ADDRESS, { data }, 'sendDai')
}
