// @flow
import type { Web3 } from '../model/web3'
import type { Address } from '../model/wallet'
export function getEthBalance ({ web3 }: Web3, wallet: Address): string {
  return web3.eth.getBalance(wallet)
}
