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
    this.node = new NODE(
      this.$app,
      'QmdES3Fx6VhE6T96HSG2MCHBAUdqtAsswPYX8eACDWUj77'
    ) //this.$route.params.id)
    await this.node.init()
    console.log(this.node.all())
    this.data = await this.node.all()
    //this.plateform = this.node.get('infos')[0].data.plateform
  }
}
</script>
