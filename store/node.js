import { isNode } from 'browser-or-node'
export const state = () => ({
  started: false,
  myId: '',
  name: '',
  type: '',
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
      dispatch('started')
      //Subscribe to the changes
      db.events.subscribe(() => {
        //update the data
        dispatch('updateNode', db)
      })
    }
  },
  started({ commit }) {
    commit('setStarted', true)
  },
  updateNode({ commit }, db) {
    var name = db.database.get('name')
    if (name !== 'Anonymous') {
      commit('setNameSetup', false)
      commit('setName', name)
    } else {
      commit('setNameSetup', true)
    }
    var type = db.database.get('type')
    commit('setType', type)
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
  },
  setType(state, payload) {
    state.type = payload
  }
}
