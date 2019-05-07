<template>
  <v-container
    fluid
    grid-list-md>
    <v-data-iterator
      :items="$store.getters['nodes/peersByID'](id)"
      content-tag="v-layout"
      hide-actions
      row
      wrap>
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg4>
        <v-card :color="networkServerColor(extractConnection(props.item.addrs)[5])">
          <v-card-title>
            <v-chip>
              {{ $store.getters['swarm/nameByID'](props.item.id) }}
            </v-chip>
            <v-spacer/>
            <v-chip
              v-show="!$vuetify.breakpoint.xs">
              <v-avatar>
                <v-icon>swap_horiz</v-icon>
              </v-avatar>
              {{ extractConnection(props.item.addrs)[2] }}:{{ extractConnection(props.item.addrs)[4] }}
            </v-chip>
            <v-chip
              v-show="!$vuetify.breakpoint.xs">
              <v-avatar>
                <v-icon>swap_horiz</v-icon>
              </v-avatar>
              {{ extractConnection(props.item.addrs)[5] }}
            </v-chip>
            <v-card-actions>
              <v-btn 
                icon>
                <v-icon color="red">location_off</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-data-iterator>
    <v-btn
      fab
      fixed
      bottom
      right
      color="indigo"
      @click="connect">
      <v-icon>share</v-icon>
    </v-btn>
  </v-container>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {}
  },
  methods: {
    networkServerColor(server) {
      switch (server) {
        case 'ipfs':
          return 'primary'
          break
        case 'ws':
          return 'secondary'
          break
        default:
          break
      }
    },
    extractConnection(connectionString) {
      return connectionString.split('/')
    },
    connect() {
      this.$node.execute('ipfs', 'connect', '', this.id)
    }
  }
}
</script>
