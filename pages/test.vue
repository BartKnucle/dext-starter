<template>
  <v-layout>
    <ul>
      <li>
        {{ data }}
      </li>
      <li>
        {{ item }}
      </li>
    </ul>
  </v-layout>
</template>
<script>
import { MODULE } from '../lib/module.js'
export default {
  data: () => {
    return {
      test: {},
      data: {},
      item: []
    }
  },
  mounted: async function() {
    console.log(this.app)
    this.test = new MODULE(
      this,
      'QmbKCVVjmnutiddn8KFmCczMomDt1exAWWUaa2kpg4Hrex'
    )
    await this.test.init()
    this.data = this.test.all()
    this.item = this.test.get('test')[0].data.variable1
    console.log(this.data)
  }
}
</script>
