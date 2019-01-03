<template>
  <v-layout>
    <v-flex text-xs-center>
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5">
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <ul>
              <li>User ipfs ID: {{ this.$store.state.database.userIpfsId }}</li>
              <li>Node ipfs ID: {{ this.$store.state.database.nodeIpfsId }}</li>
              <li>Node database path: {{ this.$store.state.database.nodeDbPath }}</li>
              <li>Node modules: {{ this.$store.state.node.nodeModules }}</li>
            </ul>
          </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>
<script>
export default {}
</SCRIPT>
