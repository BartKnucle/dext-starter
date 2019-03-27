import { isNode } from 'browser-or-node'
import Vue from 'vue'
export const state = () => ({
  permissions: []
})

export const getters = {
  permissions: state => {
    return state.permissions
  }
}

export const actions = {
  async getPermissions({ state, commit }) {
    if (!isNode) {
      //If store has not been filled
      if (state.permissions.length === 0) {
        //Get the Swarm database
        var db = await this.$node.permissions.db
        //Fill the store with the Swarm database
        commit('setPermissions', db)
        //Subscribe to the changes to the swarm database
        db.events.subscribe(() => {
          //update the data
          commit('setPermissions', db)
        })
      }
    }
  }
}

export const mutations = {
  setPermissions(state, db) {
    const permissions = db.database.get('')
    Vue.set(state, 'permissions', permissions)
  }
}
