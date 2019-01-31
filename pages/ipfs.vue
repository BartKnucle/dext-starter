<template>
  <v-layout>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Swarm connections</v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn 
            @click="connectDialog = true">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        {{ swarmPeers }}
      </v-card-text>
    </v-card>
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
      swarmPeers: []
    }
  },
  mounted: async function() {
    this.swarmPeers = this.$app.ipfs.getSwarmPeers()
  }
}
</script>
