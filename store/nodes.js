export const state = () => []

export const getters = {
  nodeByID: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node
    }
  },
  id: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.id
    }
  },
  ipfsId: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.ipfsId
    }
  },
  messagesDbId: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.messagesDbId
    }
  },
  databasesByID: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.databases
    }
  },
  modulesByID: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.modules
    }
  },
  peersByID: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.peers
    }
  },
  messagesByID: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.messages
    }
  }
}

export const actions = {
  async getNode({ state, commit, dispatch }, id) {
    //Check it the node exist in the store
    var node = state.find(node => node.id === id)
    if (!node) {
      //Get the node database
      var db = await this.$node.getDb(id)
      //Fill the store with the node database
      commit('setNode', db)
      //Subscribe to the changes
      db.events.subscribe(() => {
        //update the data
        dispatch('updateNode', db)
      })
      //Fill the data
      dispatch('updateNode', db)
    }
  },
  updateNode({ commit }, db) {
    commit('setIpfsId', { id: db.id, ipfsId: db.database.get('ipfsId') })
    commit('setMessagesDbId', {
      id: db.id,
      messagesDbId: db.database.get('messagesDbId')
    })
    commit('setModules', { id: db.id, modules: db.database.get('modules') })
    commit('setPeers', { id: db.id, peers: db.database.get('peers') })
    commit('setDatabases', {
      id: db.id,
      databases: db.database.get('databases')
    })
    commit('setMessages', {
      id: db.id,
      messages: db.database.get('messages')
    })
  },
  async switchModule({}, payload) {
    this.$node.switchModule(payload.id, payload.name, payload.value)
  }
}

export const mutations = {
  //Set the initial node state
  setNode(state, db) {
    let node = state.find(node => node.id === db.id)
    if (!node) {
      state.push({
        id: db.id,
        ipfsId: '',
        messagesDbId: '',
        peers: [],
        modules: [],
        databases: [],
        messages: []
      })
    }
  },
  setIpfsId(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.ipfsId = payload.ipfsId
  },
  setMessagesDbId(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.messagesDbId = payload.messagesDbId
  },
  setModules(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.modules = payload.modules
  },
  setPeers(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.peers = payload.peers
  },
  setDatabases(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.databases = payload.databases
  },
  setMessages(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.messages = payload.messages
  }
}
