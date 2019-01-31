<template>
  <v-layout>
    <!-- <appList
      :title="'test'"/>
    <appList/> -->
    <appCard
      :title="'test'">
      <appToolBar
        :title="'test'"/>
      <appToolBar
        :title="'test1'"/>
    </appCard>
  </v-layout>
</template>
<script>
import { default as appList } from '~/components/atoms/appList.vue'
import { default as appCard } from '~/components/atoms/appCard.vue'
import { default as appChip } from '~/components/atoms/appChip.vue'
import { default as appToolBar } from '~/components/atoms/appToolBar.vue'
export default {
  components: {
    appList: appList,
    appCard: appCard,
    appChip: appChip,
    appToolBar: appToolBar
  },
  data: () => {
    return {}
  },
  mounted: function() {}
}
</script>
