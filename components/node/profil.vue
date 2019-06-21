<template>
  <v-layout 
    column>
    <v-flex>
      <v-text-field
        v-if="$store.getters['nodes/type'](id) === 'user'"
        :value="$store.getters['nodes/firstName'](id)"
        :counter="15"
        :rules="nameRules"
        label="First name"
        required
        @change="v => $node.execute('node', 'setFirstName', v, id)"
      />
      <v-text-field
        v-if="$store.getters['nodes/type'](id) === 'user'"
        :value="$store.getters['nodes/lastName'](id)"
        :rules="nameRules && lastNameRules"
        :counter="15"
        label="Last name"
        required
        @change="v => $node.execute('node', 'setLastName', v, id)"
      />
    </v-flex>
    <v-btn
      :fab="!$store.state.node.nameSetup"
      :fixed="!$store.state.node.nameSetup"
      :bottom="!$store.state.node.nameSetup"
      :right="!$store.state.node.nameSetup"
      color="red"
      @click="save">
      <v-icon>save</v-icon>
    </v-btn>
  </v-layout>
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
      //firstName: '',
      nameRules: [
        v => !!v || 'Field is required',
        v => v.length <= 15 || 'Name must be less than 15 characters',
        v =>
          v.charAt(0) == v.charAt(0).toUpperCase() ||
          'First caracter must be uppercase'
      ],
      //lastName: '',
      lastNameRules: [v => v == v.toUpperCase() || 'Name must be uppercase']
    }
  },
  methods: {
    save: async function() {
      if (this.$store.getters['nodes/type'](this.id) === 'user') {
        await this.$node.execute(
          'node',
          'setFirstName',
          this.firstName,
          this.id
        )
        await this.$node.execute('node', 'setLastName', this.lastName, this.id)
        await this.$node.execute(
          'node',
          'setName',
          this.firstName + ' ' + this.lastName,
          this.id
        )
      }
    }
  }
}
</script>
