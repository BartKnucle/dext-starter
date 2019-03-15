<template>
  <v-container>
    <dataLoader :dialog="!$store.getters['nodes/loaded'](id)"/>
    <v-tabs grow>
      <v-tab>
        Modules
      </v-tab>
      <v-tab-item>
        <v-container
          fluid
          grid-list-md>
          <v-data-iterator
            :items="$store.getters['nodes/modulesByID'](id)"
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
              <v-card :color="moduleTypeColor(props.item.type)">
                <v-card-title>
                  <v-icon
                    :color="moduleStartedColor(props.item.started)"
                    large>
                    {{ moduleTypeIcon(props.item.type) }}
                  </v-icon>
                  <h4>{{ props.item.name }}</h4>
                  <v-spacer/>
                  <v-card-actions>
                    <v-switch
                      :input-value="props.item.started"
                      :disabled="!props.item.isStoppable"
                      light
                      @click.stop="switchModule(props.item.name, !props.item.started)"/>
                  </v-card-actions>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-data-iterator>
        </v-container>
        <v-btn
          color="red"
          fab
          fixed
          bottom
          right>
          <v-icon>add</v-icon>
        </v-btn>
      </v-tab-item>
      <v-tab>
        Network
      </v-tab>
      <v-tab-item>
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
              <v-card :color="networkServerColor(extractConnection(props.item.addrs)[6])">
                <v-card-title>
                  <v-chip>
                    <nuxt-link :to="'/settings/' + props.item.id">{{ $node.swarm.get(props.item.id).name }}</nuxt-link>
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
        </v-container>
        <v-btn
          color="indigo"
          fab
          fixed
          bottom
          right>
          <v-icon>share</v-icon>
        </v-btn>
      </v-tab-item>
      <v-tab>
        Databases
      </v-tab>
      <v-tab-item>
        <v-container
          fluid
          grid-list-md>
          <v-data-iterator
            :items="$store.getters['nodes/databasesByID'](id)"
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
              <v-card>
                <v-card-title>
                  <v-chip>
                    {{ props.item.name }}
                  </v-chip>
                  <v-spacer/>
                  <v-card-actions>
                    <v-switch
                      :input-value="props.item.open"
                      light/>
                  </v-card-actions>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-tab-item>
      <v-tab>
        Security
      </v-tab>
      <v-tab-item>
        Security management
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import dataLoader from '~/components/dataLoader.vue'
export default {
  components: {
    dataLoader
  },
  data: () => {
    return {
      id: ''
    }
  },
  mounted: async function() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    } else {
      this.id = this.$node.ipfs.id.id
    }

    this.$store.dispatch('nodes/getNode', this.id)
  },
  methods: {
    //Turn the module on/off
    switchModule(name, value) {
      //If we are on the local module
      if (this.id === this.$node.ipfs.id.id) {
        let payload = {
          id: this.id,
          name: name,
          value: value
        }
        this.$store.dispatch('nodes/switchModule', payload)
      } else {
        //To be done
        console.log('update remote module')
      }
    },
    moduleTypeColor(type) {
      switch (type) {
        case 'system':
          return 'primary'
          break
        case 'custom':
          return 'secondary'
          break
        default:
          break
      }
    },
    moduleTypeIcon(type) {
      switch (type) {
        case 'system':
          return 'settings'
          break
        case 'custom':
          return 'perm_identity'
          break
        default:
          break
      }
    },
    moduleStartedColor(started) {
      if (started) {
        return 'green'
      } else {
        return 'red'
      }
    },
    extractConnection(connectionString) {
      return connectionString.split('/')
    },
    networkServerColor(server) {
      switch (server) {
        case 'ipfs':
          return 'primary'
          break
        case 'p2p-websocket-star':
          return 'secondary'
          break
        default:
          break
      }
    }
  }
}
</script>
