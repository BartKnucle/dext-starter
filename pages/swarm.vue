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
          v-for="item in nodes"
          :key="item.id">
          <v-list-tile-avatar 
            :color="getValueColor(item.alive)">
            <v-icon
              color="black">
              {{ getTypeIcon(item.type) }}
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
export default {
  data: () => {
    return {
      nodes: [
        { id: '5qsdq123', type: 'computer', name: 'PORT0212', alive: true },
        { id: 'qdsqds', type: 'computer', name: 'PC12515', alive: false },
        { id: 'qsd', type: 'browser', name: 'LP4561', alive: false },
        { id: 'qsdqsd', type: 'browser', name: 'PORT02452', alive: false },
        { id: 'qsddsfdf', type: 'computer', name: 'PC12515', alive: true },
        { id: 'qsdqssd', type: 'browser', name: 'LP445451', alive: true },
        { id: 'sdfd', type: 'computer', name: 'PORT15412', alive: true },
        { id: 'dfgdfg', type: 'browser', name: 'PC15646', alive: false },
        { id: 'zerze', type: 'computer', name: 'LP1515', alive: true }
      ]
    }
  },
  mounted: function() {},
  methods: {
    getTypeIcon(type) {
      switch (type) {
        case 'browser':
          return 'account_box'
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
