import { existsSync } from 'fs'
import dotenv from 'dotenv'
const stage = process.argv[2]
if(!stage) {
  throw new Error('Missing stage.')
}
const path = `${process.cwd()}/config.${stage}.env`
if(!existsSync(path)){
  const error = `Missing config on ${path}`
  console.log({error})
  process.exit(1)
}
dotenv.config({ silent: true, path })