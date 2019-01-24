import { MESSAGE } from '../lib/message'

export default async ({ store, app }, inject) => {
  app.msg = new MESSAGE(app)
  app.logger.info('Message Plugin loaded')
}
