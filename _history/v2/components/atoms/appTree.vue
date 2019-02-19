<template>
  <v-layout>
    <v-treeview :items="items"/>
  </v-layout>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
