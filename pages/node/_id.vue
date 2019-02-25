<template>
  <v-layout
    column
    justify-center
    align-center>
    ID: {{ $store.getters['nodes/id'](id) }}
    <br>
    TYPE:
    <br>
    ONLINE:
    <br>
    - DATABASES:
    <v-data-table
      :items="$store.getters['nodes/databasesByID'](id)">
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item }} </td>
      </template>
    </v-data-table>
    - PEERS:
    <v-data-table
      :items="$store.getters['nodes/peersByID'](id)">
      <template 
        slot="items"
        slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td> {{ props.item.addrs }} </td>
      </template>
    </v-data-table>
    - MODULES:
    <v-data-table
      :items="$store.getters['nodes/modulesByID'](id)">
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item.name }} </td>
        <td> {{ props.item.started }} </td>
      </template>
    </v-data-table>
  </v-layout>
</template>
<script>
import { NODE } from '~/lib/node.js'
export default {
  data: () => {
    return {
      id: '',
      peers: []
    }
  },
  watch: {
    data() {
      console.log(this.data)
    }
  },
  mounted: async function() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    } else {
      this.id = this.$node.db.database.address.root
    }

    this.$store.dispatch('nodes/getNode', this.id)
  }
}
</script>
