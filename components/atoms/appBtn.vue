<template>
  <v-btn>
    {{ title }}
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
    },
    iconName: {
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
