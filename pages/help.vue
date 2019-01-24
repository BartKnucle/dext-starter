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
        <v-subheader>Help</v-subheader>
        <v-list-tile
          v-for="item in problems"
          :key="item.id">
          <v-list-tile-content>
            {{ item.title }} {{ item.description }}
          </v-list-tile-content>
          <v-list-tile-avatar 
            :color="getValueColor(item.alive)">
            <v-icon
              color="black">
              {{ getTypeIcon(item.type) }}
            </v-icon>
          </v-list-tile-avatar>
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
      problems: [
        {
          id: '5qsdq123',
          title: 'Need new phone',
          userName: 'Bob MORAN',
          description:
            'My phone is broken, it is in the toilets, can you please get me a new one?',
          userAlive: true
        }
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
