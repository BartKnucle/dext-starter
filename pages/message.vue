<template>
  <v-container>
    <v-tabs
      v-model="tabs"
      active-class="black"
      color="primary"
      grow>
      <v-tab>
        Compose
      </v-tab>
      <v-tab-item>
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
      </v-tab-item>
      <v-tab>
        Received
      </v-tab>
      <v-tab-item>
        <v-container
          fluid
          grid-list-md>
          <v-data-iterator
            :items="$store.getters['messages/received']"
            content-tag="v-layout"
            hide-actions
            row
            wrap>
            <v-flex
              slot="item"
              slot-scope="props"
              xs12
              sm6
              md4
              lg4>
              <v-card>
                <v-card-title>
                  Date: {{ new Date(props.item.message.date).toString() }}
                  <br>
                  From: {{ $store.getters['swarm/nameByID'](props.item.message.from) }}
                  <br>
                  To: {{ $store.getters['swarm/nameByID'](props.item.message.to) }}
                  <br>
                  Subject: {{ props.item.message.data.subject }}
                  <br>
                  Message: {{ props.item.message.data.message }}
                  <br>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-tab-item>
      <v-tab>
        Sent
      </v-tab>
      <v-tab-item>
        <v-container
          fluid
          grid-list-md>
          <v-data-iterator
            :items="$store.getters['messages/sent']"
            content-tag="v-layout"
            hide-actions
            row
            wrap>
            <v-flex
              slot="item"
              slot-scope="props"
              xs12
              sm6
              md4
              lg4>
              <v-card>
                <v-card-title>
                  Date: {{ new Date(props.item.message.date).toString() }}
                  <br>
                  From: {{ $store.getters['swarm/nameByID'](props.item.message.from) }}
                  <br>
                  To: {{ $store.getters['swarm/nameByID'](props.item.message.to) }}
                  <br>
                  Subject: {{ props.item.message.data.subject }}
                  <br>
                  Message: {{ props.item.message.data.message }}
                  <br>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-tab-item>
      <v-tab>
        All
      </v-tab>
      <v-tab-item>
        <v-container
          fluid
          grid-list-md>
          <v-data-iterator
            :items="$store.getters['messages/messages']"
            content-tag="v-layout"
            hide-actions
            row
            wrap>
            <v-flex
              slot="item"
              slot-scope="props"
              xs12
              sm6
              md4
              lg4>
              <v-card>
                <v-card-title>
                  Date: {{ new Date(props.item.message.date).toString() }}
                  <br>
                  From: {{ $store.getters['swarm/nameByID'](props.item.message.from) }}
                  <br>
                  To: {{ $store.getters['swarm/nameByID'](props.item.message.to) }}
                  <br>
                  Subject: {{ props.item.message.data.subject }}
                  <br>
                  Message: {{ props.item.message.data.message }}
                  <br>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
export default {
  data: () => {
    return {
      tabs: null,
      selected: [],
      recipients: [],
      subject: '',
      message: ''
    }
  },
  created: function() {
    this.$store.dispatch('swarm/getSwarm')
    this.recipients = this.$store.getters['swarm/nodes']
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
