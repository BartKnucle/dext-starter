<template>
  <v-layout
    column
    justify-center
    align-center>
    <nuxt-link :to="'/node/Qma7M7b8ZutrtTU67uesvFZY4CrDNgfjHbmveu4Yekf6Nt'">Qma7M7b8ZutrtTU67uesvFZY4CrDNgfjHbmveu4Yekf6Nt</nuxt-link>
    <nuxt-link :to="'/node/QmQKPps6cETe7tNLiQQBuLLkQwYKzdwcvCZH3sGjku9Y2x'">QmQKPps6cETe7tNLiQQBuLLkQwYKzdwcvCZH3sGjku9Y2x</nuxt-link>
    <nuxt-link :to="'/node/QmUoMchRB1xqcdVJJZgLPDR95GcraLPxJgutHmXevMgsmi'">QmUoMchRB1xqcdVJJZgLPDR95GcraLPxJgutHmXevMgsmi</nuxt-link>
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
