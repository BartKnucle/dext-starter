import Vue from 'vue'
export const state = () => ({
  nodes: []
})

export const getters = {
  nodes: state => {
    return state.nodes
  },
  computers: state => {
    return state.nodes.filter(node => node.type === 'computer')
  },
  users: state => {
    return state.nodes.filter(node => node.type === 'user')
  },
  nameByID: state => id => {
    let node = state.nodes.find(node => node.id === id)
    if (node) {
      return node.name
    }
  }
}

export const actions = {
  async getSwarmMgmt({ state, commit }) {
    //If store has not been filled
    if (state.nodes.length === 0) {
      //Get the Swarm database
      var db = await this.$node.swarmMgmt.db
      //Fill the store with the Swarm database
      commit('setSwarmMgmt', db)
      //Subscribe to the changes to the swarm database
      db.events.subscribe(() => {
        //update the data
        commit('setSwarmMgmt', db)
      })
    }
  }
}

export const mutations = {
  setSwarmMgmt(state, db) {
    Vue.set(state, 'nodes', db.database.get(''))
  }
}
