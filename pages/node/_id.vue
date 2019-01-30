<template>
  <v-layout
    column
    justify-center
    align-center>
    <appNode
      :infos="infos"
    />
    <ul 
      v-for="item in swarmPeers"
      :key="item.id">
      <li>
        Ipfs id: {{ item.id }}
      </li>
      <li>
        Address: {{ item.addrs }}
      </li>
    </ul>
  </v-layout>
</template>
<script>
import { default as appNode } from '~/components/organisms/appNode.vue'
import { NODE } from '~/lib/node.js'
export default {
  components: {
    appNode: appNode
  },
  data: () => {
    return {
      node: {},
      infos: [],
      user: {},
      swarmPeers: []
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
    this.node = new NODE(this.$app, this.$route.params.id)
    await this.node.init()
    this.infos = this.node.get('infos')
    console.log(this.infos)
    this.user = this.node.get('user')

    //Get local node peers
    if (!this.$route.params.id) {
      this.$app.db.ipfs.swarm.peers(
        function(err, peerInfos) {
          if (err) {
            this.$app.logger.error(err)
          }
          const PeerId = require('peer-id')
          const multiaddr = require('multiaddr')
          peerInfos.forEach(element => {
            this.swarmPeers.push({
              id: new PeerId(element.peer.id).toB58String(),
              addrs: multiaddr(element.addr.buffer).toString()
            })
          })
        }.bind(this)
      )
    }
  }
}
</script>
