// @flow
'use strict'
import { sendTx } from '../eth/sendEth'
import { DAI_CONTRACT_ADDRESS, DAI_ABI, DAI_DECIMALS } from '../constants/dai'

import type { Wallet, Address } from '../model/wallet'
import type { Web3 } from '../model/web3'

import { utils } from 'web3'

export async function getDaiBalance ({ web3 }: Web3, wallet: Address): Promise<string> {
  const contract = new web3.eth.Contract(DAI_ABI, DAI_CONTRACT_ADDRESS)
  const balance = await contract.methods.balanceOf(wallet).call()
  return balance
}

export async function sendDai ({ web3, db }: Web3, from: Wallet, to: Address, amount: string): Promise<any> {
  const contract = new web3.eth.Contract(DAI_ABI, DAI_CONTRACT_ADDRESS)
  const data = await contract.methods.transfer(to, amount).encodeABI()
  return sendTx({ web3, db }, from, DAI_CONTRACT_ADDRESS, { data }, 'sendDai')
}

export async function estimateDaiGas ({ web3 }: Web3, to: Address, amount: string): Promise<string> {
  const contract = new web3.eth.Contract(DAI_ABI, DAI_CONTRACT_ADDRESS)
  return contract.methods.transfer(to, amount).estimateGas()
}

export async function collectDai ({ web3, db }: Web3, from: Wallet, amount: string): Promise<any> {
  const to = process.env.DAI_HOT_WALLET_ADDRESS
  if (!to) {
    throw new Error('Missing DAI HOT Wallet!!!')
  }
  return sendDai({ web3, db }, from, to, amount)
}

export function minimumDaiWithdrawBalance () {
  return utils.toBN(parseInt(process.env.DAI_MINIMUM_WITHDRAW_BALANCE) * Math.pow(10, DAI_DECIMALS))
}
