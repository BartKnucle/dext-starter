<template>
  <v-layout>
    <appNodeChip
      :id="infos.find(obj => obj.id == 'infos') ? infos.find(obj => obj.id == 'infos').name : ''"
      :type="'computer'"
    />
    <appNodeInfos
      :infos="infos"
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
    infos: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
