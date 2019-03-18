<template>
  <v-layout
    column
    justify-center
    align-center>
    {{ $store.state.node }}
    <table>
      <tr v-if="$store.getters['nodes/id'](id)">
        <td>ID:</td>
        <td>{{ $store.getters['nodes/id'](id) }}</td>
      </tr>
      <tr>
        <td>DB ID:</td>
        <td>{{ $store.getters['nodes/dbId'](id) }}</td>
      </tr>
    </table>
    - DATABASES:
    <v-data-table
      :items="$store.getters['nodes/databasesByID'](id)"
      :headers="[{ text: 'Name', value: 'name' }, { text: 'ID', value: 'id' }, { text: 'Open', value: 'opened' }]">
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item.name }} </td>
        <td> {{ props.item.id }} </td>
        <td>
          <v-switch            
            :input-value="props.item.open"
            @click.stop="switchDbOpened(props.item.id, props.item.open)"/>
        </td>
        <td>
          <v-btn
            icon
            @click.stop="deleteDb(props.item.id)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    - PEERS:
    <v-data-table
      :items="$store.getters['nodes/peersByID'](id)"
      :headers="[{ text: 'ID', value: 'id' }, { text: 'Addresses', value: 'addrs' }]">
      <template 
        slot="items"
        slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td> {{ props.item.addrs }} </td>
      </template>
    </v-data-table>
    - MODULES:
    <v-data-table
      :items="$store.getters['nodes/modulesByID'](id)"
      :headers="[{ text: 'Name', value: 'name' }, { text: 'Type', value: 'type' }, { text: 'Started', value: 'started' }]">>
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item.name }} </td>
        <td> {{ props.item.type }} </td>
        <td>
          <v-switch            
            :input-value="props.item.started"
            :disabled="!props.item.isStoppable"
            @click.stop="switchModule(props.item.name, !props.item.started)"/>
        </td>
      </template>
    </v-data-table>
    - MESSAGES: {{ $store.getters['nodes/messagesDbId'](id) }}
    <v-data-table
      :items="$store.getters['nodes/messagesByID'](id)"
      :headers="[{ text: 'From', value: 'from' }]">>
      <template 
        slot="items"
        slot-scope="props">
        <td> {{ props.item.from }} </td>
      </template>
    </v-data-table>
  </v-layout>
</template>
<script>
import { NODE } from '~/lib/node.js'
export default {
  data: () => {
    return {
      id: ''
    }
  },
  mounted: async function() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    } else {
      this.id = this.$node.ipfs.id.id
    }
    this.$store.dispatch('nodes/getNode', this.id)
  },
  methods: {
    //Turn the module on/off
    switchModule(name, value) {
      //If we are on the local module
      if (this.id === this.$node.db.database.address.root) {
        let payload = {
          id: this.id,
          name: name,
          value: value
        }
        this.$store.dispatch('nodes/switchModule', payload)
      } else {
        //To be done
        console.log('update remote module')
      }
    },
    switchDbOpened(id, open) {
      //If the database is open we close it else we load it
      if (open) {
        this.$node.orbitdb.close(id)
      } else {
        this.$node.orbitdb.load(id)
      }
    },
    deleteDb(id) {
      this.$node.orbitdb.delete(id)
    }
  }
}
</script>
