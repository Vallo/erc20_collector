// @flow
'use strict'

import { sendEth, getGasPrice } from './eth/sendEth'
import { web3 } from './nodeConnection'
import { getDb } from './getDb'
import { getWalletsFromDb, getWalletsFromTxt } from './wallets/manageWallets'
import { getEthBalance } from './eth/getBalance'
import { utils } from 'web3'
import { getConfig } from './getTokenConfig'

import type { Wallet } from './model/wallet'
// buscar fondos USDT en todas las wallets
// si tienen fondos, verificar si tienen eth.
// Si tienen y alcanza, retirar, si no tienen, enviar eth.

const DEBUG = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'

export function processWallets (token: string) {
  getDb().then(async db => {
    if (!process.env.GAS_WALLET_PUBLIC_KEY || !process.env.GAS_WALLET_SECRET_KEY) {
      throw new Error('Missing gas wallet')
    }
    const gasProviderWallet: Wallet = {
      address: process.env.GAS_WALLET_PUBLIC_KEY,
      privateKey: process.env.GAS_WALLET_SECRET_KEY
    }
    const walletFromDb: Wallet[] = await getWalletsFromDb({ db })
    const wallets = walletFromDb.concat(await getWalletsFromTxt())
    wallets.forEach(async wallet => {
      try {
        ;const { getTokenBalance, collectToken, minWithdrawBalance, estimateGas } = getConfig(token)
        const tokenBalance = await getTokenBalance({ web3 }, wallet.address)
        const tokenBalanceBN = utils.toBN(tokenBalance)
        if (!tokenBalanceBN.isZero() && tokenBalanceBN.gte(minWithdrawBalance())) {
          const estimatedGas = await estimateGas({ web3 }, wallet.address, tokenBalance)
          const estimatedGasBN = utils.toBN(estimatedGas)
          const gasPrice = await getGasPrice()
          const gasPriceBN = utils.toBN(gasPrice)
          const gasBalance = await getEthBalance({ web3 }, wallet.address)
          const gasBalanceBN = utils.toBN(gasBalance)
          const gasRequired = gasPriceBN.mul(estimatedGasBN)
          if (gasBalanceBN.gte(gasRequired)) {
            DEBUG && console.log(`Retirando ${token} de wallet: ${wallet.address}`)
            await collectToken({ web3, db }, wallet, tokenBalance)
          } else {
            DEBUG && console.log('Gas insuficiente, enviando ' + gasRequired + ' Wei a wallet: ' + wallet.address)
            await sendEth({ web3, db }, gasProviderWallet, wallet.address, gasRequired)
          }
        } else {
          DEBUG && console.log(`No hay ${token} en wallet ${wallet.address}`)
        }
      } catch (err) {
        DEBUG && console.log(err)
        const ex = {
          msg: err.message,
          stack: err.stack
        }
        db.collection('exceptions').insertOne({ wallet: wallet.address, ex, t: new Date() })
        // console.log(`Hubo un error ¯\\_(ツ)_/¯ ID: ${ret.insertedId}`)
      }
    })
  })
}
