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
        <v-subheader>Renew hardware</v-subheader>
        <v-list-tile
          v-for="item in hardware"
          :key="item.id">

          <v-list-tile-avatar 
            :color="getValueColor(item.value)">
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
import { perc2color } from '../lib/color.js'
export default {
  data: () => {
    return {
      hardware: [
        { id: '5qsdq123', type: 'laptop', name: 'PORT0212', value: 10 },
        { id: 'qdsqds', type: 'desktop', name: 'PC12515', value: 15 },
        { id: 'qsd', type: 'printer', name: 'LP4561', value: 67 },
        { id: 'qsdqsd', type: 'laptop', name: 'PORT02452', value: 45 },
        { id: 'qsddsfdf', type: 'desktop', name: 'PC12515', value: 32 },
        { id: 'qsdqsd', type: 'printer', name: 'LP445451', value: 98 },
        { id: 'sdfd', type: 'laptop', name: 'PORT15412', value: 51 },
        { id: 'dfgdfg', type: 'desktop', name: 'PC15646', value: 41 },
        { id: 'zerze', type: 'printer', name: 'LP1515', value: 85 }
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
    getValueColor(value) {
      return perc2color(value)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
