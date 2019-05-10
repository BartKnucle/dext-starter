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
