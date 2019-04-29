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
          <v-toolbar
            color="primary">
            <v-toolbar-side-icon>
              <v-icon>
                {{ typeIcon(props.item.message.data.type) }}
              </v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>{{ title(props.item.message.data.type, props.item) }}</v-toolbar-title>
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
  },
  methods: {
    //Turn the module on/off
    typeIcon(type) {
      switch (type) {
        case 'message':
          return 'email'
          break
        default:
          break
      }
    },
    title(type, item) {
      switch (type) {
        case 'message':
          return item.message.data.subject
          break
        default:
          break
      }
    }
  }
}
</script>
