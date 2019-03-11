import DocumentStore from 'orbit-db-docstore'

export default class example extends DocumentStore {
  constructor(ipfs, id, dbname, options) {
    super(ipfs, id, dbname, options)
    this._type = messages.type
  }

  static get type() {
    return 'example'
  }
}
