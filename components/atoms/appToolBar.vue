<template>
  <v-toolbar
    color="primary">
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <slot/>
  </v-toolbar>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
