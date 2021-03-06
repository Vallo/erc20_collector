// const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
// const MongoClient = require('mongodb').MongoClient

import { Web3 } from 'web3'
import { getUsdtBalance } from '../lib/usdt/balance'

// const mongod = new MongoMemoryServer()
describe('Tests', function () {
  let db
  beforeEach(async () => {
    /*  const url = await mongod.getUri()
    const dbName = await mongod.getDbName()
    const client = await MongoClient.connect(url)
    db = client.db(dbName) */
  })
  /*
  it('Creates 100 wallets and inserts them on db.', async function () {
    const wallets = createWallets(3)
    for (let i = 0; i < wallets.length; i++) {
      insertWallet({ db }, wallets[i])
    }
    const dbWallets = await db.collection('wallets').find().toArray()
    expect(dbWallets.length).to.equal(3)
  })
  it('asas', async function () {
    const serverInstance = server({ seed: 'vallo', logger: console })
    serverInstance.listen(8545, async function (err, blockchain) {
      if (err) {
        console.log(err)
      }
      console.log(blockchain.unlocked_accounts['0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd'].privateKey.toString('hex'))
      console.log(blockchain.unlocked_accounts['0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd'].address.toString('hex'))

      const web3 = new Web3('http://localhost:8545')
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)

      const oldBalance = await web3.eth.getBalance('0xc5Ec03b3CA0635AFD39706ceC37177206Ab15289')
      console.log({ oldBalance })
      let balance = await web3.eth.getBalance('0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd')
      console.log({ balance })
      await sendEth(1, blockchain.unlocked_accounts['0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd'].privateKey)
      balance = await web3.eth.getBalance('0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd')
      console.log({ balance })
      await sendEth(1, blockchain.unlocked_accounts['0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd'].privateKey)
      balance = await web3.eth.getBalance('0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd')
      console.log({ balance })
      const newBalance = await web3.eth.getBalance('0xc5Ec03b3CA0635AFD39706ceC37177206Ab15289')
      console.log({ newBalance })
    })
  })
  it('load usdt on ganache', function () {
    const serverInstance = server({ seed: 'vallo', logger: console })
    serverInstance.listen(8545, async function (err, blockchain) {
      if (err) {
        console.log(err)
      }
      const web3 = new Web3('http://localhost:8545')
      const abi = readFileSync('./bin/test/contracts/usdt/SafeMath.abi').toString()
      const bytecode = readFileSync('./bin/test/contracts/usdt/SafeMath.bin').toString('hex')
      console.log({ bytecode })
      console.log({ abi })
      deployContract({ web3 }, abi, bytecode)
    })
  }) */
  it.only('tete', async function () {
    const from = { address: '0xc5Ec03b3CA0635AFD39706ceC37177206Ab15289', privateKey: '495946f877a81574a224d9d8c0072d4f5293c6fe67f79f89d00a03ee7f6ef2da' }
    const to = '0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd'
    const web3 = new Web3('https://ropsten.infura.io/v3/05b14d852f9949a9b4265ad97b8d0b12')
    // await sendUsdt({ web3 }, 1)
    const balance = await getUsdtBalance({ web3 }, to)
    console.log({ balance })
  })/*
  it('getBalance', async function () {
    const web3 = new Web3('https://ropsten.infura.io/v3/05b14d852f9949a9b4265ad97b8d0b12')
    const wallet = { address: '0xc060c309409576f80c3bC80F7579008886E15695', privateKey: '8662c47ca6b47d5ceff5b88aa6d259e1c143e088930e84667f5b93fac527eff8' }
    await getBalance({ web3 }, wallet)
  })
  it('send Balance', async function () {
    const web3 = new Web3('https://ropsten.infura.io/v3/05b14d852f9949a9b4265ad97b8d0b12')
    const from = { address: '0xc060c309409576f80c3bC80F7579008886E15695', privateKey: '8662c47ca6b47d5ceff5b88aa6d259e1c143e088930e84667f5b93fac527eff8' }
    const to = '0xc5Ec03b3CA0635AFD39706ceC37177206Ab15289'
    await sendBalance({ web3 }, { from, to })
  }) */
})
