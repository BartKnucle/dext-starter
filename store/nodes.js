import { isNode } from 'browser-or-node'
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
  firstName: state => id => {
    let node = state.find(node => node.id === id)
    if (node.firstName) {
      return node.firstName
    } else {
      return ''
    }
  },
  lastName: state => id => {
    let node = state.find(node => node.id === id)
    if (node.lastName) {
      return node.lastName
    } else {
      return ''
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
  async openDb({ state, commit, dispatch }, NodeId) {
    if (!isNode) {
      //Check it the node exist in the store
      var node = state.find(node => node.id === NodeId)
      if (!node) {
        //Fill the store with empty data
        commit('setNode', NodeId)
        //Get the node database ID from the swarm
        var dbId = this.$node.swarm.get(NodeId).dbId
        //Get the node database
        var db = await this.$node.getDb(dbId)
        dispatch('updateNode', db)
        //Subscribe to the changes
        db.events.subscribe(() => {
          //update the data
          dispatch('updateNode', db)
        })
      }
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
        databases: []
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
  }
}
