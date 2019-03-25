<template>
  <v-container>
    <v-layout
      column>
      <v-data-iterator
        :items="$store.getters['messages/received']"
        hide-actions>
        <v-flex
          slot="item"
          slot-scope="props">
          {{ props.item }}
          <v-toolbar
            color="primary">
            <v-toolbar-title>{{ props.item.data }}</v-toolbar-title>
            <v-spacer/>
            <v-btn icon>
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-flex>
      </v-data-iterator>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
