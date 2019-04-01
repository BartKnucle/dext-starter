import { isNode } from 'browser-or-node'
export const state = () => ({
  started: false,
  myId: '',
  name: ''
})

export const getters = {
  myId: state => {
    return state.myId
  }
}

export const actions = {
  openDb({ dispatch }) {
    if (!isNode) {
      var db = this.$node.db
      dispatch('updateNode', db)
      //Subscribe to the changes
      db.events.subscribe(() => {
        //update the data
        dispatch('updateNode', db)
      })
    }
  },
  loaded({ commit }) {
    commit('setStarted', true)
  },
  updateNode({ commit }, db) {
    commit('setName', db.database.get('name'))
  }
}

export const mutations = {
  setStarted(state, status) {
    state.started = status
  },
  setName(state, payload) {
    state.name = payload
  }
}
