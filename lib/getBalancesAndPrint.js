// @flow
'use strict'

import { getUsdtBalance } from './usdt/balance'
import { getDaiBalance } from './dai/balance'
import { getEthBalance } from './eth/getBalance'

import { web3 } from './nodeConnection'
import { getDb } from './getDb'
import { getWalletsFromDb, getWalletsFromTxt } from './wallets/manageWallets'
import { utils } from 'web3'
import { USDT_DECIMALS } from './constants/usdt'
import { DAI_DECIMALS } from './constants/dai'

import type { Wallet } from './model/wallet'

// buscar fondos USDT en todas las wallets
// si tienen fondos, verificar si tienen eth.
// Si tienen y alcanza, retirar, si no tienen, enviar eth.

const DEBUG = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'
type walletWithBalance = {
  ...Wallet,
  usdtBalance?: any,
  daiBalance?: any,
  ethBalance?: any

}
export function getBalancesAndPrint () {
  getDb().then(async db => {
    let wallets: walletWithBalance[] = await getWalletsFromDb({ db })
    wallets = wallets.concat(await getWalletsFromTxt())
    let i = 0
    const promises = wallets.map(async wallet => {
      wallet.usdtBalance = await getUsdtBalance({ web3 }, wallet.address)
      wallet.daiBalance = await getDaiBalance({ web3 }, wallet.address)
      wallet.ethBalance = await getEthBalance({ web3 }, wallet.address)
      i++
      process.stdout.write(`${((i / wallets.length) * 100).toFixed(0)}% procesado... \r`)
    })
    await Promise.all(promises)

    process.stdout.write(`\n`)
    console.log({ wallets })
    const totalUsdt = wallets.reduce((walletA, walletB) => {
      return utils.toBN(walletA.usdtBalance).add(utils.toBN(walletB.usdtBalance))
    })
    const totalDai = wallets.reduce((walletA, walletB) => {
      return utils.toBN(walletA.daiBalance).add(utils.toBN(walletB.daiBalance))
    })
    const totalEth = wallets.reduce((walletA, walletB) => {
      return utils.toBN(walletA.ethBalance).add(utils.toBN(walletB.ethBalance))
    })
    console.log('++++++++++ Resumen +++++++++++')
    const usdtDecimals = utils.toBN(Math.pow(10, USDT_DECIMALS))
    const daiDecimals = utils.toBN(Math.pow(10, DAI_DECIMALS))
    console.log(`Total USDT: ${totalUsdt.div(usdtDecimals)}`)
    console.log(`Total DAI: ${totalDai.div(daiDecimals)}`)
    console.log(`Total ETH: ${utils.fromWei(totalEth)}`)
  }
  )
}
getBalancesAndPrint()
