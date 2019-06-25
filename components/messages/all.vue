<template>
  <v-container
    fluid
    grid-list-md>
    <v-data-iterator
      :items="$store.getters['messages/messages']"
      content-tag="v-layout"
      hide-actions
      row
      wrap>
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg4>
        <v-card>
          <v-card-title>
            Date: {{ new Date(props.item.message.date).toString() }}
            <br>
            From: {{ $store.getters['swarm/nameByID'](props.item.message.from) }}
            <br>
            To: {{ $store.getters['swarm/nameByID'](props.item.message.to) }}
            <br>
            Subject: {{ props.item.message.data.subject }}
            <br>
            Message: {{ props.item.message.data.message }}
            <br>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>
<script>
export default {}
</script>
