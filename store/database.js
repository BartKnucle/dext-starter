export const state = () => ({
  userDbPath: '',
  userIpfsId: '',
  nodeDbPath: '',
  nodeIpfsId: ''
})

export const mutations = {
  setUserDbPath(state, userDbPath) {
    state.userDbPath = userDbPath
  },
  setUserIpfsId(state, userIpfsId) {
    state.userIpfsId = userIpfsId
  },
  setNodeDbPath(state, nodeDbPath) {
    state.nodeDbPath = nodeDbPath
  },
  setNodeIpfsId(state, nodeIpfsId) {
    state.nodeIpfsId = nodeIpfsId
  }
}
