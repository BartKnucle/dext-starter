<template>
  <v-layout>
    <v-btn
      @click="connectDialog = !connectDialog">Connect</v-btn>
    <v-data-table
      :items="swarmPeers"
      :headers="headers">
      <template 
        slot="items" 
        slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.addrs }}</td>
      </template>
    </v-data-table>
    <v-dialog
      v-model="connectDialog">
      <v-card>
        <v-card-title>
          Connect to remote ipfs node
        </v-card-title>
        <v-text-field
          v-model="remoteNode"
          label="Remote address"
          required
        />
        <v-card-actions>
          <v-btn
            @click="connect()">
            Connect
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
export default {
  components: {},
  data: () => {
    return {
      connectDialog: false,
      remoteNode: '',
      swarmPeers: [],
      headers: [
        {
          text: 'Id',
          value: 'id'
        },
        { text: 'Addresses', value: 'addrs' }
      ]
    }
  },
  mounted: async function() {
    this.swarmPeers = this.$node.ipfs.getSwarmPeers()
  },
  methods: {
    //Connect to a remote node
    connect() {
      this.$node.ipfs.connect(this.remoteNode)
      this.connectDialog = !this.connectDialog
    }
  }
}
</script>
