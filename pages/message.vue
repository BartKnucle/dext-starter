<template>
  <v-card>
    <v-toolbar
      card
      color="primary"
      dark
    >
      <v-icon>arrow_back</v-icon>
      <v-toolbar-title>Compose</v-toolbar-title>
      <v-spacer/>
      <v-icon
        @click="send">
        send
      </v-icon>
    </v-toolbar>
    <v-form>
      <v-autocomplete
        v-model="selected"
        :items="recipients"
        item-text="name"
        item-value="id"
        chips
        label="To"
        full-width
        hide-details
        hide-no-data
        hide-selected
        multiple
        single-line/>
      <v-divider/>
      <v-text-field
        label="Subject"
        value="Plans for the weekend"
        single-line
        full-width
        hide-details/>
      <v-divider/>
      <v-textarea
        v-model="title"
        label="Message"
        counter
        maxlength="120"
        full-width
        single-line/>
    </v-form>
  </v-card>
</template>
<script>
export default {
  data: () => {
    return {
      recipients: []
    }
  },
  created: function() {
    this.$store.dispatch('swarm/getSwarm')
  },
  mounted: function() {
    this.recipients = this.$store.getters['swarm/nodes']
  },
  methods: {
    //Send the message
    send() {
      var data = 'test'
      this.selected.forEach(element => {
        this.$node.messages.send(element, data)
      })
    }
  }
}
</script>
