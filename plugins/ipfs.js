import { IPFS } from '../lib/ipfs'

export default async ({ app }) => {
  app.ipfs = new IPFS(app)
  await app.ipfs.create()
  /*await app.ipfs.connect(
    '/ip4/127.0.0.1/tcp/4001/ws/ipfs/Qmepwjmw4UVBHvGdULcw1UaEkGqvS4FUvvh5WkfaHFKr6a'
  )*/
  app.logger.info('Ipfs Plugin loaded')
}
