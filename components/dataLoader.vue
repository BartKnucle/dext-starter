<template>
  <v-dialog
    v-model="dialog"
    hide-overlay
    width="300">
    <v-card
      color="primary"
      dark>
      <v-card-text>
        Loading data
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: () => true
    }
  }
}
</script>
