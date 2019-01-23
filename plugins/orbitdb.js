import { isNode } from 'browser-or-node'
import { ORBITDB } from '../lib/orbitdb'

export default ({ app }, inject) => {
  app.db = new ORBITDB(app)
  if (!isNode) {
    app.db.create()
  }
  inject('db', app.db)
  app.logger.info('orbitDb Plugin loaded')
}
