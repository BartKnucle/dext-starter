<template>
  <v-layout
    column
    justify-center
    align-center>
    <ul>
      <li>
        {{ data }}
      </li>
      <li>
        {{ plateform }}
      </li>
    </ul>
  </v-layout>
</template>
<script>
import { NODE } from '../../lib/node.js'
export default {
  data: () => {
    return {
      node: {},
      data: {},
      plateform: ''
    }
  },
  mounted: async function() {
    console.log(this)
    this.db = this.$db //rename to fit the class
    this.logger = this.$logger //rename to fit the class
    this.node = new NODE(this, this.$route.params.id)
    await this.node.init()
    this.data = this.node.all()
    this.plateform = this.node.get('infos')[0].data.plateform
  }
}
</script>
