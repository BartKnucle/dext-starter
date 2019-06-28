<template>
  <v-layout>
    <div
      class="dropbox">
      <input
        :name="uploadFieldName"
        type="file"
        multiple
        class="input-file"
        @change="filesChange($event.target.files)">
      <p>
        Drag your file(s) here to begin<br> or click to browse
      </p>
    </div>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'fichiers',
      fileList: []
    }
  },
  methods: {
    filesChange(fileList) {
      for (let index = 0; index < Object.keys(fileList).length; index++) {
        let reader = new FileReader()

        reader.onloadend = function() {
          const buf = Buffer(reader.result)
          this.$node.ipfs.ipfs.add(buf, (err, result) => {
            if (err) {
              console.error(err)
              return
            }
            console.log(`Hash --> ${result[0].hash}`)
          })
        }.bind(this)

        reader.readAsArrayBuffer(fileList[index])
      }
    }
  }
}
</script>
<style>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

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

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
