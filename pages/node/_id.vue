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
    - DATABASES:
    <v-data-table
      :items="databases">
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item }} </td>
      </template>
    </v-data-table>
    - PEERS:
    <v-data-table
      :items="peers">
      <template 
        slot="items"
        slot-scope="props">
        <td>{{ props.item.id }}</td>
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
      databases: [],
      peers: [],
      modules: []
    }
  },
  watch: {
    data() {
      console.log(this.data)
    }
  },
  mounted: async function() {
    var data = await this.$node.getData() //'QmSnervNt2mSsP2VtzRS4oZjskJ6yUMnePjrW1Nytzru2g' this.$route.params.id
    this.modules = data.modules
    this.peers = data.peers
    this.databases = data.databases
    console.log(this.modules)
  },
  methods: {
    getInfos() {}
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
