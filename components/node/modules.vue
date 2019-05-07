<template>
  <v-container
    fluid
    grid-list-md>
    <v-data-iterator
      :items="$store.getters['nodes/modulesByID'](id)"
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
        lg3>
        <v-card :color="moduleTypeColor(props.item.type)">
          <v-card-title>
            <v-icon
              :color="moduleStartedColor(props.item.started)"
              large>
              {{ moduleTypeIcon(props.item.type) }}
            </v-icon>
            <h4>{{ props.item.name }}</h4>
            <v-spacer/>
            <v-card-actions>
              <v-switch
                :input-value="props.item.started"
                :disabled="!props.item.stoppable"
                light
                @click.stop="switchModule(props.item.name)"/>
            </v-card-actions>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-data-iterator>
    <v-btn
      fab
      fixed
      bottom
      right
      color="red"
      @click="moduleDialog=!moduleDialog">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog
      v-model="moduleDialog">
      <v-card>
        <v-card-title>
          Type the module name to add
        </v-card-title>
        <v-text-field
          v-model="moduleName"
          label="Module name"
          required
        />
        <v-card-actions>
          <v-btn
            @click="moduleAdd(moduleName)">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    return {
      moduleDialog: false
    }
  },
  methods: {
    switchModule(name) {
      //If we are on the local module
      if (this.id === this.$node.ipfs.id.id) {
        let payload = {
          id: this.id,
          name: name
        }
        this.$store.dispatch('nodes/switchModule', payload)
      } else {
        //To be done
        console.log('update remote module')
      }
    },
    moduleTypeColor(type) {
      switch (type) {
        case 'system':
          return 'primary'
          break
        case 'custom':
          return 'secondary'
          break
        default:
          break
      }
    },
    moduleTypeIcon(type) {
      switch (type) {
        case 'system':
          return 'settings'
          break
        case 'custom':
          return 'perm_identity'
          break
        default:
          break
      }
    },
    moduleStartedColor(started) {
      if (started) {
        return 'green'
      } else {
        return 'red'
      }
    },
    async moduleAdd() {
      this.$node.execute('node', 'addCustomModule', 'swarmMgmt', this.id)
      this.moduleDialog = false
    }
  }
}
</script>
