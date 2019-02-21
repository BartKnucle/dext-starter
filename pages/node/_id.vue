<template>
  <v-layout
    column
    justify-center
    align-center>
    ID: {{ $store.state.node.id }}
    <br>
    TYPE: {{ $store.state.node.type }}
    <br>
    ONLINE: {{ $store.state.node.online }}
    <br>
    - IPFS CONNECTIONS:
    <ul>
      <li
        v-for="connection in $store.state.node.connections"
        :key="connection">
        {{ connection }}
      </li>
    </ul>
    - DATABASES:
    <ul>
      <li
        v-for="database in $store.state.node.databases"
        :key="database.id">
        DB ID: {{ database.id }}
        <br>
        DB OPEN: {{ database.open }}
      </li>
    </ul>
    - PEERS:
    <v-data-table
      :items="peers">
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item.id }} </td>
        <td> {{ props.item.addrs }} </td>
      </template>
    </v-data-table>
    - MODULES:
    <v-data-table
      :items="modules">
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item.name }} </td>
        <td> {{ props.item.started }} </td>
      </template>
    </v-data-table>
  </v-layout>
</template>
<script>
import { NODE } from '~/lib/node.js'
export default {
  data: () => {
    return {
      id: '',
      type: '',
      modules: [],
      peers: []
    }
  },
  created: async function() {
    this.db = await this.$node.getDb() //'QmSnervNt2mSsP2VtzRS4oZjskJ6yUMnePjrW1Nytzru2g'

    this.getInfos()

    this.db.events.on('replicated', address => {
      this.getInfos()
    })

    this.db.events.on('write', address => {
      this.getInfos()
    })
  },
  methods: {
    getInfos() {
      this.modules = this.db.get('modules')
      this.peers = this.db.get('peers')
    }
  }
  /*  components: {},
  data: () => {
    return {
      nodeDb: [],
      headers: [{ text: 'Id', value: 'id' }, { text: 'Data', value: 'data' }]
    }
  },
  computed: {
    iconSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '70px'
        case 'sm':
          return '80px'
        case 'md':
          return '90px'
        case 'lg':
          return '100px'
        case 'xl':
          return '100px'
      }
    }
  },
  mounted: async function() {
    //If we get the local node
    if (!this.$route.params.id) {
      this.node = this.$node
    } else {
      //Load the remote db
      this.node = new NODE(this.$app)
      await this.node.init(this.$route.params.id)
    }
    this.nodeDb = this.node.get('')

    this.node.db.events.on('replicated', address => {
      this.nodeDb = this.node.get('')
    })

    this.node.db.events.on('write', address => {
      this.nodeDb = this.node.get('')
    })
  } */
}
</script>
