// @flow
import { TOKEN, type Token } from './model/token'

import { getDaiBalance, collectDai, minimumDaiWithdrawBalance, estimateDaiGas } from './dai/methods'

import { getUsdtBalance, collectUsdt, minimumUsdtWithdrawBalance, estimateUsdtGas } from './usdt/methods'

import type { Web3 } from './model/web3'
import type { Address, Wallet } from './model/wallet'

export type GetTokenBalanceType = (web3: Web3, address: Address) => Promise<string>
export type CollectTokenType = (web3: Web3, wallet: Wallet, string: string) => Promise<any>
export type MinWithdrawBalanceType = () => Number
export type EstimateGasType = (web3: Web3, to: Address, amount: string) => Promise<string>

type Config = {
  getTokenBalance: GetTokenBalanceType,
  estimateGas: EstimateGasType,
  collectToken: CollectTokenType,
  minWithdrawBalance: MinWithdrawBalanceType,
}

export function getConfig (token: Token): Config {
  if (token === TOKEN.USDT) {
    const config: Config = { getTokenBalance: getUsdtBalance, collectToken: collectUsdt, minWithdrawBalance: minimumUsdtWithdrawBalance, estimateGas: estimateUsdtGas }
    return config
  } else {
    const config: Config = { getTokenBalance: getDaiBalance, collectToken: collectDai, minWithdrawBalance: minimumDaiWithdrawBalance, estimateGas: estimateDaiGas }
    return config
  }
}
