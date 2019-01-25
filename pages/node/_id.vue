<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-icon
      :size="iconSize"
      color="black">
      {{ getTypeIcon(infos.data.type) }}
    </v-icon>
    Type: {{ infos.data.type }}
    <br>
    Plateform: {{ infos.data.plateform.name }}
    <br>
    Plateform version: {{ infos.data.plateform.version }}
    <br>
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
import { NODE } from '../../lib/node.js'
export default {
  data: () => {
    return {
      node: {},
      infos: {
        _id: '',
        data: {
          type: '', //Node type Browser or Computer
          plateform: {
            //Plateform that run the node or execute the browser (Windows, Linux etc...)
            name: '', //Name of the plateform
            version: '', //Version of the plateform
            userAgent: '' //userAgent string (only for the browsers)
          }
        }
      },
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
    let node = this.node.all()
    console.log(node[0]._id)
    this.infos = node.find(item => item._id === 'infos')
    this.user = node.find(item => item._id === 'user')

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
  },
  methods: {
    getTypeIcon(type) {
      switch (type) {
        case 'browser':
          return 'web'
        case 'computer':
          return 'desktop_windows'
      }
    }
  }
}
</script>
