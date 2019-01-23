<template>
  <v-layout>
    <v-flex text-xs-left>
      SERVER IPFS
      <ul>
        <li>Local host ipfs server ID: {{ this.$store.state.server.ipfsId }}</li>
        <li>
          Swarm peers:
          <ul>
            <li 
              v-for="item in peers"
              :key="item.peer.id">
              {{ item }}
            </li>
          </ul>
        </li>
      </ul>
      SYSTEM
      <ul>
        <li>Type: {{ system.infos.type }}</li>
        <li>Plateform: {{ system.infos.platform }}</li>
      </ul>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      system: {
        infos: {
          platform: ''
        }
      },
      peers: []
    }
  },
  mounted: async function() {
    //Get ipfs swarm peers
    this.$db.ipfs.swarm.peers(
      function(err, peerInfos) {
        if (err) {
          this.app.logger.err(err)
        }
        this.peers = peerInfos
      }.bind(this)
    )

    //Get system information on local or remote node
    var path = ''
    if (this.$route.params.id) {
      path = this.$route.params.id
    } else {
      path = 'nodeDb'
    }
    this.system = await this.$node.getSysInfo(path)
  }
}
</SCRIPT>
