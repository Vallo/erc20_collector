// @flow
'use strict'

import './env'
import { getDb } from './getDb'
import { createWallets, getWalletsFromDb, insertWallet } from './wallets/manageWallets'

import type { Wallet } from './model/wallet'

const MAX_WALLETS = parseInt(process.env.MAX_WALLETS)

getDb().then(async db => {
  const actualWallets = await getWalletsFromDb({ db })
  if (actualWallets.length < MAX_WALLETS) {
    const missingWallets = MAX_WALLETS - actualWallets.length
    const walletsObj: any = createWallets(missingWallets)
    console.log('Wallets creadas:')
    for (let index = 0; index < missingWallets; index++) {
      const wallet: Wallet = { address: walletsObj[index.toString()].address, privateKey: walletsObj[index.toString()].privateKey }
      console.log(wallet.address)
      insertWallet({ db }, wallet)
    }
  }
})
