<template>
  <v-layout>
    <v-flex text-xs-left>
      IPFS
      <ul>
        <li>Local ipfs server ID: {{ this.$store.state.server.ipfsId }}</li>
      </ul>
    </v-flex>
  </v-layout>
</template>
<script>
export default {}
</SCRIPT>
