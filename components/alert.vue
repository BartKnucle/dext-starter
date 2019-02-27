<template>
  <v-snackbar
    v-model="visible"
    :color="color">
    MA SNACK
    <v-btn
      @click="visible = !visible">
      Close
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  data() {
    return {
      visible: true,
      color: 'success'
    }
  }
}
</script>
