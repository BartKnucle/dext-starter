export const state = () => ({
  ipfsId: ''
})

export const mutations = {
  setIpfsId(state, ipfsId) {
    state.ipfsId = ipfsId
  }
}
