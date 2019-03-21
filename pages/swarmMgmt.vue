<template>
  <v-container>
    <v-tabs
      active-class="black"
      color="primary"
      grow>
      <v-tab>
        All
      </v-tab>
      <v-tab-item>
        <v-container
          fluid
          grid-list-md>
          <v-data-iterator
            :items="$store.getters['swarmMgmt/nodes']"
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
              lg3>
              <v-card>
                <v-card-title>
                  <v-icon
                    :color="nodeTypeColor(props.item.type)"
                    large>
                    {{ nodeTypeIcon(props.item.type) }}
                  </v-icon>
                  <h4>{{ props.item.name }}</h4>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-tab-item>
      <v-tab>
        Computer
      </v-tab>
      <v-tab-item>
        Computers
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import { perc2color } from '~/utils/color.js'
export default {
  created: function() {
    this.$store.dispatch('swarmMgmt/getSwarmMgmt')
  },
  methods: {
    deleteNode(id) {
      this.$node.swarm.delete(id)
    },
    sendMsg(id) {
      this.$node.messages.send(id)
    },
    nodeTypeColor(type) {
      switch (type) {
        case 'computer':
          return 'primary'
          break
        case 'user':
          return 'secondary'
          break
        default:
          break
      }
    },
    nodeTypeIcon(type) {
      switch (type) {
        case 'computer':
          return 'computer'
          break
        case 'user':
          return 'perm_identity'
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
