<template>
  <v-list subheader>
    <v-subheader>{{ title }}</v-subheader>
  </v-list>  
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
