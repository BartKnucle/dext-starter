<template>
  <v-layout>
    <v-flex text-xs-left>
      IPFS
      <ul>
        <li>Node ipfs ID: {{ this.$store.state.node.ipfsId }}</li>
        <li>Node ipfs swarm peers: {{ this.$store.state.node.swarmPeers }}</li>
      </ul>
      ORBITDB
      <ul>
        <li>Node database list ID: {{ this.$store.state.node.dbListId }}</li>
        <li>Node database list {{ dbDatabasesList }}</li>
      </ul>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data: function() {
    return {
      dbDatabasesList: []
    }
  },
  mounted: async function() {
    var addrs = await this.$getNodeSwarmAddrs()
    this.$store.commit('node/setSwarmPeers', addrs)
    var dbNodeDatabases = await this.$orbitdb.open(
      this.$store.state.node.dbListId,
      {
        sync: true
      }
    )
    await dbNodeDatabases.load()
    this.dbDatabasesList = dbNodeDatabases.get('')
  }
}
</SCRIPT>
