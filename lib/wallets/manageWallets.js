// @flow
'use strict'
import { web3 } from '../nodeConnection'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'

import type { Wallet } from '../model/wallet'

export function createWallets (amount: number): void{
  return web3.eth.accounts.wallet.create(amount)
}

export function insertWallet ({ db }: any, wallet: Wallet) {
  console.log('inserting')
  return db.collection('wallets').insertOne({
    address: wallet.address,
    privateKey: wallet.privateKey
  })
}

export function getWalletsFromDb ({ db }: any): Promise<Wallet[]> {
  return db.collection('wallets').find().toArray()
}

export async function getWalletsFromTxt (): Promise<Wallet[]> {
  if (!process.env.WALLETS_TXT_PATH) {
    console.error('FALTA WALLETS_TXT_PATH')
    return []
  }
  const fileStream = createReadStream(process.env.WALLETS_TXT_PATH)
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  const wallets = []
  for await (const line of rl) {
    let wallet = line.split(':')
    wallets.push({ address: wallet[0], privateKey: wallet[1] })
  }
  return wallets
}
