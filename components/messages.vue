<template>
  <v-container>
    <v-layout
      column>
      <v-data-iterator
        :items="$store.getters['messages/messages']"
        hide-actions>
        <v-flex
          slot="item"
          slot-scope="props">
          <v-card
            color="primary">
            <v-card-text>
              <h4>{{ props.item.data }}</h4>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-data-iterator>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {}
  },
  created: function() {
    this.$store.dispatch('messages/getMessages')
  }
}
</script>
