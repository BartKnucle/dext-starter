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
        v-model="subject"
        label="Subject"
        single-line
        full-width
        hide-details/>
      <v-divider/>
      <v-textarea
        v-model="message"
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
      selected: [],
      recipients: [],
      subject: '',
      message: ''
    }
  },
  created: function() {
    this.recipients = this.$store.getters['swarm/users']
  },
  mounted: function() {},
  methods: {
    //Send the message
    send() {
      var data = {
        type: 'message',
        subject: this.subject,
        message: this.message
      }
      this.selected.forEach(element => {
        this.$node.messages.send(element, data)
      })
    }
  }
}
</script>
