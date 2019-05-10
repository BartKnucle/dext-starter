<template>
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
</template>
<script>
export default {
  data() {
    return {
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'settings', title: 'Settings', to: '/settings' },
        { icon: 'message', title: 'Message', to: '/message' },
        { icon: 'group_work', title: 'Swarm', to: '/swarmMgmt' },
        { icon: 'drag_indicator', title: 'Sandbox', to: '/sandbox' }
      ]
    }
  }
}
</script>
