<template>
  <v-card>
    <slot/>
  </v-card>  
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
