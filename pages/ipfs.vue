<template>
  <v-layout>
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
          label="Remote address"
          required
        />
        <v-card-actions>
          <v-btn
            @click="connectDialog = false">
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
    this.swarmPeers = this.$app.ipfs.getSwarmPeers()
  }
}
</script>
