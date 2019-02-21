export const state = () => ({
  id: 'IPFS ID',
  type: 'TYPE OF NODE (COMPUTER, BROWSER)',
  online: 'NODE IS ONLINE OR OFFLINE',
  connections: ['Connection1', 'Connection2'],
  databases: [
    {
      id: 'DB ID',
      open: 'true'
    },
    {
      id: 'DB ID1',
      open: 'false'
    }
  ],
  modules: [
    {
      name: 'module1',
      started: 'true'
    },
    {
      id: 'module2',
      started: 'false'
    }
  ]
})

export const actions = {
  getModules({ commit }) {
    return this.$node.getModules().then(modules => {
      commit(setModules, modules)
    })
  }
}

export const mutations = {
  setModules(state, modules) {
    state.modules = modules
  }
}
