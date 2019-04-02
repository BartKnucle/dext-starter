import { isNode } from 'browser-or-node'
export const state = () => ({
  started: false,
  myId: '',
  name: '',
  nameSetup: false
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
    var name = db.database.get('name')
    if (name !== 'Anonymous') {
      commit('setNameSetup', false)
      commit('setName', db.database.get('name'))
      console.log(name)
    } else {
      commit('setNameSetup', true)
      console.log(name)
    }
  }
}

export const mutations = {
  setStarted(state, status) {
    state.started = status
  },
  setNameSetup(state, payload) {
    state.nameSetup = payload
  },
  setName(state, payload) {
    state.name = payload
  }
}
