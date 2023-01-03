<template>
  <input type="file" @change="onChange" accept="image/*"/>
</template>


<script>
  /*! Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal)
  * Licensed Under MIT (http://opensource.org/licenses/MIT)
  *
  * Vue Image Compressor @ Version 0.0.1
  *
  * refs:
  * https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
  * https://davidwalsh.name/convert-canvas-image
  * https://beta.webcomponents.org/element/3mp3ri0r/cpol-image
  *
  */
  export default {
    props: {
      // Image Scale Percentage (1 - 100)
      scale: { type: Number, default: 100 },
      // Image Quality Percentage (1 - 100)
      quality: { type: Number, default: 100 },
      // Pass the files info when it's done
      done: { type: Function, default: () => {} }
    },

    data () {
      return  {
        file: {},
        result: {},
        reader: {},
        imgSrc: ""
      }
    },

    watch: {
      // When Scale and Quality properties has changed, do Redraw
      scale() { return this.redraw() },
      quality() { return this.redraw() },
    },

    methods: {
      /*
        When Input File has changed
      */
      onChange(e) {
        let [file] = e.target.files
        // Validation
        if (!file) return false
        if (file.type.indexOf('image') < 0) return this.showToast('error', 'File is not an image.')
        // Get the file
        this.file = file
        // Make new FileReader
        this.reader = new FileReader()
        // Convert the File to Base64 text
        this.reader.readAsDataURL(this.file)
        // On Reader File load
        this.reader.onload = this.fileOnLoad
      },
      /*
        Draw And Compress The Image
        @params {String} imgUrl
      */
      drawImage(imgUrl) {
        // Make JPEG Filename
        let name = this.result.file.name
        name = name.substr(0, name.lastIndexOf('.')) + '.jpeg'
        // Recreate Canvas element
        this.canvas = document.createElement('canvas')
        // Create new Image
        const img = new Image()
        img.src = imgUrl

        // On Image URL load
        img.onload = () => {
          // Image Size after scaling
          const scale = this.scale / 100
          const width = img.width * scale
          const height = img.height * scale
          // Set Canvas Height and Width according to Image Size and Scale
          this.canvas.setAttribute('width', width)
          this.canvas.setAttribute('height', height)
          this.canvas.getContext('2d').drawImage(img, 0, 0, width, height)
          // Make Image with Quality
          const base64 = this.canvas.toDataURL('image/jpeg', this.quality ? (this.quality / 100) : 1)
          // Make File with Image and Filename
          let file = new File([base64], name)
          // Convert Base64 to Blob URL
          fetch(base64).then(res => res.blob()).then(blob => {
            this.done({
              canvas: this.canvas,
              original: this.result,
              compressed: {
                blob: window.URL.createObjectURL(blob),
                base64,
                name,
                file,
                size: Math.round(file.size / 1024) + ' kB',
                type: 'image/jpeg'
              }
            })
          })
        }
      },
      /*
        Redraw the canvas
      */
      redraw() {
        this.result.base64 && this.drawImage(this.result.base64)
      },
      /*
        When The File in loaded
      */
      fileOnLoad() {
        // The File
        let { file } = this
        // Make a fileInfo Object and push it to the state
        this.result = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1024) +'  kB',
          base64: this.reader.result,
          file
        }
        // DrawImage
        this.drawImage(this.result.base64)
      }
    }
  }
</script>
