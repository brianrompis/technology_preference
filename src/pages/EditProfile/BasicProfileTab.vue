<template>
  <div>
    <!-- Mobile Title -->
    <div class="d-sm-none">
      <div class="text-h4 primary--text font-weight-bold mx-2 mt-2">Information</div>
      <v-divider/>
    </div>

    <transition appear mode="out-in">
      <progress-circular v-if="loading"/>
      <v-form v-else-if="userInfo" v-model="valid" class="pa-2 pa-md-4">

        <!-- Edit Buttons -->
        <transition mode="out-in">
          <div v-if="!edit" key="1">
            <v-btn width="112" class="orange white--text text-h6"
              @click="edit = true"
            >
              <v-icon class="me-1">mdi-pencil</v-icon>
              Edit
            </v-btn>
          </div>
          <div v-else key="2" class="d-flex align-center">
            <v-btn width="112" class="green white--text text-h6 me-1"
              :disabled="!valid || uploading"
              :loading="saving"
              @click="editUserInfo"
            >
              <v-icon class="me-1">mdi-content-save</v-icon>
              Save
            </v-btn>
            <v-btn width="112" class="secondary text-h6 mx-1"
              :disabled="saving || uploading"
              @click="resetUserInfo"
            >
              Cancel
            </v-btn>
            <div class="ms-1 text--secondary">* Required</div>
          </div>
        </transition>

        <v-row no-gutters class="flex-wrap-reverse flex-md-wrap">

          <!-- LEFT COLUMN -->
          <v-col cols="12" md="8" class="pe-md-4  mt-3">

            <!-- Full Name -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">Full Name {{ edit ? '*' : null }}</v-col>
              <v-col cols="9">
                <transition mode="out-in">
                  <v-text-field v-if="edit"
                    v-model="userInfo.FullName"
                    outlined dense
                    hide-details="auto" :rules="rules.required"
                  />
                  <div v-else class="text-label font-weight-black" v-text="userInfo.FullName"/>
                </transition>
              </v-col>
            </v-row>

            <v-divider class="form-divider"/>

            <!-- Nick Name -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">Nickname</v-col>
              <v-col cols="9">
                <transition mode="out-in">
                  <v-text-field v-if="edit"
                    v-model="userInfo.NickName"
                    outlined dense
                    hide-details="auto"
                  />
                  <div v-else class="text-label font-weight-black" v-text="userInfo.NickName"/>
                </transition>
              </v-col>
            </v-row>

            <v-divider class="form-divider"/>

            <!-- Email -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">Email {{ edit ? '*' : null }}</v-col>
              <v-col cols="9">
                <transition mode="out-in">
                  <v-text-field v-if="edit"
                    v-model="userInfo.Email"
                    outlined dense
                    hide-details="auto" :rules="rules.required"
                  />
                  <div v-else class="text-label font-weight-black" v-text="userInfo.Email"/>
                </transition>
              </v-col>
            </v-row>

            <v-divider class="form-divider"/>

            <!-- Phone Number -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">Phone Number</v-col>
              <v-col cols="9">
                <transition mode="out-in">
                  <v-text-field v-if="edit"
                    v-model="userInfo.Phone"
                    outlined dense
                    hide-details="auto"
                  />
                  <div v-else class="text-label font-weight-black" v-text="userInfo.Phone"/>
                </transition>
              </v-col>
            </v-row>

            <v-divider class="form-divider"/>

            <!-- Date of Birth -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">Date of Birth {{ edit ? '*' : null }}</v-col>
              <v-col cols="9">
                <transition mode="out-in">
                  <div v-if="edit" key="1">
                    <v-menu v-model="birthDate"
                      offset-y
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field :value="formatDateShort(userInfo.Birth)"
                          outlined dense readonly
                          hide-details="auto"
                          prepend-inner-icon="mdi-calendar"
                          v-bind="attrs"
                          :rules="rules.required"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="userInfo.Birth"/>
                    </v-menu>
                  </div>
                  <div v-else key="2" class="text-label font-weight-black" v-text="formatDateShort(userInfo.Birth)"/>
                </transition>
              </v-col>
            </v-row>

            <v-divider class="form-divider"/>

            <!-- Gender -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">Gender {{ edit ? '*' : null }}</v-col>
              <v-col cols="9">
                <transition mode="out-in">
                  <v-radio-group v-if="edit"
                    v-model="userInfo.Gender"
                    dense row
                    hide-details="auto"
                    class="my-0"
                    :rules="rules.required"
                  >
                    <v-radio value="Male" label="Male"/>
                    <v-radio value="Female" label="Female"/>
                    <v-radio value="NB" label="NB"/>
                  </v-radio-group>
                  <div v-else class="text-label font-weight-black" v-text="userInfo.Gender"/>
                </transition>
              </v-col>
            </v-row>

            <v-divider class="form-divider"/>

            <!-- Nationality -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">Nationality {{ edit ? '*' : null }}</v-col>
              <v-col cols="9">
                <transition mode="out-in">
                  <v-select v-if="edit"
                    v-model="userInfo.Nationality"
                    outlined dense
                    hide-details="auto" :rules="rules.required"
                    :items="Object.keys(countryCitySelItems)"
                  />
                  <div v-else class="text-label font-weight-black" v-text="userInfo.Nationality"/>
                </transition>
              </v-col>
            </v-row>

            <v-divider class="form-divider"/>

            <!-- ID Card Number -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">ID Card Number</v-col>
              <v-col cols="9">
                <transition mode="out-in">
                  <v-text-field v-if="edit"
                    v-model="userInfo.IDCardNumber"
                    outlined dense
                    hide-details="auto"
                  />
                  <div v-else class="text-label font-weight-black" v-text="userInfo.IDCardNumber"/>
                </transition>
              </v-col>
            </v-row>

            <v-divider class="form-divider"/>

            <!-- Home Address -->
            <v-row no-gutters align="center">
              <v-col cols="3" class="text-label">Home Address</v-col>
              <transition mode="out-in">
                <v-col v-if="edit" key="1" cols="9">
                    <v-textarea
                      v-model="userInfo.Address"
                      outlined dense clearable
                      label="Street & N°"
                      hide-details="auto"
                      rows="2"
                    />
                    <div class="d-flex my-1 align-center">
                      <v-row no-gutters>
                        <v-col cols="6" class="pe-1">
                          <v-select
                          v-model="userInfo.Country"
                          outlined dense
                          label="Country"
                          hide-details="auto"
                          :items="Object.keys(countryCitySelItems)"
                          />
                        </v-col>
                        <v-col cols="6" class="px-1">
                          <v-select
                            v-model="userInfo.City"
                            outlined dense
                            label="City"
                            hide-details="auto"
                            :disabled="!userInfo.Country"
                            :items="countryCitySelItems[userInfo.Country]"
                          />
                        </v-col>
                      </v-row>
                      <v-btn
                        v-show="userInfo.City || userInfo.Country" icon
                        @click="userInfo.City = null; userInfo.Country = null;"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                </v-col>
                <v-col v-else key="2" cols="9" class="text-label font-weight-black" >
                  <div v-text="userInfo.Address"/>
                  <div v-text="userInfo.City + ', ' + userInfo.Country"/>
                </v-col>
              </transition>
            </v-row>

            <!-- Roles -->
            <transition mode="out-in">
              <v-row v-if="!edit" no-gutters align="center">

                <v-col cols="12"><v-divider class="form-divider"/></v-col>

                <v-col cols="3" class="text-label">Roles</v-col>

                  <v-col cols="9" class="d-flex text-label font-weight-black white--text" >
                    <div v-if="userInfo.EmployeeID" class="indigo px-2 rounded-lg me-1">Archipelago</div>
                    <div v-if="userInfo.IsVerified" class="blue px-2 rounded-lg me-1">Student</div>
                    <div v-if="userInfo.IsTeacher" class="red px-2 rounded-lg me-1">Teacher</div>
                    <div v-if="userInfo.IsHRManager" class="green px-2 rounded-lg me-1">HR</div>
                  </v-col>

              </v-row>
            </transition>

          </v-col>

          <!-- RIGHT COLUMN -->
          <v-col cols="12" md="4" class="mt-3">

            <image-compressor
              v-show="false"
              ref="compressor"
              :done="getFiles"
              :scale="imageData.scale"
              :quality="imageData.quality"
            />

            <!-- Profile Picture -->
            <v-responsive aspect-ratio="1" class="rounded-lg" style="position: relative;">

              <!-- Image Browse & Upload Buttons -->
              <transition mode="out-in">

                <div v-if="edit"
                  key="1"
                  class="pa-1"
                  style="position: absolute; bottom: 0; z-index: 0; width: 100%;"
                >

                  <v-btn
                    class="text-h6 white--text"
                    color="orange"
                    :disabled="uploading"
                    @click="getImage"
                  >
                    <v-icon class="me-1">mdi-folder</v-icon>
                    Browse
                  </v-btn>

                  <transition mode="out-in">
                    <v-btn v-if="imageData.img"
                      width="128"
                      color="success"
                      class="text-h6 ms-1"
                      :loading="uploading"
                      @click="uploadImage"
                    >
                      <v-icon class="me-1">mdi-upload</v-icon>
                      Upload
                    </v-btn>
                  </transition>

                </div>
                <!-- Out-In Transition Dummy -->
                <div v-else key="2"/>
              </transition>

              <transition mode="out-in">

                <!-- Image to Upload -->
                <v-img v-if="imageData.img"
                  :key="imageData.original.name" fluid
                  fill-height
                  aspect-ratio="1"
                  position="top"
                  :src="imageData.img"
                />

                <!-- User Image -->
                <v-img v-else-if="userInfo.picture" :src="userInfo.picture"/>

                <!-- No Image -->
                <v-container v-else
                  fill-height
                  class="flex-column justify-center align-center secondary text-h4 font-weight-bold white--text"
                >
                  <v-icon class="text-h1 white--text">mdi-account</v-icon>
                  No Image
                </v-container>

              </transition>

            </v-responsive>

            <transition mode="out-in">
              <v-progress-linear v-if="uploading" class="mt-1 rounded-lg" :value="uploadProgress"/>
            </transition>

          </v-col>

        </v-row>

      </v-form>
    </transition>

  </div>
</template>

<script>
import ImageCompressor from '../../components/ImageCompressor'

export default {

  components: {
    ImageCompressor
  },
  props: ['user'],

  data() {
    return {
      loading: true,

      edit: false,
      valid: false,

      rules: {
        required: [value => !!value || 'Required.']
      },

      birthDate: null,

      countryCitySelItems: {},

      imageData: {
        img: null,
        scale: 100,
        quality: 50,
        originalSize: true,
        original: {},
        compressed: {}
      },

      userInfo: _.cloneDeep(this.user),

      uploadProgress: 0,
      uploading: false,
      saving: false
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      this.getCountryCities()
    },

    async getCountryCities() {
      await fetch('https://countriesnow.space/api/v0.1/countries')
      .then(res => res.json())
      .then(data => {
        this.loading = false
        // Map Data Array to Object of Arrays like { country: cities[], ... }
        this.countryCitySelItems = data.data.reduce((o, i) => (o[i.country] = i.cities, o), {})
      })
      .catch(err => {
        this.loading = false
        this.showToast('error', ['Error getting Countries and Cities.', err.message])
      })
    },

    // Image Compressor
    getImage() { this.$refs.compressor.$el.click() },
    getFiles(obj) {
      this.imageData.img = obj.compressed.blob
      this.imageData.original = obj.original
      this.imageData.compressed = obj.compressed
    },

    // Reset Form on Edit Cancel
    resetUserInfo() {
      this.userInfo = _.cloneDeep(this.user)
      this.edit = false
      this.imageData.img = null
    },

    async uploadImage() {
      this.uploading = true
      const fileName = this.setName(this.imageData.original.name)
      // IMAGE UPLOAD
    },

    setName(name) {
      name = + new Date() + '_' + (name.substring(0, name.lastIndexOf('.')) || name)

      return {
        original: name + '.jpg',
        small: name + '_small.jpg'
      }
    },

    async editUserInfo() {
      this.saving = true

      await fetch(
        this.dbPathUrl(['user', this.user.ID]),
        {
          method: 'PUT',
          headers: this.dbAuthHeaders,
          // Array w/ single user (endpoint accepts multiple)
          body: JSON.stringify([{
            ...this.userInfo,
            // Form Date Format String to Query Date Format String
            Birth: this.formatDateTime(this.userInfo.Birth)
          }])
        }
      )
      .then(res => {
        this.saving = false
        this.edit = false
        this.$emit('refreshUser', this.userInfo)
        this.showToast('success', 'User Information updated.')
      })
      .catch(err => {
        this.showToast('error', ['Error updating User Information.', err.message])
      })
    }

    // async addUser() {
    //   try {
    //     const res = await fetch(this.dbPathUrl(['user']), {
    //       method: 'POST',
    //       headers: this.dbAuthHeaders,
    //       body: JSON.stringify([this.getUserEdited()])
    //     })
    //     if (!res.ok) {
    //       this.showToast('error', ['Error creating user.', res.status, res.statusText])
    //     }
    //     // const data = await res.json()
    //     this.showToast('success', ['User created.', res.status, res.statusText])
    //   } catch (err) {
    //     this.showToast('error', ['Error creating user.', err.message])
    //   }
    // },

  }
}
</script>

<style scoped>
</style>
