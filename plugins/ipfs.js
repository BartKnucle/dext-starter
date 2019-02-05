import { IPFS } from '../lib/ipfs'

export default async ({ app }) => {
  app.ipfs = new IPFS(app)
  await app.ipfs.create()
  await app.ipfs.connect(
    '/ip4/172.18.59.33/tcp/4001/ws/ipfs/QmPn9kjDSRzHP363z3Ljn1p5g923vSE5h6VWQYgD23TdWx'
  )
  app.logger.info('Ipfs Plugin loaded')
}
