import { MESSAGE } from '../lib/message'

export default async ({ app }) => {
  app.msg = new MESSAGE(app)
  app.logger.info('Message Plugin loaded')
}
