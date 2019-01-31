import { IPFS } from '../lib/ipfs'

export default async ({ app }) => {
  app.ipfs = new IPFS(app)
  await app.ipfs.create()
  await app.ipfs.connect(
    '/ip4/127.0.0.1/tcp/4001/ws/ipfs/QmNbQFKdSAeE2TTRVBT4wu4JiFfhNB8X85mH7thfgoERmk'
  )
  app.logger.info('Ipfs Plugin loaded')
}
