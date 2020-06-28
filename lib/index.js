// @flow
'use strict'

import { getUsdtBalance, estimateGas, collectUsdt } from './usdt/balance'
import { sendEth } from './eth/sendEth'
import { web3 } from './nodeConnection'
import { getDb } from './mongo/getDb'
import { getWallets } from './mongo/manageWallets'
import { getEthBalance } from './eth/getBalance'
import { utils } from 'web3'

import type { Wallet } from './model/wallet'

// buscar fondos USDT en todas las wallets
// si tienen fondos, verificar si tienen eth.
// Si tienen y alcanza, retirar, si no tienen, enviar eth.

getDb().then(async db => {
  if (!process.env.GAS_WALLET_PUBLIC_KEY || !process.env.GAS_WALLET_SECRET_KEY) {
    throw new Error('Missing gas wallet')
  }
  const gasProviderWallet: Wallet = {
    address: process.env.GAS_WALLET_PUBLIC_KEY,
    secretKey: process.env.GAS_WALLET_SECRET_KEY
  }
  const wallets: Wallet[] = await getWallets({ db })
  const promises = wallets.map(async wallet => {
    const usdtBalance = await getUsdtBalance({ web3 }, wallet.address)
    console.log({ usdtBalance })
    const usdtBalanceBN = utils.toBN(usdtBalance)
    if (!usdtBalanceBN.isZero()) {
      const gasBalance = await getEthBalance({ web3 }, wallet.address)
      const estimatedGas = await estimateGas({ web3 }, wallet.address, usdtBalance)
      const estimatedGasBN = utils.toBN(estimatedGas)
      const gasBalanceBN = utils.toBN(gasBalance)
      if (gasBalanceBN.gt(estimatedGasBN)) {
        return collectUsdt({ web3 }, wallet, usdtBalance)
      } else {
        return sendEth({ web3 }, gasProviderWallet, wallet.address, estimatedGas)
      }
    } else {
      console.log('0 usdt balance')
    }
  })
  Promise.all(promises)
})
