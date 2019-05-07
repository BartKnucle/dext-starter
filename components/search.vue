<template>
  <v-autocomplete
    :items="$store.getters['swarm/nodes']"
    item-text="name"
    item-value="id"
    label="Search"
    dense/>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
