// @flow
'use strict'

import './env'
import { sendEth, getGasPrice } from './eth/sendEth'
import { web3 } from './nodeConnection'
import { getDb } from './getDb'
import { getWalletsFromDb, getWalletsFromTxt } from './wallets/manageWallets'
import { getEthBalance } from './eth/getBalance'
import { utils } from 'web3'

import type { Wallet } from './model/wallet'
// buscar fondos USDT en todas las wallets
// si tienen fondos, verificar si tienen eth.
// Si tienen y alcanza, retirar, si no tienen, enviar eth.

const DEBUG = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'

export function processWallets () {
  getDb().then(async db => {
    if (!process.env.GAS_WALLET_PUBLIC_KEY || !process.env.GAS_WALLET_SECRET_KEY) {
      throw new Error('Missing gas wallet')
    }
    const walletFromDb: Wallet[] = await getWalletsFromDb({ db })
    const wallets = walletFromDb.concat(await getWalletsFromTxt())
    total = wallets.length
    wallets.forEach(async wallet => {
      try {
        setTimeout(() => { processWallet({ web3, db }, wallet) }, getRandomDelay(0, 60000))
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

function minWithdrawBalance (): number {
  if (!process.env.ETH_MINIMUM_WITHDRAW_BALANCE_WEI) {
    throw new Error()
  }
  return parseInt(process.env.ETH_MINIMUM_WITHDRAW_BALANCE_WEI)
}

function withdrawEth ({ web3, db }, wallet, weiToBeTransfered) {
  if (!process.env.ETH_HOT_WALLET_ADDRESS) {
    throw new Error('Missing ETH_HOT_WALLET_ADDRESS!')
  }
  const from = wallet
  const to = process.env.ETH_HOT_WALLET_ADDRESS
  sendEth({ web3, db }, from, to, weiToBeTransfered)
}

processWallets()
let total = 0
let i = 0
async function processWallet ({ web3, db }, wallet) {
  try {
    const ethBalance = await getEthBalance({ web3 }, wallet.address)
    const ethBalanceBN = utils.toBN(ethBalance)
    if (!ethBalanceBN.isZero()) {
      const estimatedGas = '60000'
      const estimatedGasBN = utils.toBN(estimatedGas)
      const gasPrice = await getGasPrice()
      const gasPriceBN = utils.toBN(gasPrice)
      const gasRequired = gasPriceBN.mul(estimatedGasBN)
      const weiToBeTransfered = ethBalanceBN.sub(gasRequired)
      if (!weiToBeTransfered.isZero() && weiToBeTransfered.gte(minWithdrawBalance())) {
        DEBUG && console.log(`Retirando eth de wallet: ${wallet.address}`)
        await withdrawEth({ web3, db }, wallet, weiToBeTransfered)
      } else {
        DEBUG && console.log(`Eth insuficiente para pagar gas o eth por debajo del mínimo para retiro en wallet: ${wallet.address}`)
      }
    } else {
      DEBUG && console.log(`No hay eth en wallet ${wallet.address}`)
    }
    i++
    console.log(`wallets procesadas: ${i}/${total}`)
  } catch (err) {
    setTimeout(() => { processWallet({ web3, db }, wallet) }, getRandomDelay(60000, 120000))
  }
}

function getRandomDelay (min, max) {
  return Math.floor((min) + Math.random() * Math.floor(max))
}
