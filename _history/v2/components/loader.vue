</<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="300"
  >
     <v-list subheader>
      <v-subheader>Loading</v-subheader>
      <v-list-tile
        v-for="item in steps"
        :key="item.name">

        <v-list-tile-avatar 
          :color="getValueColor(item.done)">
          <v-icon
            color="black">
            {{ item.icon }}
          </v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          {{ item.name }}
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        Please stand by
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>  
</template>
<script>
export default {
  data() {
    return {
      steps: [
        {
          icon: 'list_alt',
          name: 'Loading database',
          done: false
        },
        {
          icon: 'device_hub',
          name: 'Connecting node',
          done: false
        },
        {
          icon: 'import_export',
          name: 'Loading data',
          done: false
        }
      ],
      dialog: false
    }
  },

  mounted() {
    this.dialog = true
    this.steps[0].done = this.$app.ipfs.started
    this.steps[1].done = this.$app.db.started
    this.steps[2].done = this.$app.node.started
    //this.dialog = !this.$app.node.started
  },
  methods: {
    getValueColor(done) {
      if (done) {
        return 'green'
      } else {
        return 'red'
      }
    }
  }
}
</script>
