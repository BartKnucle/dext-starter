import { ORBITDB } from '../lib/orbitdb'

export default ({ app }) => {
  app.orbitdb = new ORBITDB(app)
  app.orbitdb.create()
  app.logger.info('orbitDb Plugin loaded')
}
