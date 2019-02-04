import { IPFS } from '../lib/ipfs'

export default async ({ app }) => {
  app.ipfs = new IPFS(app)
  await app.ipfs.create()
  await app.ipfs.connect(
    '/ip4/127.0.0.1/tcp/4001/ws/ipfs/QmPGDTxpuhSjDeEKmWBexpxtwmMy4FPkwQtDt3GDiaEvpL'
  )
  app.logger.info('Ipfs Plugin loaded')
}
