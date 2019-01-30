<template>
  <v-chip>
    <slot/>
    {{ title }}
  </v-chip>
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
