import { isNode } from 'browser-or-node'
import { ORBITDB } from '../lib/orbitdb'

export default ({ app }, inject) => {
  if (!isNode) {
    app.db = new ORBITDB(app)
    app.db.create()
    inject('db', app.db)
    app.logger.info('orbitDb Plugin loaded')
  }
}
