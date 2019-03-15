export const state = () => []

export const getters = {
  nodeByID: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node
    }
  },
  loaded: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.loaded
    }
  },
  id: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.id
    }
  },
  name: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.name
    }
  },
  dbId: state => id => {
    let node = state.find(node => node.id === id)
    if (node) {
      return node.dbId
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
      //Fill the store with empty data
      commit('setNode', id)
      //Get the node database ID from the swarm
      var dbId = this.$node.swarm.get(id).dbId
      //Get the node database
      var db = await this.$node.getDb(dbId)
      dispatch('updateNode', db)
      //Subscribe to the changes
      db.events.subscribe(() => {
        //update the data
        dispatch('updateNode', db)
      })
    }
  },
  updateNode({ commit }, db) {
    commit('setLoaded', { id: db.database.get('id') })
    commit('setDbId', { id: db.database.get('id'), dbId: db.id })
    commit('setName', {
      id: db.database.get('id'),
      name: db.database.get('name')
    })
    commit('setMessagesDbId', {
      id: db.database.get('id'),
      messagesDbId: db.database.get('messagesDbId')
    })
    commit('setModules', {
      id: db.database.get('id'),
      modules: db.database.get('modules')
    })
    commit('setPeers', {
      id: db.database.get('id'),
      peers: db.database.get('peers')
    })
    commit('setDatabases', {
      id: db.database.get('id'),
      databases: db.database.get('databases')
    })
    commit('setMessages', {
      id: db.database.get('id'),
      messages: db.database.get('messages')
    })
  },
  async switchModule({}, payload) {
    this.$node.switchModule(payload.id, payload.name, payload.value)
  }
}

export const mutations = {
  //Set the initial node state
  setNode(state, id) {
    let node = state.find(node => node.id === id)
    if (!node) {
      state.push({
        id: id,
        loaded: false,
        dbId: '',
        name: '',
        messagesDbId: '',
        peers: [],
        modules: [],
        databases: [],
        messages: []
      })
    }
  },
  setLoaded(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.loaded = true
  },
  setDbId(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.dbId = payload.dbId
  },
  setName(state, payload) {
    var node = state.find(node => node.id === payload.id)
    node.dbId = payload.name
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
