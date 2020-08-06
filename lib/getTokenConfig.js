// @flow
import { TOKEN } from './model/token'
import type { Token } from './model/token'

import { getDaiBalance, collectDai, minimumDaiWithdrawBalance } from './dai/balance'
import { getUsdtBalance, collectUsdt, minimumUsdtWithdrawBalance } from './usdt/balance'

import type { Web3 } from './model/web3'
import type { Address, Wallet } from './model/wallet'
type Config = {
  getTokenBalance: (Web3, Address) => Promise<string>,
  collectToken: (Web3, Wallet, string) => Promise<any>,
  minWithdrawBalance: () => number
}

export function getConfig (token: Token): Config {
  if (token === TOKEN.USDT) {
    return { getTokenBalance: getUsdtBalance, collectToken: collectUsdt, minWithdrawBalance: minimumUsdtWithdrawBalance }
  } else if (token === TOKEN.DAI) {
    return { getTokenBalance: getDaiBalance, collectToken: collectDai, minWithdrawBalance: minimumDaiWithdrawBalance }
  }
}
