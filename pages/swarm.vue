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
          :key="item._id">
          <v-list-tile-avatar 
            :color="getValueColor(item.properties.alive)">
            <v-icon
              color="black">
              {{ getTypeIcon(item.properties.type) }}
            </v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <nuxt-link :to="'/node/' + item._id">{{ item._id }}</nuxt-link>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>
<script>
import { perc2color } from '../lib/color.js'
import { NODE } from '../lib/node.js'
export default {
  data: () => {
    return {
      nodes: [],
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
  mounted: async function() {
    this.db = this.$db //rename to fit the class
    this.logger = this.$logger //rename to fit the class

    //Load swarm db
    var nodes = this.$swarm.db.query(doc => doc)

    //Load each node db
    nodes.forEach(async element => {
      let node = new NODE(this, element._id.id)
      await node.loadDb()

      let tmpNode = {
        _id: element._id.id,
        properties: await this.node.getDb()
      }

      this.nodes.push(tmpNode)

      this.node.closeDb()
    })
  },
  methods: {
    getTypeIcon(type) {
      switch (type) {
        case 'user':
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
