<template>
  <v-btn
    :icon="icon">
    {{ title }}
    <slot/>
  </v-btn>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
