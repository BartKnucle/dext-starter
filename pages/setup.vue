<template>
    Construct  a QR code with a callback adresse with a random id.
    The user who add the device will sign is response with is public key to certify
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step
        :complete="e1 > 1"
        step="1">
        Organisation
      </v-stepper-step>
      <v-divider/>

      <v-stepper-step
        :complete="e1 > 2"
        step="2">
        User
      </v-stepper-step>
      <v-divider/>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content
        step="1">
        <v-tabs>
          <v-tab>
            JOIN
          </v-tab>
          <v-tab>
            NEW
          </v-tab>
          <v-tab-item>
            Join an existing organisation
            <v-text-field
              label="Organisation secret code"/>
          </v-tab-item>
          <v-tab-item>
            Create a new organisation
            <v-text-field
              label="Organisation name"/>
          </v-tab-item>
        </v-tabs>
        <v-btn
          color="primary"
          @click="e1 = 2">
          Continue
        </v-btn>
        <v-btn flat>
          Cancel
        </v-btn>
      </v-stepper-content>
      <v-stepper-content
        step="2">
        <v-text-field
          label="Username"/>
        <v-text-field
          label="Password"/>
        or
        <v-text-field
          label="Username"/>
        <v-btn
          color="primary"
          @click="e1 = 1">
          Continue
        </v-btn>
        <v-btn
          flat>
          Cancel
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  data() {
    return {
      e1: 0
    }
  }
}
</script>
