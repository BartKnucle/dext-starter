<template>
  <v-layout
    column
    justify-center
    align-center>
    {{ properties }}
  </v-layout>
</template>
<script>
import { NODE } from '../../lib/node.js'
export default {
  data: () => {
    return {
      node: {},
      properties: {}
    }
  },
  mounted: async function() {
    console.log(this.$route.params.id)
    this.db = this.$db //rename to fit the class
    this.logger = this.$logger //rename to fit the class
    this.node = new NODE(this, this.$route.params.id)
    await this.node.loadDb()
    this.properties = await this.node.getDb()
    console.log(this.properties)
    this.node.closeDb()
  }
}
</script>
