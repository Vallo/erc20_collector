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

function sum (wallets, key) {
  let i = utils.toBN(0)
  wallets.forEach(wallet => {
    i = i.add(wallet[key])
  })
  return i
}
export function getBalancesAndPrint () {
  getDb().then(async db => {
    let wallets: walletWithBalance[] = await getWalletsFromDb({ db })
    wallets = wallets.concat(await getWalletsFromTxt())
    let i = 0
    const promises = wallets.map(async wallet => {
      wallet.usdtBalance = utils.toBN(await getUsdtBalance({ web3 }, wallet.address))
      i++
      process.stdout.write(`${((i / (wallets.length * 3)) * 100).toFixed(0)}% procesado... \r`)
      wallet.daiBalance = utils.toBN(await getDaiBalance({ web3 }, wallet.address))
      i++
      process.stdout.write(`${((i / (wallets.length * 3)) * 100).toFixed(0)}% procesado... \r`)
      wallet.ethBalance = utils.toBN(await getEthBalance({ web3 }, wallet.address))
      i++
      process.stdout.write(`${((i / (wallets.length * 3)) * 100).toFixed(0)}% procesado... \r`)
    })
    await Promise.all(promises)

    process.stdout.write(`\n`)
    const totalUsdt = sum(wallets, 'usdtBalance')
    const totalDai = sum(wallets, 'daiBalance')
    const totalEth = sum(wallets, 'ethBalance')
    console.log('++++++++++ Resumen +++++++++++')
    console.log(`Wallets analizadas:  ${wallets.length}`)
    const usdtDecimals = utils.toBN(Math.pow(10, USDT_DECIMALS))
    const daiDecimals = utils.toBN(Math.pow(10, DAI_DECIMALS))
    console.log(`Total USDT: ${totalUsdt.div(usdtDecimals)}`)
    console.log(`Total DAI: ${totalDai.div(daiDecimals)}`)
    console.log(`Total ETH: ${utils.fromWei(totalEth)}`)
  }
  )
}
getBalancesAndPrint()
