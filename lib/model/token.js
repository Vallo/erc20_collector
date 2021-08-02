// @flow
export const TOKEN = {
  USDT: 'USDT',
  USDC: 'USDC',
  DAI: 'DAI'
}

export type Token = $Values<typeof TOKEN>
