const { TOKEN } = require('./model/token')
const { processWallets } = require('./processWallets')

processWallets(TOKEN.USDT)
