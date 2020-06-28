// @flow
'use strict'
import { web3 } from '../nodeConnection'
import type { Wallet } from '../model/wallet'
export function createWallets (amount: number): void{
  return web3.eth.accounts.wallet.create(amount)
}

export function insertWallet ({ db }: any, wallet: Wallet) {
  console.log('inserting')
  return db.collection('wallets').insertOne({
    address: wallet.address,
    privateKey: wallet.secretKey
  })
}

export function getWallets ({ db }: any): Promise<Wallet[]> {
  return db.collection('wallets').find().toArray()
}
