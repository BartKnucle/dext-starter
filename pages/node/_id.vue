<template>
  <v-layout
    column
    justify-center
    align-center>
    <appNodeInfos
      :nodedb="nodeDb"
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
import { default as appNodeInfos } from '~/components/organisms/appNodeInfos.vue'
import { NODE } from '~/lib/node.js'
export default {
  components: {
    appNodeInfos: appNodeInfos
  },
  data: () => {
    return {
      //node: {},
      nodeDb: [],
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
    window.LOG = 'Verbose'
    //If we get the local node
    if (!this.$route.params.id) {
      this.node = this.$node
    } else {
      //Load the remote db
      this.node = new NODE(this.$app, this.$route.params.id)
      await this.node.init()
    }

    //Load database informations
    this.nodeDb = this.node.get('')
    /*
    this.node.db.events.on('replicated', address => {
      this.nodeDb = this.node.get('')
    })

    this.node.db.events.on('write', address => {
      this.nodeDb = this.node.get('')
    })*/
  }
}
</script>
