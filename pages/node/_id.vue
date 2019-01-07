<template>
  <v-layout>
    <v-flex text-xs-left>
      SERVER IPFS
      <ul>
        <li>Local ipfs server ID: {{ this.$store.state.server.ipfsId }}</li>
      </ul>
      MY PEERS
      <ul>
        <li 
          v-for="item in peers"
          :key="item.id">
          <ul>
            <li>Node ID: <nuxt-link 
              :to="'/node/' + item.id">
              {{ item.id }}</nuxt-link></li>
            <li>Node Database Path: {{ item.dbPath }}</li>
          </ul>
        </li>
      </ul>
      SYSTEM
      <ul>
        <li>Plateform: {{ system.infos.platform }}</li>
      </ul>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      peers: [],
      system: {
        infos: {
          platform: ''
        }
      },
      db: {},
      dbPath: 'node.db'
    }
  },
  mounted: async function() {
    this.peers = this.$node.peers

    if (this.$route.params.id) {
      let foundIndex = this.peers.findIndex(
        element => element.id === this.$route.params.id
      )
      if (foundIndex !== -1) {
        this.dbPath = this.peers[foundIndex].dbPath
      }
    }
    if (!this.$node.orbitdb) {
      this.$node.ipfs.on('ready', async () => {
        this.db = await this.$node.orbitdb.docs(this.dbPath, { sync: true })
        await this.db.load()
        let tmpSystem = await this.db.get('system')
        this.system = tmpSystem[0]
      })
    } else {
      console.log(this.dbPath)
      this.db = await this.$node.orbitdb.docs(this.dbPath, { sync: true })
      await this.db.load()
      let tmpSystem = await this.db.get('system')
      this.system = tmpSystem[0]
    }
  }
}
</SCRIPT>
