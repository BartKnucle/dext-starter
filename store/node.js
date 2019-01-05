export const state = () => ({
  ipfsId: '',
  dbListId: [],
  swarmPeers: []
})

export const mutations = {
  setIpfsId(state, ipfsId) {
    state.ipfsId = ipfsId
  },
  setDbListId(state, dbListId) {
    state.dbListId = dbListId
  },
  setSwarmPeers(state, swarmPeers) {
    state.swarmPeers = swarmPeers
  }
}
