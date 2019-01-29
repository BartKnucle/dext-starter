</<template>
  <v-toolbar>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
  </v-toolbar>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
