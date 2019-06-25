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
        <compose/>
      </v-tab-item>
      <v-tab>
        Received
      </v-tab>
      <v-tab-item>
        <received/>
      </v-tab-item>
      <v-tab>
        Sent
      </v-tab>
      <v-tab-item>
        <sent/>
      </v-tab-item>
      <v-tab>
        All
      </v-tab>
      <v-tab-item>
        <all/>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import compose from '~/components/messages/compose.vue'
import received from '~/components/messages/received.vue'
import sent from '~/components/messages/sent.vue'
import all from '~/components/messages/all.vue'
export default {
  components: {
    compose,
    received,
    sent,
    all
  },
  data: () => {
    return {
      tabs: null
    }
  }
}
</script>
