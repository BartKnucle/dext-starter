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
      LOGS
      <ul>
        <li>{{ logs }}</li>
      </ul>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data: function() {
    return {
      dbDatabasesList: [],
      logs: []
    }
  },
  mounted: async function() {
    //Get peers list
    var addrs = await this.$getNodeSwarmAddrs()
    this.$store.commit('node/setSwarmPeers', addrs)
    //get node database list
    var dbNodeDatabases = await this.$orbitdb.open(
      this.$store.state.node.dbListId,
      {
        sync: true
      }
    )
    await dbNodeDatabases.load()
    this.dbDatabasesList = dbNodeDatabases.get('')
    //Get logs
    var logsDbInfo = dbNodeDatabases.get('node.logs')[0]
    var dbNodeLogs = await this.$orbitdb.open(
      logsDbInfo.root + '/' + logsDbInfo.path,
      {
        sync: true
      }
    )
    await dbNodeLogs.load()
    this.logs = dbNodeLogs.get('')
  }
}
</SCRIPT>
