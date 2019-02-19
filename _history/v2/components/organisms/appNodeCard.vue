<template>
  <v-layout>
    <appCard>
      <appList
        :title="'Node informations'">
        <template
          v-for="item in nodedb">
          <v-list-tile-content :key="item.id">
            <v-list-tile-title>{{ item.id }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.data }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </appList>
    </appCard>
    <!-- {{ nodedb }} -->
  </v-layout>
</template>
<script>
import { default as appList } from '~/components/molecules/appList.vue'
import { default as appCard } from '~/components/atoms/appCard.vue'
export default {
  components: {
    appList: appList,
    appCard: appCard
  },
  props: {
    nodedb: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
