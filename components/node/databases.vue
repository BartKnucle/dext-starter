<template>
  <v-container
    fluid
    grid-list-md>
    <v-data-iterator
      :items="$store.getters['nodes/databasesByID'](id)"
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
        <v-card :color="databaseColor(props.item.open)">
          <v-card-title>
            <v-chip>
              {{ props.item.name }}
            </v-chip>
            <v-spacer/>
            <v-card-actions>
              <v-switch
                :input-value="props.item.open"
                light
                @click.stop="switchDbOpened(props.item.id, props.item.open)"/>
              <v-btn 
                icon
                @click.stop="deleteDb(props.item.id)">
                <v-icon color="red">delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {}
  },
  methods: {
    databaseColor(server) {
      switch (server) {
        case true:
          return 'primary'
          break
        case false:
          return 'secondary'
          break
        default:
          break
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
