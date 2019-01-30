<template>
  <v-layout>
    <appChip
      :title="id">
      <app-icon>
        {{ getTypeIcon(type) }}
      </app-icon>
    </appChip>
  </v-layout>
</template>
<script>
import { default as appChip } from '~/components/atoms/appChip.vue'
import { default as appIcon } from '~/components/atoms/appIcon.vue'
export default {
  components: {
    appChip: appChip,
    appIcon: appIcon
  },
  props: {
    id: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    getTypeIcon(type) {
      switch (type) {
        case 'browser':
          return 'web'
        case 'computer':
          return 'desktop_windows'
      }
    }
  }
}
</script>
