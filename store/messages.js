import { isNode } from 'browser-or-node'
import Vue from 'vue'
export const state = () => ({
  messages: []
})

export const getters = {
  messages: state => {
    return state.messages
  },
  received: state => {
    return state.messages.filter(msg => msg.message.type === 'in')
  },
  sent: state => {
    return state.messages.filter(msg => msg.message.type === 'out')
  },
  unread: state => {
    return state.messages.filter(msg => msg.message.read === false)
  },
  notification: state => {
    return state.messages.filter(msg => msg.message.notification === true)
  },
  notifCount: state => {
    return state.messages.filter(msg => msg.message.notification === true)
      .length
  }
}

export const actions = {
  async getMessages({ state, commit }) {
    if (!isNode) {
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
}

export const mutations = {
  setMessages(state, db) {
    const messages = db.database.get('')
    Vue.set(state, 'messages', messages)
  }
}
