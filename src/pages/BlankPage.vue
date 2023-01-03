<template>
  <div class="flex-grow-1">
    <v-file-input
      v-model="editedItem.img_file"
      outlined
      small-chips
      label="Photo"
      prepend-icon=""
      @change="previewImage($event)"
    ></v-file-input>
    <div v-if="editedItem.img != ''" class="mb-4 d-flex flex-column align-center">
      <v-img
        :src="editedItem.img"
        max-width="150"
      ></v-img>
    </div>
  </div>
</template>

<script>
import config from '../configs'

export default {
  data: () => ({
    hotelId: 'fdsfdsf',
    editedItem: {
      img: '',
      img_file: null
    }
  }),
  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
    },
    async previewImage(file) {
      if (file) {
        this.editedItem.img_file = file
        console.log(file)
        const storageRef = config.firebase.storage().ref('FB Menu/' + this.hotelId)
        const fileRef = storageRef.child(file.name)

        await fileRef.put(file)
        const fileUrl = await fileRef.getDownloadURL()

        this.editedItem.img = fileUrl
        console.log('Successfully uploaded file: ', fileUrl)
      }
    },
    onUpload() {
      const storageRef = config.firebase.storage().ref('img.jpg').put(this.imageData)
    }
  }
}
</script>
