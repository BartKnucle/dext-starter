<template>
  <v-icon>
    {{ icon }}
    <slot/>
  </v-icon>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
