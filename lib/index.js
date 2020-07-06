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

const DEBUG = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'

function processWallets () {
  getDb().then(async db => {
    if (!process.env.GAS_WALLET_PUBLIC_KEY || !process.env.GAS_WALLET_SECRET_KEY) {
      throw new Error('Missing gas wallet')
    }
    const gasProviderWallet: Wallet = {
      address: process.env.GAS_WALLET_PUBLIC_KEY,
      privateKey: process.env.GAS_WALLET_SECRET_KEY
    }
    const wallets = await getWallets({ db })
    wallets.forEach(async wallet => {
      try {
        DEBUG && console.log('Wallet: ' + wallet.address)
        const usdtBalance = await getUsdtBalance({ web3 }, wallet.address)
        DEBUG && console.log('USDT Balance: ' + usdtBalance)
        const usdtBalanceBN = utils.toBN(usdtBalance)
        if (!usdtBalanceBN.isZero()) {
          const gasBalance = await getEthBalance({ web3 }, wallet.address)
          DEBUG && console.log('Eth en wallet: ' + gasBalance)
          const estimatedGas = '30000' // await estimateGas({ web3 }, wallet.address, usdtBalance)
          const estimatedGasBN = utils.toBN(estimatedGas)
          const gasPrice = await web3.eth.getGasPrice()
          const gasPriceBN = utils.toBN(gasPrice)
          const gasRequired = gasPriceBN.mul(estimatedGasBN)
          const gasBalanceBN = utils.toBN(gasBalance)
          if (gasBalanceBN.gte(gasRequired)) {
            DEBUG && console.log('Retirando USDT')
            await collectUsdt({ web3, db }, wallet, usdtBalance)
          } else {
            DEBUG && console.log('Gas insuficiente, enviando ' + gasRequired + ' Wei a wallet: ' + wallet.address)
            await sendEth({ web3, db }, gasProviderWallet, wallet.address, gasRequired)
          }
        } else {
          DEBUG && console.log('No hay USDT en wallet ' + wallet.address)
        }
      } catch (err) {
        const ret = await db.collection('exceptions').insertOne({ wallet: wallet.address, ex: err, t: new Date() })
        console.log(`Hubo un error ¯\\_(ツ)_/¯ ID: ${ret.insertedId}`)
        DEBUG && console.log(err)
      }
    })
  })
}
processWallets()
// setInterval(processWallets)
