export function deployContract ({ web3 }, abi, bytecode) {
  // Data set up
  // let abi = '[{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"update_quantity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get_quantity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'
  // let bytecode = '608060405234801561001057600080fd5b50606460008190555060ca806100276000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806380219655146037578063ed0109a5146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b6068608c565b6040518082815260200191505060405180910390f35b806000540160008190555050565b6000805490509056fea265627a7a7230582002f975dfd70c1b1f649671805826a83fc9b92457fe7dd245527f56b7776d043464736f6c634300050a0032'

  // Contract object and account info
  const deployContract = new web3.eth.Contract(JSON.parse(abi))
  let account = '0x3d9eb4d54a8cc7ac760fc09f40a5a8915f0103dd'

  // Function Parameter
  let payload = {
    data: bytecode
  }

  let parameter = {
    from: account,
    gas: web3.utils.toHex(800000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
  }

  // Function Call
  deployContract.deploy(payload).send(parameter, (err, transactionHash) => {
    if (err) {
      console.log(err)
    }
    console.log('Transaction Hash :', transactionHash)
  }).on('confirmation', () => {}).then(newContractInstance => {
    console.log('Deployed Contract Address : ', newContractInstance.options.address)
  })
}
