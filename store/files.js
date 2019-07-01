import { isNode } from 'browser-or-node'
import Vue from 'vue'
export const state = () => ({
  files: []
})

export const getters = {
  files: state => {
    return state.files
  }
}

export const actions = {
  async openDb({ state, commit }) {
    if (!isNode) {
      //If store has not been filled
      if (state.files.length === 0) {
        //Get the Swarm database
        var db = await this.$node.files.db
        //Fill the store with the Swarm database
        commit('setFiles', db)
        //Subscribe to the changes to the swarm database
        db.events.subscribe(() => {
          //update the data
          commit('setFiles', db)
        })
      }
    }
  }
}

export const mutations = {
  setFiles(state, db) {
    const files = db.database.get('')
    Vue.set(state, 'files', files)
  }
}
