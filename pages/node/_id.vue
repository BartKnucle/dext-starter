<template>
  <v-layout
    column
    justify-center
    align-center>
    <nuxt-link :to="'/node/QmawdReAz4zrcbZbLRzYFbqN19s6LjmM6gammSMc1ZuQWx'">Chrome</nuxt-link>
    <nuxt-link :to="'/node/QmSscJHtVpYJcXfwPTquc17uVq2BGoMNhB2kJ1zc3gSsWs'">Firefox</nuxt-link>
    <nuxt-link :to="'/node/QmS5DD7uZrEsBLNxRSv9scwVebKM2o74KMFJqiauXfKabt'">Linux</nuxt-link>
    {{ plateform }}
  </v-layout>
</template>
<script>
import { NODE } from '../../lib/node.js'
export default {
  data: () => {
    return {
      node: {},
      plateform: ''
    }
  },
  mounted: async function() {
    console.log(this.$route.params.id)
    this.db = this.$db //rename to fit the class
    this.logger = this.$logger //rename to fit the class
    this.node = new NODE(this, this.$route.params.id)
    await this.node.loadDb()
    this.plateform = await this.node.getPlateform()
    this.node.closeDb()
  }
}
</script>
