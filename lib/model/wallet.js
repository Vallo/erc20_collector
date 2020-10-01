// @flow
export type Address = string
export type Wallet = {|
  address: Address,
  privateKey: string,
|}
export type Payload = {
  amount?: string,
  data?: string,
}
