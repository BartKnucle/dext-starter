<template>
  <v-layout
    row
    wrap
    justify-center
    align-center>
    <v-flex
      xs12
      sm12
      md12
      lg12
      xl12>
      <v-list subheader>
        <v-subheader>Swarm nodes</v-subheader>
        <v-list-tile
          v-for="item in swarmDb"
          :key="item.id">
          <v-list-tile-avatar 
            :color="getValueColor(item.alive)">
            <v-icon
              color="black">
              {{ getTypeIcon(item, 'plateform.type') }}
            </v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <nuxt-link :to="'/node/' + item.id">{{ getName(item) }}</nuxt-link>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>
<script>
import { perc2color } from '~/utils/color.js'
import { SWARM } from '~/lib/swarm.js'
export default {
  data: () => {
    return {
      swarmDb: []
    }
  },
  mounted: async function() {
    //Load database informations
    this.swarmDb = this.$swarm.get('')

    this.$swarm.db.events.on('write', address => {
      this.swarmDb = this.$swarm.get('')
    })

    this.$swarm.db.events.on('replicated', address => {
      this.swarmDb = this.$swarm.get('')
    })
  },
  methods: {
    getTypeIcon(item, value) {
      switch (this.getValue(item, value)) {
        case 'user':
          return 'perm_identity'
        case 'computer':
          return 'desktop_windows'
      }
    },
    getName(item) {
      let name = this.getValue(item, 'user.fullname')
      if (name === 'Unknown') {
        return item.id
      } else {
        return name
      }
    },
    getValueColor(alive) {
      if (alive) {
        return 'green'
      } else {
        return 'red'
      }
    },
    getValue(item, value) {
      return item.data.find(obj => obj.id == value)
        ? item.data.find(obj => obj.id == value).data
        : 'Unknown'
    }
  }
}
</script>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
