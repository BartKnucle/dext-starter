<template>
  <v-layout 
    column>
    <v-flex>
      <v-text-field
        v-if="$store.getters['nodes/type'](id) === 'user'"
        v-model="firstName"
        :counter="15"
        :rules="nameRules"
        label="First name"
        required
      />
      <v-text-field
        v-if="$store.getters['nodes/type'](id) === 'user'"
        v-model="lastName"
        :rules="nameRules && lastNameRules"
        :counter="15"
        label="Last name"
        required
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
      firstName: '',
      nameRules: [
        v => !!v || 'Field is required',
        v => v.length <= 15 || 'Name must be less than 15 characters',
        v =>
          v.charAt(0) == v.charAt(0).toUpperCase() ||
          'First caracter must be uppercase'
      ],
      lastName: '',
      lastNameRules: [v => v == v.toUpperCase() || 'Name must be uppercase']
    }
  },
  methods: {
    save: async function(event) {
      if (this.$store.getters['nodes/type'](this.id) === 'user') {
        this.$node.execute(
          'node',
          'setFirstName',
          this.firstName
        )
        
        this.$node.execute(
          'node',
          'setName',
          this.lastName
        )

        this.$node.execute(
          'node',
          'setName',
          this.firstName + ' ' + this.lastName
        )
      }
    }
  }
}
</script>
