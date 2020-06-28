
const MongoClient = require('mongodb').MongoClient

export async function getDb () {
  const url = process.env.MONGO_DB_URL
  const dbName = process.env.MONGO_DB_NAME
  if (!url || !dbName) {
    throw new Error('Missing Mongodb Config')
  }
  const client = await MongoClient.connect(url)
  return client.db(dbName)
}
