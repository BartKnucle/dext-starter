import { isNode } from 'browser-or-node'
import Vue from 'vue'
export const state = () => ({
  loaded: false,
  nodes: []
})

export const getters = {
  nodes: state => {
    return state.nodes
  },
  users: state => {
    let nodes = state.nodes.filter(node => node.type === 'user')
    if (nodes) {
      return nodes
    }
  },
  nameByID: state => id => {
    let node = state.nodes.find(node => node.id === id)
    if (node) {
      return node.name
    }
  },
  onlineByID: state => id => {
    let node = state.nodes.find(node => node.id === id)
    if (node) {
      return node.online
    }
  }
}

export const actions = {
  async openDb({ state, commit }) {
    if (!isNode) {
      //If store has not been filled
      if (!state.loaded) {
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
  }
}

export const mutations = {
  setSwarm(state, db) {
    Vue.set(state, 'nodes', db.database.get(''))
    state.loaded = true
  }
}
