<template>
  <v-layout>
    <div
      class="dropbox">
      <input
        :name="uploadFieldName"
        type="file"
        multiple
        class="input-file"
        @change="upload($event.target.files)">
      <p>
        Drag your file(s) here to begin<br> or click to browse
      </p>
    </div>
    <v-container
      fluid
      grid-list-md>
      <v-data-iterator
        :items="$store.getters['files/files']"
        content-tag="v-layout"
        hide-actions
        row
        wrap>
        <v-flex
          slot="item"
          slot-scope="props"
          xs12
          sm6
          md4
          lg4>
          <v-card>
            <v-card-title>
              <v-chip
                @click="download(props.item)">
                {{ props.item.name }}
              </v-chip>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-data-iterator>
    </v-container>
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
  mounted: async function() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.$store.dispatch('nodes/openDb', this.id)
    } else {
      this.id = this.$node.ipfs.id.id
    }
  },
  methods: {
    upload(fileList) {
      for (let index = 0; index < Object.keys(fileList).length; index++) {
        let reader = new FileReader()

        reader.onloadend = function() {
          const buf = Buffer(reader.result)
          this.$node.ipfs.ipfs.add(buf, (err, result) => {
            if (err) {
              console.error(err)
              return
            }
            //Add file to database
            let file = {
              id: result[0].hash,
              name: fileList[index].name,
              size: fileList[index].size
            }
            console.log(fileList[index])
            this.$node.execute('files', 'add', file, this.id)
          })
        }.bind(this)
        reader.readAsArrayBuffer(fileList[index])
      }
    },
    download(file) {
      this.$node.ipfs.ipfs.get(file.id, (err, files) => {
        files.forEach(file => {
          let data = Buffer.from(file.content)
          let fileDownload = new Blob([data], {
            type: 'application/octet-stream'
          })
          let fileURL = URL.createObjectURL(fileDownload)
          window.open(fileURL)
        })
      })
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
