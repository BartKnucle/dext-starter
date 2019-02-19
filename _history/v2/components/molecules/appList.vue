<template>
  <v-list
    subheader>
    <appToolBar>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer/>
      <appBtn
        :icon="true"
        @click.native="search = !search" >
        <appIcon
          :icon="'search'"/>
      </appBtn>
      <v-text-field
        v-show="search"/>
    </appToolBar>
    <slot/>
  </v-list>  
</template>
<script>
import { default as appToolBar } from '~/components/atoms/appToolBar.vue'
import { default as appBtn } from '~/components/atoms/appBtn.vue'
import { default as appIcon } from '~/components/atoms/appIcon.vue'
export default {
  components: {
    appToolBar: appToolBar,
    appBtn: appBtn,
    appIcon: appIcon
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      search: false
    }
  },
  mounted() {},
  methods: {}
}
</script>
