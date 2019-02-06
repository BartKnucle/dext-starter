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
              {{ getTypeIcon(item.data.find(obj => obj.id == 'plateform.type') ? item.data.find(obj => obj.id == 'plateform.type').data : 'Unknown') }}
            </v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <nuxt-link :to="'/node/' + item.id">{{ item.id }}</nuxt-link>
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

    this.$swarm.db.events.on('replicated', address => {
      this.swarmDb = this.$swarm.get('')
    })
  },
  methods: {
    getTypeIcon(type) {
      switch (type) {
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
        return 'red'
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
