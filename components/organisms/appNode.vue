<template>
  <v-layout>
    <appNodeChip
      :id="nodedb.find(obj => obj.id == 'ipfs.id') ? nodedb.find(obj => obj.id == 'ipfs.id').data : ''"
      :type="nodedb.find(obj => obj.id == 'plateform.type') ? nodedb.find(obj => obj.id == 'plateform.type').data : ''"
    />
    <appNodeInfos
      :nodedb="nodedb"
    />
  </v-layout>
</template>
<script>
import { default as appNodeChip } from '~/components/molecules/appNodeChip.vue'
import { default as appNodeInfos } from '~/components/molecules/appNodeInfos.vue'
export default {
  components: {
    appNodeChip: appNodeChip,
    appNodeInfos: appNodeInfos
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
