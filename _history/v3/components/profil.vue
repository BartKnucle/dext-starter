<template>
  <v-layout 
    column>
    <v-flex>
      <v-avatar
        slot="activator"
        :size="avatarSize"
        color="red"
      >
        <img
          v-if="avatar"
          :src="avatar"
          alt="Avatar"
        >
        <span
          v-else-if="lastName && firstName"
          class="white--text headline">{{ lastName.charAt(0) + firstName.charAt(0) }}</span>
        <v-icon
          v-else
          :size="avatarSize">
          face
        </v-icon>
      </v-avatar>
    </v-flex>
    <v-flex>
      <v-text-field
        v-model="firstName"
        :counter="15"
        :rules="nameRules"
        label="First name"
        required
      />
      <v-text-field
        v-model="lastName"
        :rules="nameRules && lastNameRules"
        :counter="15"
        label="Last name"
        required
      />
    </v-flex>
    <v-flex>
      <v-btn
        left
        depressed
        large
        color="primary"
        @click="save">Save</v-btn>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data: () => {
    return {
      //avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
      avatar: '',
      firstName: '',
      nameRules: [
        v => !!v || 'Field is required',
        v => v.length <= 15 || 'Name must be less than 15 characters',
        v =>
          v.charAt(0) == v.charAt(0).toUpperCase() ||
          'First caracter must be uppercase'
      ],
      lastName: '',
      lastNameRules: [v => v == v.toUpperCase() || 'Name must be uppercase'],
      dialog: true
    }
  },
  computed: {
    avatarSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '70px'
        case 'sm':
          return '80px'
        case 'md':
          return '90px'
        case 'lg':
          return '100px'
        case 'xl':
          return '100px'
      }
    }
  },
  methods: {
    save: async function(event) {
      /*await this.$node.add({
        id: 'user.firstname',
        data: this.firstName
      })

      await this.$node.add({
        id: 'user.lastname',
        data: this.lastName
      })*/

      this.$node.setName(this.firstName + ' ' + this.lastName)
    }
  }
}
</script>
