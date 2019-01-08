'use strict'

const AccessController = require('./access-controller')
const { DAGNode } = require('ipld-dag-pb')


class IPFSAccessController extends AccessController {
  constructor (ipfs) {
    super()
    this._ipfs = ipfs
  }

  async load (address) {
    // Transform '/ipfs/QmPFtHi3cmfZerxtH9ySLdzpg1yFhocYDZgEZywdUXHxFU'
    // to 'QmPFtHi3cmfZerxtH9ySLdzpg1yFhocYDZgEZywdUXHxFU'
    address = address.toString().replace(/\\/g, '/');
    if (address.indexOf('/ipfs') === 0)
      address = address.split('/')[2]

    try {
      const dag = await this._ipfs.get(address)
      const obj = JSON.parse(dag[0].content.toString())
      this._access = obj
    } catch (e) {
      console.log("ACCESS ERROR:", e)
    }
  }

  async save (onlyHash) {
    let hash
    try {
      const access = JSON.stringify(this._access, null, 2)
      let dag
      if (onlyHash) {
        dag = await new Promise(resolve => {
          DAGNode.create(Buffer.from(access), (err, n) => {
            if (err) {
              throw err
            }
            resolve(n)
          })
        })
      } else {
        dag = await this._ipfs.add(new Buffer(access))
      }
      hash = dag[0].hash
    } catch (e) {
      console.log("ACCESS ERROR:", e)
    }
    return hash
  }
}

module.exports = IPFSAccessController
