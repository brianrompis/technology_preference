<template>
  <div>
    <div class="text-h3">Classes</div>

    <div class="text-h5 py-3 text--secondary">
      Work in progress: Student Classes
    </div>

    <!-- Department List -->
    <v-item-group>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            class="pa-0"
          >
            <v-item
              v-for="dept in department"
              v-slot="{ active, toggle }"
              :key="dept.id"
            >
              <v-chip
                :color="active ? 'primary' : ''"
                class="ma-1 font-weight-medium"
                @click="toggle"
              >
                <v-container
                  class="pa-0"
                  @click="selectDepartment(dept.id, active)"
                >
                  {{ dept.name }}
                </v-container>
              </v-chip>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <!-- end of Department List -->
    <!-- Loading Icon -->
    <v-progress-circular
      v-if="loadingData"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <!-- end of Loading Icon -->
    <!-- Classrooms -->
    <v-row v-else>
      <v-col cols="6">
        <!-- Class List -->
        <v-item-group>
          <v-container>
            <v-row>
              <v-col
                v-for="classroom in classrooms"
                :key="classroom.id"
                cols="12"
                class="mb-3 pa-0"
              >
                <v-item v-slot="{ active, toggle }">
                  <v-card
                    :color="active ? 'primary' : ''"
                    class="pa-2 d-flex align-center"
                    @click="selectClassroom(classroom)"
                  >
                    <v-row class="pa-0 ma-0" justify="center" align="center">
                      <v-col cols="11" class="pa-0 ma-0">
                        <h4>{{ classroom.Name }}</h4>
                        {{ classroom.Section }}
                      </v-col>
                      <v-col cols="1" class="pa-0 ma-0" align="center">
                        <v-icon
                          color="primary"
                          @click="goToGoogleClassroom(classroom.AlternateLink)"
                        >mdi-open-in-new</v-icon>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
        <!-- end of Class List -->
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6">
      <!-- show class detail -->
        <v-container
          v-if="selectedClassroom.Id"
        >
          <h3>{{ selectedClassroom.Name }}</h3>
          <p> {{ selectedClassroom.Description }}</p>
          <p> Topics: </p>
          <v-row v-if="selectedClassroom.Topics" class="pa-0">
            <v-col
              v-for="topic in selectedClassroom.Topics"
              :key="topic.Id"
              cols="12"
              class="ma-0 pb-0"
            >
              <p>{{ topic.Name }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" align="center" class="pa-0 ma-0">
              <v-btn color="primary" width="100" @click="goToGoogleClassroom(selectedClassroom.AlternateLink)">ENTER</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <!-- end of Classrooms -->
  </div>
</template>

<script>
import DB from '../configs/db'

export default {
  data: () => ({
    department: [
      {
        id: 0,
        name: 'None'
      },
      {
        id: 1,
        name: 'All'
      },
      {
        id: 2,
        name: 'Information Technology'
      },
      {
        id: 3,
        name: 'Front Office'
      },
      {
        id: 4,
        name: 'Engineering'
      },
      {
        id: 5,
        name: 'Housekeeping'
      },
      {
        id: 6,
        name: 'FB Product'
      },
      {
        id: 7,
        name: 'FB Service'
      },
      {
        id: 8,
        name: 'Sales & Marketing'
      },
      {
        id: 9,
        name: 'Human Resource'
      },
      {
        id: 10,
        name: 'Accounting'
      }
    ],
    classrooms: [],
    selectedClassroom: {
      Id: null,
      Name: '',
      Section: null,
      DescriptionHeading: '',
      Description: '',
      Topics: [],
      AlternateLink: ''
    },
    loadingData: false,

    alert_snakebar: false,
    alertText: '',
    alertMode: 'error'
  }),

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      this.loadingData = true
      this.classrooms = await this.getClasses()
      this.loadingData = false
      this.selectedClassroom = this.classrooms[0]
    },
    async getClasses() {
      try {
        const headers = new Headers()
        const userData = window.btoa(unescape(encodeURIComponent(DB.username + ':' + DB.password)))

        headers.append('Authorization', 'Basic ' + userData)

        const res = await fetch(DB.baseUrl + '/classes', {
          headers: headers
        })

        if (!res.ok) {
          console.log('Error getting classroom list', res.status)
          console.log(res.statusText)
          this.alertMode = 'error'
          this.alertText = 'Error getting classroom list. ' + res.statusText
          this.alert_snakebar = true
        }
        const data = await res.json()
        const result = {
          status: res.status + '-' + res.statusText,
          headers: {
            'Content-Type': res.headers.get('Content-Type'),
            'Content-Length': res.headers.get('Content-Length')
          },
          length: res.headers.get('Content-Length'),
          data: data
        }

        this.result = this.formatResponse(result)
        if (result.data) {
          console.log(result.data)

          return result.data
        }

        return null
      } catch (err) {
        this.result = err.message
        this.alertMode = 'error'
        this.alertText = 'Error getting classroom list ' + this.result
        this.alert_snakebar = true

        return null
      }
    },
    formatResponse(res) {
      return JSON.stringify(res, null, 2)
    },
    selectDepartment(id, active) {
      if (!active) {
        console.log(id)
      }
    },
    selectClassroom(course) {
      this.selectedClassroom = course
    },
    goToGoogleClassroom(url) {
      window.open(url)
    }
  }
}
</script>

<style>

</style>
