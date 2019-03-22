import Vue from 'vue'
export const state = () => ({
  messages: []
})

export const getters = {
  messages: state => {
    return state.messages
  }
}

export const actions = {
  async getMessages({ state, commit }) {
    //If store has not been filled
    if (state.messages.length === 0) {
      //Get the Swarm database
      var db = await this.$node.messages.db
      //Fill the store with the Swarm database
      commit('setMessages', db)
      //Subscribe to the changes to the swarm database
      db.events.subscribe(() => {
        //update the data
        commit('setMessages', db)
      })
    }
  }
}

export const mutations = {
  setMessages(state, db) {
    const messages = db.database
      .iterator({ limit: -1 })
      .collect()
      .map(e => e.payload.value)
    Vue.set(state, 'messages', messages)
  }
}
