<template>
  <v-app dark>
    <loader/>
    <alert/>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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
      <v-text-field
        placeholder="Search"/>
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer">
        <v-badge
          left
          overlap>
          <span slot="badge">6</span>
          <v-icon>
            notifications
          </v-icon>
        </v-badge>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer
      :right="right"
      v-model="rightDrawer"
      temporary
      fixed/>
    <v-footer
      :fixed="fixed"
      app>
      <span>&copy; DEXT 2019 </span>
    </v-footer>
  </v-app>
</template>
<script>
import loader from '../components/loader.vue'
import alert from '../components/alert.vue'
export default {
  components: {
    loader,
    alert
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'settings', title: 'Settings', to: '/settings' },
        { icon: 'group_work', title: 'Swarm', to: '/swarmMgmt' }
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'Dext framework'
    }
  },
  mounted: function() {
    //window.LOG = 'Verbose'
  }
}
</script>
