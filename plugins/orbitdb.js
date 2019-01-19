import { ORBITDB } from '../lib/orbitdb'

export default ({ app }) => {
  app.db = new ORBITDB(app)
  app.db.create()
  app.logger.info('orbitDb Plugin loaded')
}
