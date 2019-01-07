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
            <li>Node ID: {{ item.id }}</li>
            <li>Node Database Path: {{ item.dbPath }}</li>
          </ul>
        </li>
      </ul>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      peers: []
    }
  },
  mounted: function() {
    this.peers = this.$node.peers
  }
}
</SCRIPT>
