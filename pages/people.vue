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
        <v-subheader>People</v-subheader>
        <v-list-tile
          v-for="item in people"
          :key="item.id">

          <v-list-tile-avatar 
            :color="getValueColor(item.alive)">
            <v-icon
              color="black">
              {{ getTypeIcon(item.type) }}
            </v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            {{ item.lastName }} {{ item.firstName }}
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
      people: [
        { id: '5qsdq123', lastName: 'Bob', firstName: 'MORAN', alive: true },
        { id: 'qdsqds', lastName: 'Roger', firstName: 'ZACHANO', alive: false },
        { id: 'qsd', lastName: 'Chris', firstName: 'VEGAS', alive: false },
        { id: 'qsdqsd', lastName: 'Lara', firstName: 'CROFT', alive: false },
        { id: 'qsddsfdf', lastName: 'Cec', firstName: 'DEFREN', alive: true },
        { id: 'qsdqsd', lastName: 'Sarah', firstName: 'BABE', alive: true },
        { id: 'sdfd', lastName: 'Luke', firstName: 'SKYWALK', alive: true },
        { id: 'dfgdfg', lastName: 'Jason', firstName: 'PETER', alive: false },
        { id: 'zerze', lastName: 'Steven', firstName: 'SEAG', alive: true }
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
