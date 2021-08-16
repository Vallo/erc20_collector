// @flow
'use strict'
import './env'
import { getUsdtBalance } from './usdt/methods'
import { getUsdcBalance } from './usdc/methods'
import { getDaiBalance } from './dai/methods'

import { getEthBalance } from './eth/getBalance'

import { web3 } from './nodeConnection'
import { getDb } from './getDb'
import { getWalletsFromDb, getWalletsFromTxt } from './wallets/manageWallets'
import { utils } from 'web3'

import { USDT_DECIMALS } from './constants/usdt'
import { USDC_DECIMALS } from './constants/usdc'
import { DAI_DECIMALS } from './constants/dai'

import type { Wallet } from './model/wallet'

// buscar fondos USDT en todas las wallets
// si tienen fondos, verificar si tienen eth.
// Si tienen y alcanza, retirar, si no tienen, enviar eth.

// const DEBUG = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'
type walletWithBalance = {|
  ...Wallet,
  usdtBalance?: any,
  daiBalance?: any,
  ethBalance?: any,
  usdcBalance?: any
|}

function sum (wallets, key) {
  let i = utils.toBN(0)
  wallets.forEach(wallet => {
    i = i.add(wallet[key])
  })
  return i
}
export function getBalancesAndPrint () {
  getDb().then(async db => {
    let wallets: Wallet[] = await getWalletsFromDb({ db })
    wallets = wallets.concat(await getWalletsFromTxt())
    const promises = wallets.map(wallet => {
      return new Promise((resolve, reject) => {
        setTimeout(() => getBalanceForWallet(wallet, wallets, walletsWithBalances, resolve), getRandomDelay(0, 60000))
      })
    })
    const walletsWithBalances: walletWithBalance[] = await Promise.all(promises)

    process.stdout.write('\n')
    const totalUsdt = sum(walletsWithBalances, 'usdtBalance')
    const totalDai = sum(walletsWithBalances, 'daiBalance')
    const totalEth = sum(walletsWithBalances, 'ethBalance')
    const totalUsdc = sum(walletsWithBalances, 'usdcBalance')
    console.log('++++++++++ Resumen +++++++++++')
    console.log(`Wallets analizadas:  ${walletsWithBalances.length}`)
    const usdtDecimals = utils.toBN(Math.pow(10, USDT_DECIMALS))
    const daiDecimals = utils.toBN(Math.pow(10, DAI_DECIMALS))
    const usdcDecimals = utils.toBN(Math.pow(10, USDC_DECIMALS))
    console.log(`Total USDT: ${totalUsdt.div(usdtDecimals)}`)
    console.log(`Total USDC: ${totalUsdc.div(usdcDecimals)}`)
    console.log(`Total DAI: ${totalDai.div(daiDecimals)}`)
    console.log(`Total ETH: ${utils.fromWei(totalEth)}`)
  }
  )
}

let i = 0
getBalancesAndPrint()
let failed
async function getBalanceForWallet (wallet, wallets, walletsWithBalances, resolve) {
  try {
    failed = false
    const balances = {}
    balances.usdtBalance = utils.toBN(await getUsdtBalance({ web3 }, wallet.address))
    balances.usdcBalance = utils.toBN(await getUsdcBalance({ web3 }, wallet.address))
    balances.daiBalance = utils.toBN(await getDaiBalance({ web3 }, wallet.address))
    balances.ethBalance = utils.toBN(await getEthBalance({ web3 }, wallet.address))
    i++
    console.log(`wallets procesadas: ${i}/${wallets.length}`)
    resolve({ ...wallet, usdtBalance: balances.usdtBalance, daiBalance: balances.daiBalance, ethBalance: balances.ethBalance, usdcBalance: balances.usdcBalance })
  } catch (err) {
    failed = true
    if (!failed) {
      console.log('Fallo! ', err.message)
    }
    setTimeout(() => getBalanceForWallet(wallet, wallets, walletsWithBalances, resolve), getRandomDelay(60000, 120000))
  }
}

function getRandomDelay (min, max) {
  return Math.floor((min) + Math.random() * Math.floor(max))
}
