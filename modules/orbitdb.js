import { ORBITDB } from '../lib/orbitdb'

module.exports = function orbitdb() {
  this.db = new ORBITDB(this)
  this.db.create()
  this.logger.info('Module ORBITDB loaded')
}
