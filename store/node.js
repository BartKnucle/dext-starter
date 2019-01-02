export const state = () => ({
  nodeModules: []
})

export const mutations = {
  setNodeModules(state, nodeModules) {
    state.nodeModules = nodeModules
  }
}
