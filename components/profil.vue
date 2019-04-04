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
      <v-text-field
        label="Full name"
      />
    </v-flex>
    <v-btn
      color="red"
      fab
      fixed
      bottom
      right
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
        this.$node.setFirstName(this.firstName)
        this.$node.setLastName(this.lastName)
      }

      this.$node.setName(this.firstName + ' ' + this.lastName)
    }
  }
}
</script>
