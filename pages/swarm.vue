<template>
  <v-layout>
    {{ $store.state.swarm.nodes }}
    <v-data-table
      :items="$store.state.swarm.nodes"
      :headers="[{ text: 'ID', value: 'id' }, { text: 'DB ID', value: 'dbId' }, { text: 'MSG DB ID', value: 'messagesDbId' }]">>
      <template 
        slot="items"
        slot-scope="props">
        <td><nuxt-link :to="'/settings/' + props.item.id">{{ props.item.id }}</nuxt-link></td>
        <td> {{ props.item.dbId }} </td>
        <td> {{ props.item.messagesDbId }} </td>
        <td>
          <v-btn
            icon
            @click.stop="deleteNode(props.item.id)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
        <td>
          <v-btn
            icon
            @click.stop="sendMsg(props.item.id)">
            <v-icon>send</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-layout>
</template>
<script>
import { perc2color } from '~/utils/color.js'
export default {
  created: function() {
    this.$store.dispatch('swarm/getSwarm')
  },
  methods: {
    deleteNode(id) {
      this.$node.swarm.delete(id)
    },
    sendMsg(id) {
      this.$node.messages.send(id)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
