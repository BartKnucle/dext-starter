<template>
  <v-layout>
    <v-data-table
      :items="$store.state.swarm.nodes"
      :headers="[{ text: 'ID', value: 'id' }]">>
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item.id }} </td>
        <td v-if="props.item.updated"> {{ new Date(props.item.updated).toString() }} </td>
      </template>
    </v-data-table>
  </v-layout>
  <!-- 
   <v-data-table
    :items="swarmDb"
    :headers="headers"
  >
    <template 
      slot="items" 
      slot-scope="props">
      <td>
        <v-list-tile-avatar 
          :color="getValueColor(props.item.data.alive)">
          <v-icon
            color="black">
            {{ getTypeIcon(props.item.data.type) }}
          </v-icon>
        </v-list-tile-avatar>
      </td>
      <td><nuxt-link :to="'/node/' + props.item.id">{{ props.item.data.name }}</nuxt-link></td>
      <td>{{ props.item.id }}</td>
    </template>
  </v-data-table> -->
</template>
<script>
import { perc2color } from '~/utils/color.js'
export default {
  created: function() {
    this.$store.dispatch('swarm/getSwarm')
  }
  /*
  data: () => {
    return {
      swarmDb: [],
      headers: [
        {
          text: 'Type',
          value: 'data.type'
        },
        { text: 'Name', value: 'data.name' },
        { text: 'Ipfs ID', value: 'id' }
      ]
    }
  },
  created: function() {
    //Load database informations
    this.swarmDb = this.$swarm.get('')

    this.$swarm.db.events.on('replicated', address => {
      this.swarmDb = this.$swarm.get('')
    })

    this.$swarm.db.events.on('write', address => {
      this.swarmDb = this.$swarm.get('')
    })
  },
  methods: {
    getTypeIcon(value) {
      switch (value) {
        case 'user':
          return 'perm_identity'
        case 'computer':
          return 'desktop_windows'
      }
    },
    getValueColor(alive) {
      if (alive) {
        return 'green'
      } else {
        return 'error'
      }
    },
    getName(item) {
      if (this.getValue(item, 'type') === 'computer') {
        return this.getValue(item, 'name')
      } else {
        let name = this.getValue(item, 'name')
        if (!name) {
          return item.id
        } else {
          return name
        }
      }
    },
    getValue(item, value) {
      console.log(item)
      //return item.data.find(obj => obj.id == value).data
    }
  } */
}
</script>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
