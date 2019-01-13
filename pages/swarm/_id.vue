<template>
  <v-layout>
    <v-flex text-xs-left>
      NODES
      <ul>
        <li 
          v-for="item in nodes"
          :key="item.id">
          <ul>
            <li>Node ID: <nuxt-link 
              :to="'/node/' + item.dbPath">
              {{ item.id }}</nuxt-link></li>
            <li>Node Database Path: {{ item.dbPath }}
              <v-btn
                flat
                icon 
                color="pink">
                <v-icon>
                  save
                </v-icon>
              </v-btn>
            </li>
          </ul>
        </li>
      </ul>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      nodes: []
    }
  },
  mounted: async function() {
    this.nodes = this.$swarm.nodes
    console.log(this.nodes)
  }
}
</SCRIPT>
