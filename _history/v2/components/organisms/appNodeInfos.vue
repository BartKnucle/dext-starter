<template>
  <v-container>
    <v-layout
      row
      wrap>
      <v-flex
        xs6>
        <!-- <appNodeChip
          :id="nodedb.find(obj => obj.id == 'name') ? nodedb.find(obj => obj.id == 'name').data : 'Unknown'"
          :type="nodedb.find(obj => obj.id == 'plateform.type') ? nodedb.find(obj => obj.id == 'plateform.type').data : ''"
        /> -->
      </v-flex>
      <v-flex
        xs6>
        <appNodeCard
          :nodedb="nodedb"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { default as appNodeChip } from './appNodeChip.vue'
import { default as appNodeCard } from './appNodeCard.vue'
export default {
  components: {
    appNodeChip: appNodeChip,
    appNodeCard: appNodeCard
  },
  props: {
    nodedb: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
