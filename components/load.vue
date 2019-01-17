</<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="300"
  >
     <v-list subheader>
      <v-subheader>Steps</v-subheader>
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
          icon: 'import_export',
          name: 'Loading data',
          done: false
        },
        {
          icon: 'device_hub',
          name: 'Connecting node',
          done: false
        }
      ],
      dialog: false
    }
  },

  created() {
    this.dialog = true
    setTimeout(() => (this.steps[0].done = true), 2000)
    setTimeout(() => (this.steps[1].done = true), 4000)
    setTimeout(() => (this.steps[2].done = true), 6000)
    setTimeout(() => (this.dialog = false), 6500)
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
