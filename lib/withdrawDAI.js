
import _ from './env'
const { TOKEN } = require('./model/token')
const { processWallets } = require('./processWallets')

processWallets(TOKEN.DAI)
