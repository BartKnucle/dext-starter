<template>
  <v-dialog
    v-model="dialog"
    hide-overlay
    width="300">
    <div>
      <div class="loaderContainer">
        <div id="loader"/>
        <div id="insideLoader"/>
        <div id="insideLoader1"/>
      </div>
      <div>Loading {{ info }}</div>
    </div>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: () => true
    },
    info: {
      type: String,
      required: false,
      default: () => ''
    }
  }
}
</script>
<style>
#loader {
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

#insideLoader {
  margin: 10px;
  width: 100px;
  height: 100px;
  animation: spinInside 1s linear infinite;
}

#insideLoader1 {
  margin: 20px;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
}

#loader,
#insideLoader,
#insideLoader1 {
  position: absolute;
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #db7f34; /* Blue */
  border-right: 16px solid #a8470f; /* Blue */
  border-bottom: 16px solid #704310; /* Blue */
  border-left: 16px solid #4d2a09; /* Blue */
  border-radius: 50%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0.3;
  }
}

@keyframes spinInside {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: rotate(-360deg);
    opacity: 1;
  }
}
</style>
