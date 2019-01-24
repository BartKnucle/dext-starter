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
        <v-subheader>Ipfs connections</v-subheader>
        <v-list-tile
          v-for="item in hardware"
          :key="item.id">

          <v-list-tile-avatar 
            :color="getValueColor(item.alive)">
            <v-icon
              color="black">
              {{ getTypeIcon(item.type) }}
            </v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            {{ item.name }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>
<script>
import { perc2color } from '../utils/color.js'
export default {
  data: () => {
    return {
      hardware: [
        { id: '5qsdq123', name: 'PORT0212', alive: true },
        { id: 'qdsqds', name: 'PC12515', alive: false },
        { id: 'qsd', name: 'LP4561', alive: false },
        { id: 'qsdqsd', name: 'PORT02452', alive: false },
        { id: 'qsddsfdf', name: 'PC12515', alive: true },
        { id: 'qsdqsd', name: 'LP445451', alive: true },
        { id: 'sdfd', name: 'PORT15412', alive: true },
        { id: 'dfgdfg', name: 'PC15646', alive: false },
        { id: 'zerze', name: 'LP1515', alive: true }
      ]
    }
  },
  methods: {
    getTypeIcon(type) {
      switch (type) {
        case 'laptop':
          return 'laptop'
        case 'desktop':
          return 'desktop_windows'
        case 'printer':
          return 'print'
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
