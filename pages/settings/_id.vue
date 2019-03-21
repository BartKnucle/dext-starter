<template>
  <v-container>
    <dataLoader :dialog="!$store.getters['nodes/loaded'](id)"/>
    <v-tabs
      v-model="tabs"
      active-class="black"
      color="primary"
      grow>
      <v-tab>
        Profil
      </v-tab>
      <v-tab-item>
        <v-toolbar>
          <v-toolbar-title>
            {{ $store.getters['swarm/nameByID'](id) }}
          </v-toolbar-title>
        </v-toolbar>
        <v-text-field
          v-model="name"
          label="Name"/>
      </v-tab-item>
      <v-tab>
        Modules
      </v-tab>
      <v-tab-item>
        <v-dialog
          v-model="moduleDialog">
          <v-card>
            <v-card-title>
              Type the module name to add
            </v-card-title>
            <v-text-field
              v-model="moduleName"
              label="Module name"
              required
            />
            <v-card-actions>
              <v-btn
                @click="moduleAdd(moduleName)">
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-toolbar>
          <v-toolbar-title>
            {{ $store.getters['swarm/nameByID'](id) }}
          </v-toolbar-title>
        </v-toolbar>
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
      </v-tab-item>
      <v-tab>
        Network
      </v-tab>
      <v-tab-item>
        <v-toolbar>
          <v-toolbar-title>
            {{ $store.getters['swarm/nameByID'](id) }}
          </v-toolbar-title>
        </v-toolbar>
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
                    <nuxt-link :to="'/settings/' + props.item.id">{{ $store.getters['swarm/nameByID'](props.item.id) }}</nuxt-link>
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
                      light
                      @click.stop="switchDbOpened(props.item.id, props.item.open)"/>
                    <v-btn 
                      icon
                      @click.stop="deleteDb(props.item.id)">
                      <v-icon color="red">delete</v-icon>
                    </v-btn>
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
    <v-fab-transition v-if="activeFab">
      <v-btn
        :key="activeFab.icon"
        :color="activeFab.color"
        fab
        fixed
        bottom
        right
        @click="activeFab.onClick"
      >
        <v-icon>{{ activeFab.icon }}</v-icon>
      </v-btn>
    </v-fab-transition>
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
      tabs: null,
      id: '',
      moduleDialog: false,
      moduleName: ''
    }
  },
  computed: {
    name: {
      set(name) {
        this.$node.setName(name)
      },
      get() {
        return this.$store.getters['swarm/nameByID'](this.id)
      }
    },
    activeFab: function() {
      switch (this.tabs) {
        case 1:
          return {
            color: 'red',
            icon: 'add',
            onClick: this.showModuleDialog
          }
        case 2:
          return {
            color: 'indigo',
            icon: 'share',
            onClick: this.peerConnect
          }
        default:
          return false
      }
    }
  },
  created: function() {
    this.$store.dispatch('swarm/getSwarm')
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
    showModuleDialog() {
      this.moduleDialog = true
    },
    async moduleAdd() {
      this.moduleDialog = false
      await this.$node.addCustomModule('swarmMgmt')
    },
    peerConnect() {
      this.$node.addCustomModule('swarmMgmt')
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
    },
    switchDbOpened(id, open) {
      //If the database is open we close it else we load it
      if (open) {
        this.$node.orbitdb.close(id)
      } else {
        this.$node.orbitdb.load(id)
      }
    },
    deleteDb(id) {
      this.$node.orbitdb.delete(id)
    }
  }
}
</script>
