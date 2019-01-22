import { TEST } from '../lib/test'

export default async ({ app }, inject) => {
  app.test = new TEST(app)
  await app.test.init()
  app.test.fill()
  inject('test', app.test)
  app.logger.info('Plugin TEST loaded')
}
