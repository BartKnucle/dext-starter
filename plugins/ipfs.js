import { IPFS } from '../lib/ipfs'

export default async ({ app }) => {
  app.ipfs = new IPFS(app)
  await app.ipfs.create()
  await app.ipfs.connect(
    '/ip4/172.18.59.33/tcp/4001/ws/ipfs/QmWFskF7kBAmnCfkkSobH126V5xdUg39APLVfshkuGJXQw'
  )
  app.logger.info('Ipfs Plugin loaded')
}
