<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-data-table
      :items="nodeDb"
      :headers="headers">
      <template 
        slot="items" 
        slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.data }}</td>
      </template>
    </v-data-table>
  </v-layout>
</template>
<script>
import { default as appNodeInfos } from '~/components/organisms/appNodeInfos.vue'
import { NODE } from '~/lib/node.js'
export default {
  components: {
    appNodeInfos: appNodeInfos
  },
  data: () => {
    return {
      nodeDb: [],
      headers: [{ text: 'Id', value: 'id' }, { text: 'Data', value: 'data' }]
    }
  },
  computed: {
    iconSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '70px'
        case 'sm':
          return '80px'
        case 'md':
          return '90px'
        case 'lg':
          return '100px'
        case 'xl':
          return '100px'
      }
    }
  },
  mounted: async function() {
    //If we get the local node
    if (!this.$route.params.id) {
      this.node = this.$node
    } else {
      //Load the remote db
      this.node = new NODE(this.$app)
      await this.node.init(this.$route.params.id)
    }
    this.nodeDb = this.node.get('')

    this.node.db.events.on('replicated', address => {
      this.nodeDb = this.node.get('')
    })

    this.node.db.events.on('write', address => {
      this.nodeDb = this.node.get('')
    })
  }
}
</script>
