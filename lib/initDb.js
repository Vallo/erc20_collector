// @flow
'use strict'

import { getDb } from './mongo/getDb'
import { createWallets, getWallets, insertWallet } from './mongo/manageWallets'

import type { Wallet } from './model/wallet'
// buscar fondos USDT en todas las wallets
// si tienen fondos, verificar si tienen eth.
// Si tienen y alcanza, retirar, si no tienen, enviar eth.
const MAX_WALLETS = 1

getDb().then(async db => {
  const actualWallets = await getWallets({ db })
  if (actualWallets.length < MAX_WALLETS) {
    const missingWallets = MAX_WALLETS - actualWallets.length
    const walletsObj: any = createWallets(missingWallets)
    for (let index = 0; index < MAX_WALLETS; index++) {
      const wallet: Wallet = { address: walletsObj[index.toString()].address, secretKey: walletsObj[index.toString()].privateKey }
      insertWallet({ db }, wallet)
    }
  }
})
