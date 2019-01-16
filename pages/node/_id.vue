<template>
  <v-layout>
    <v-flex text-xs-left>
      SERVER IPFS
      <ul>
        <li>Local ipfs server ID: {{ this.$store.state.server.ipfsId }}</li>
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
      }
    }
  },
  mounted: async function() {
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
