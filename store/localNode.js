export const state = () => ({
  id: ''
})

export const mutations = {
  setIpfsId(state, ipfsId) {
    this.$myInjectedFunction('accessible in mutations')
    state.ipfsId = ipfsId
  }
}

export const actions = {
  setLocalNodeId(nodeId) {
    this.state.id = nodeId
  }
}
