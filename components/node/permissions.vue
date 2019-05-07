<template>
  <v-container>
    <v-autocomplete
      v-model="selectednodes"
      :items="nodes"
      item-text="name"
      item-value="id"
      label="Nodes"
      chips
      full-width
      multiple
      single-line/>
    <v-layout>
      <v-flex
        xs12
        md6
        xl3>
        <v-treeview
          v-model="selectedPermissions"
          :items="permissionsTree"
          selected-color="primary"
          activatable
          open-on-click
          selectable
          expand-icon="chevron_right"
          on-icon="check_box_blank"
          off-icon="check_box_outline_blank"
          indeterminate-icon="indeterminate_check_box"/>
      </v-flex>
      <v-divider vertical/>
      <v-container
        fluid
        grid-list-md>
        <v-data-iterator
          :items="$store.getters['permissions/permissions']"
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
                {{ $store.getters['swarm/nameByID'](props.item.id) }}
              </v-card-title>
              <v-list>
                <template v-slot:activator>
                  <v-list-tile
                    v-for="item in props.item.permissions"
                    :key="item.permissions"
                    no-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.module }} {{ item.function }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-layout>
    <v-btn
      fab
      fixed
      bottom
      right
      color="red"
      @click="addPermission">
      <v-icon>add</v-icon>
    </v-btn>
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
      permissionsDialog: false,
      moduleName: '',
      selectednodes: [],
      nodes: [],
      selectedPermissions: []
    }
  },
  computed: {
    permissionsTree() {
      var modules = this.$node.getModules()
      var tree = []
      modules.forEach(leaf => {
        tree.push({
          id: leaf.name,
          name: leaf.name,
          children: Object.getOwnPropertyNames(
            this.$node.getFunctions(leaf.name)
          ).map(value => {
            return { name: value, id: leaf.name + '/' + value }
          })
        })
      })

      //Add the node (not a module)
      tree.push({
        id: 'node',
        name: 'node',
        children: Object.getOwnPropertyNames(
          Object.getPrototypeOf(this.$node)
        ).map(value => {
          return { name: value, id: 'node/' + value }
        })
      })
      return tree
    }
  },
  created: function() {
    this.nodes = this.$store.getters['swarm/nodes']
  },
  methods: {
    addPermission() {
      this.selectednodes.forEach(node => {
        var permissions = {
          id: node,
          permissions: []
        }
        this.selectedPermissions.forEach(permission => {
          let tblPerm = permission.split('/')
          if (tblPerm.length === 2) {
            permissions.permissions.push({
              module: tblPerm[0],
              function: tblPerm[1]
            })
          }
        })
        this.$node.execute('permissions', 'add', permissions, this.id)
        //this.$node.permissions.add(permissions)
      })
    }
  }
}
</script>
