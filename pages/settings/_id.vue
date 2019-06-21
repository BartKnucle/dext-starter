<template>
  <v-container>
    <loader :dialog="!$store.getters['nodes/loaded'](id)"/>
    <v-toolbar>
      <v-toolbar-title>
        {{ $store.getters['nodes/name'](id) }}
      </v-toolbar-title>
    </v-toolbar>
    <v-tabs
      active-class="black"
      color="primary"
      grow>
      <v-tab>
        Profil
      </v-tab>
      <v-tab-item>
        <profil
          :id="id"
          :type="$store.getters['nodes/type'](id)"/>
      </v-tab-item>
      <v-tab>
        Modules
      </v-tab>
      <v-tab-item>
        <modules 
          :id="id"/>
      </v-tab-item>
      <v-tab>
        Network
      </v-tab>
      <v-tab-item>
        <network
          :id="id"/>
      </v-tab-item>
      <v-tab>
        Databases
      </v-tab>
      <v-tab-item>
        <databases
          :id="id"/>
      </v-tab-item>
      <v-tab>
        Permissions
      </v-tab>
      <v-tab-item>
        <permissions
          :id="id"/>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import loader from '~/components/loader.vue'
import profil from '~/components/node/profil.vue'
import modules from '~/components/node/modules.vue'
import network from '~/components/node/network.vue'
import databases from '~/components/node/databases.vue'
import permissions from '~/components/node/permissions.vue'
export default {
  components: {
    loader,
    profil,
    modules,
    network,
    databases,
    permissions
  },
  data: () => {
    return {
      id: ''
    }
  },
  mounted: async function() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.$store.dispatch('nodes/openDb', this.id)
    } else {
      this.id = this.$node.ipfs.id.id
    }
  }
}
</script>
