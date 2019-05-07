<template>
  <v-app dark>
    <no-ssr>
      <loader
        :dialog="!$store.state.node.started"
        :info="'node'"/>
      <v-container
        v-if="$store.state.node.nameSetup">
        <v-dialog
          :value="true"
          max-width="600px"
          no-click-animation
          persistent>
          <v-card>
            <profil 
              :id="$node.ipfs.id.id"/>
          </v-card>
        </v-dialog>
      </v-container>
      <v-navigation-drawer
        :mini-variant="miniVariant"
        :clipped="clipped"
        v-model="drawer"
        fixed
        app
      >
        <leftMenu/>
      </v-navigation-drawer>
      <v-toolbar
        :clipped-left="clipped"
        fixed
        app>
        <v-toolbar-side-icon @click="drawer = !drawer" />
        <v-toolbar-title
          v-show="!$vuetify.breakpoint.xs"
          v-text="title"/>
        <v-spacer/>
        <search/>
        <v-btn
          icon
          @click.stop="rightDrawer = !rightDrawer">
          <v-badge
            left
            overlap>
            <span slot="badge">{{ $store.getters['messages/notifCount'] }}</span>
            <v-icon>
              notifications
            </v-icon>
          </v-badge>
        </v-btn>
      </v-toolbar>
      <v-content>
        <v-container>
          <nuxt/>
        </v-container>
      </v-content>
      <v-navigation-drawer
        :right="right"
        v-model="rightDrawer"
        temporary
        fixed>
        <notif/>
      </v-navigation-drawer>
      <v-footer
        :fixed="fixed"
        app>
        <span>&copy; DEXT 2019 </span>
      </v-footer>
    </no-ssr>
  </v-app>
</template>
<script>
import loader from '../components/loader.vue'
import alert from '../components/alert.vue'
import leftMenu from '../components/leftMenu.vue'
import notif from '../components/notif.vue'
import search from '../components/search.vue'
import profil from '../components/node/profil.vue'
export default {
  components: {
    loader,
    alert,
    notif,
    leftMenu,
    profil,
    search
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'Dext framework',
      dialog: false
    }
  },
  mounted: function() {
    //window.LOG = 'debug'
    this.dialog = this.$store.state.node.nameSetup
  },
  updated: function() {
    //window.LOG = 'debug'
    this.dialog = this.$store.state.node.nameSetup
  }
}
</script>
