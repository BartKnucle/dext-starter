import { isNode } from 'browser-or-node'
import { TEST } from '../lib/module'

export default async ({ app }, inject) => {
  if (!isNode) {
    /*app.test = new TEST(app)
    await app.test.init()
    app.test.fill()
    inject('test', app.test)
    app.logger.info('Plugin TEST loaded')*/
  }
}
