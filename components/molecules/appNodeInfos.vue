<template>
  <v-layout>
    <appTree
      :items="infos"/>
  </v-layout>
</template>
<script>
import { default as appTree } from '~/components/atoms/appTree.vue'
export default {
  components: {
    appTree: appTree
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
