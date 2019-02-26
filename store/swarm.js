import Vue from 'vue'
export const state = () => ({
  nodes: []
})

export const actions = {
  async getSwarm({ commit }) {
    //Get the Swarm database
    var db = await this.$node.swarm.db
    //Fill the store with the Swarm database
    commit('setSwarm', db)
    //Subscribe to the changes to the swarm database
    db.events.subscribe(() => {
      //update the data
      commit('setSwarm', db)
    })
  }
}

export const mutations = {
  setSwarm(state, db) {
    Vue.set(state, 'nodes', db.database.get(''))
  }
}
