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
import { TEST } from '../lib/test.js'
export default {
  data: () => {
    return {
      test: {},
      data: {},
      item: {}
    }
  },
  mounted: async function() {
    this.db = this.$db //rename to fit the class
    this.logger = this.$logger //rename to fit the class
    this.test = new TEST(this, 'Qmb7MWdFtCJeRGjaJKuLaJRFTSAaA5F6VA7T1paS3F4Jwa')
    await this.test.init()
    this.data = this.test.all()
    this.item = this.test.get('test1')
    console.log(this.data)
  }
}
</script>
