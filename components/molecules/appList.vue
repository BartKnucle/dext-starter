<template>
  <v-list
    subheader>
    <appToolBar
      :title="title">
      <v-spacer/>
      <appBtn
        :title="'search'"/>
    </appToolBar>
    <slot/>
  </v-list>  
</template>
<script>
import { default as appToolBar } from '~/components/atoms/appToolBar.vue'
import { default as appBtn } from '~/components/atoms/appBtn.vue'
export default {
  components: {
    appToolBar: appToolBar,
    appBtn: appBtn
  },
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
