<template>
  <v-layout>
    {{ nodedb }}
  </v-layout>
</template>
<script>
export default {
  components: {},
  props: {
    nodedb: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
