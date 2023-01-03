<template>
  <div>
    <!-- Mobile Title -->
    <div class="d-sm-none">
      <div class="text-h4 primary--text font-weight-bold mx-2 mt-3">Education</div>
      <v-divider/>
    </div>

    <!-- Education History -->
    <!-- Schools Input Form -->
    <transition appear mode="out-in">
      <progress-circular v-if="loading"/>
      <div v-else>

        <div v-if="sortedUserEdus.length" class="d-flex flex-column flex-sm-row">

          <div class="d-flex flex-wrap text-center justify-space-around">
            <div class="d-flex flex-column flex-md-row align-center red--text ma-2">
              <div class="font-weight-bold text-h4 text-md-h3 me-md-2" v-text="eduTimes.count"/>
              <div class="font-weight-bold text-h6 text-md-start my-auto" style="line-height: normal;">Educations</div>
            </div>
            <div class="d-flex flex-column flex-md-row align-center blue--text ma-2">
              <div class="font-weight-bold text-h4 text-md-h3 me-md-2" v-text="eduTimes.total"/>
              <div class="font-weight-bold text-h6 text-md-start my-auto" style="line-height: normal;">Education<br/>Years</div>
            </div>
            <div class="d-flex flex-column flex-md-row align-center green--text ma-2">
              <div class="d-flex align-end me-md-2">
                <div class="font-weight-bold text-h4 text-md-h3 me-1" v-text="Math.round(eduTimes.average)"/>
                <div class="font-weight-bold text-h6">/ 100</div>
              </div>
              <div class="font-weight-bold text-h6 text-md-start my-auto" style="line-height: normal;">Average<br/>Grade</div>
            </div>
          </div>

          <div class="flex-grow-1">
            <apexchart
              type="bar"
              height="192"
              :options="chartOptions"
              :series="sortedChartSeries"
            />
          </div>

        </div>

        <v-divider/>

        <v-timeline align-top dense class="ms-md-2 pt-3 pt-md-4 pe-2 pe-md-4">

          <transition-group appear>
            <!-- Add Education -->
            <v-timeline-item
              key="newEdu"
              small color="green"
              class="pb-3 pb-md-4"
              :hide-dot="!newEduModes.edit"
            >
              <transition mode="out-in">
                <v-form v-if="newEduModes.edit" v-model="newEduModes.valid"
                  class="ms-md-2"
                >
                  <!-- School Name -->
                  <v-text-field v-model="newEdu.SchoolName"
                    outlined dense
                    label="School Name *"
                    hide-details="auto"
                    class="mb-1"
                    :rules="rules.required"
                  />
                  <v-row no-gutters class="mb-1">
                    <!-- Education Level -->
                    <v-col cols="12" md="6" class="pe-md-1 mb-1 mb-md-0">
                      <v-select v-model="newEdu.EducationLevel"
                        outlined dense
                        label="Level / Degree *"
                        hide-details="auto"
                        item-text="text"
                        item-value="value"
                        :items="eduLevelsSelItems"
                        :rules="rules.required"
                      />
                    </v-col>
                    <!-- Grade -->
                    <v-col cols="12" md="6" class="ps-md-1">
                      <v-text-field v-model="newEdu.GPA"
                        outlined dense
                        label="Grade"
                        hide-details="auto"
                        type="number"
                        :rules="rules.isGPA"
                      />
                    </v-col>
                  </v-row>
                  <!-- Period -->
                  <v-row no-gutters class="mb-1">
                    <v-col cols="6" class="pe-1">
                      <v-text-field v-model="newEdu.StartYear"
                        outlined dense
                        label="Start Year *"
                        hide-details="auto"
                        type="number"
                        :rules="rules.isStartYear"
                      />
                    </v-col>
                    <v-col cols="6" class="ps-1">
                      <v-text-field v-model="newEdu.EndYear"
                        outlined dense
                        label="End Year"
                        hide-details="auto"
                        type="number"
                        :rules="rules.isEndYear"
                      />
                    </v-col>
                  </v-row>
                  <!-- Edit Buttons -->
                  <div class="d-flex align-center">
                    <v-btn
                      color="green"
                      class="white--text text-h6 me-1"
                      :disabled="!newEduModes.valid"
                      :loading="newEduModes.saving"
                      @click="addNewEducation"
                    >
                      <v-icon class="me-1">mdi-content-save</v-icon>
                      Save
                    </v-btn>
                    <v-btn
                      color="secondary"
                      class="text-h6 mx-1"
                      :disabled="newEduModes.saving"
                      @click="resetNewEducation"
                    >
                      Cancel
                    </v-btn>
                    <div class="ms-1 text--secondary">* Required</div>
                  </div>
                </v-form>
                <v-btn v-else
                  color="green"
                  class="text-h6 white--text ms-md-2"
                  @click="newEduModes.edit = true"
                >
                  <v-icon class="me-1">mdi-plus</v-icon>
                  Add
                </v-btn>
              </transition>
            </v-timeline-item>

            <!-- User Education -->
            <v-timeline-item v-for="edu in sortedUserEdus"
              :key="edu.ID"
              small
              class="pb-3 pb-md-4"
              :color="userEdusModes[edu.ID].edit ? 'orange' : chartColorsNames[eduColors[edu.ID]]"
            >
              <transition mode="out-in">
                <!-- Edit Form -->
                <v-form v-if="userEdusModes[edu.ID].edit" v-model="userEdusModes[edu.ID].valid"
                  class="ms-md-2"
                >
                  <!-- School Name -->
                  <v-text-field v-model="edu.SchoolName"
                    outlined dense
                    label="School Name *"
                    hide-details="auto"
                    class="mb-1"
                    :rules="rules.required"
                  />
                  <v-row no-gutters class="mb-1">
                    <!-- Education Level -->
                    <v-col cols="12" md="6" class="pe-md-1 mb-1 mb-md-0">
                      <v-select v-model="edu.EducationLevel"
                        outlined dense
                        label="Level / Degree *"
                        item-text="text"
                        item-value="value"
                        hide-details="auto"
                        :items="eduLevelsSelItems"
                        :rules="rules.required"
                      />
                    </v-col>
                    <!-- Grade -->
                    <v-col cols="12" md="6" class="ps-md-1">
                      <v-text-field v-model="edu.GPA"
                        outlined dense
                        label="Grade"
                        hide-details="auto"
                        type="number"
                        :rules="rules.isGPA"
                      />
                    </v-col>
                  </v-row>
                  <!-- Period -->
                  <v-row no-gutters class="mb-1">
                    <v-col cols="6" class="pe-1">
                      <v-text-field v-model="edu.StartYear"
                        outlined dense
                        label="Start Year *"
                        hide-details="auto"
                        :rules="rules.isStartYear"
                      />
                    </v-col>
                    <v-col cols="6" class="ps-1">
                      <v-text-field v-model="edu.EndYear"
                        outlined dense
                        label="End Year"
                        hide-details="auto"
                        :rules="rules.isEndYear"
                      />
                    </v-col>
                  </v-row>
                  <!-- Edit Buttons -->
                  <div class="d-flex align-center">
                    <v-btn
                      color="green"
                      class="white--text text-h6 me-1"
                      :disabled="!userEdusModes[edu.ID].valid"
                      :loading="userEdusModes[edu.ID].saving"
                      @click="editEducation(edu.ID)"
                    >
                      <v-icon class="me-1">mdi-content-save</v-icon>
                      Save
                    </v-btn>
                    <v-btn
                      color="secondary"
                      class="text-h6 mx-1"
                      :disabled="userEdusModes[edu.ID].saving"
                      @click="resetEducation(edu.ID)"
                    >
                      Cancel
                    </v-btn>
                    <div class="ms-1 text--secondary">* Required</div>
                  </div>
                </v-form>
                <!-- Info Display -->
                <div v-else class="ms-md-2">
                  <div class="d-flex align-start">
                    <!-- School Name -->
                    <div
                      class="text-h6"
                      style="line-height: normal; margin-bottom: 4px;"
                      v-text="edu.SchoolName"
                    />

                    <v-spacer/>

                    <!-- Edit Buttons -->
                    <v-btn
                      icon small color="orange"
                      class="me-1"
                      @click="userEdusModes[edu.ID].edit = true"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon small color="red"
                      @click="deleteEducation(edu.ID)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>

                  <div>
                    <!-- Level · Grade -->
                    <div class="d-flex">
                      <!-- Education Level -->
                      <div v-if="edu.EducationLevel !== 'other'"
                        class="text-h7"
                        v-text="eduLevelsNames[edu.EducationLevel]"
                      />
                      <!-- Dot Separator -->
                      <div v-if="edu.EducationLevel !== 'other' && (edu.GPA && edu.GPA > 0)"
                        class="mx-1 font-weight-black" v-text="'·'"
                      />
                      <!-- Grade -->
                      <div v-if="edu.GPA && edu.GPA > 0"
                        class="text-h7"
                        v-text="edu.GPA + ' / 100'"
                      />
                    </div>
                    <!-- Period -->
                    <div
                      class="d-flex text-h7 text--secondary"
                      v-html="formatDurationYears(edu.StartYear, edu.EndYear)"
                    />
                  </div>
                  <v-divider class="mt-1"/>
                </div>

              </transition>
            </v-timeline-item>

          </transition-group>

        </v-timeline>
      </div>
    </transition>

  </div>
</template>

<script>

export default {
  props: ['user'],

  data() {
    return {
      loading: true,

      eduLevelsNames: {
        smp:    'Junior High School',
        sma:    'High School',
        s1:     'Bachelor / Associate',
        s2:     'Master',
        other:  'Other'
      },

      // Form Select Input Items
      eduLevelsSelItems: [
        { 'value':  'smp',    'text':   'Junior High School' },
        { 'value':  'sma',    'text':   'High School' },
        { 'value':  's1',     'text':   'Bachelor / Associate' },
        { 'value':  's2',     'text':   'Master' },
        { 'value':  'other',  'text':   'Other' }
      ],

      // DB Fetch and Form contents
      userEdus: {
        // education: {
        //   ID: '',
        //   UserID: '',
        //   EducationLevel: 'smp',
        //   SchoolName: '',
        //   StartYear: '',
        //   EndYear: '',
        //   GPA: 0.0
        // }
      },

      // Deep Copy of DB Fetch, for Forms reset
      userEdusOriginal: {},

      // Edit, Valid & Loading states of each User Education Form
      userEdusModes: {
        // education: {
        //   edit: false,
        //   valid: true,
        //   saving: false
        // }
      },

      // New Education Form contents
      newEdu: null,

      // New Education Form reset contents
      newEduOriginal: {
        // ID: crypto.randomUUID()
        UserID: this.user.ID,
        EducationLevel: null,
        SchoolName: null,
        StartYear: null,
        EndYear: null,
        GPA: null
      },

      // Edit, Valid & Loading states of new Education Form
      newEduModes: {
        edit: false,
        valid: false,
        saving: false
      },

      // Form Input validations
      rules: {
        required: [value => !!value || 'Required.'],

        isStartYear: [ // Required and must be in range
          v => !!v || 'Required.',
          v => v >= 1900 || 'Too late',
          v => v <= new Date().getFullYear() || 'Too late'
        ],
        isEndYear: [ // Not required, but must be in range if not null
          v => (v && v <= 1900) ? 'Too late' : true,
          v => (v && v > new Date().getFullYear()) ? 'Too early' : true
        ],
        isGPA: [ // Not required, but must be in range if not null
          v => (v && v < 0) ? 'Too low' : true,
          v => (v && v > 100) ? 'Too high' : true
        ]
      },

      // Display colors
      chartColorsHex: ['#008FFB', '#1DE9B6', '#E040FB', '#FFC107', '#F44336'], // For Chart
      chartColorsNames: ['blue', 'teal accent-3', 'purple accent-2', 'amber', 'red'], // For Timeline

      // Index of each Work to Color Charts
      eduColors: {
        // eduID: 2    -> chartColorsHex[2], chartColorsNames[2]
      },

      // Chart Properties
      chartOptions: {
        chart: {
          type: 'category',
          toolbar: {
            show: false,
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: { hideOverflowingLabels: false }
          }
        },
        dataLabels: {
          enabled: false,
          style: { colors: ['#f3f4f5', '#fff'] }
        },
        xaxis: { labels: { show: false } },
        grid: {
          row: {
            colors: ['#f3f4f5', '#fff'],
            opacity: 1
          }
        },
        tooltip: {
          y: {
            title: {
              formatter: () => 'Grade:'
            }
          }
        }
      },
    }
  },

  computed: {
    // Sorted User Edus for display
    sortedUserEdus() {
      // Object of Educations to Sorted Array of Educations
      return Object.values(this.userEdus).sort((a, b) => b.StartYear - a.StartYear)
    },

    sortedChartSeries() {
      return [{
        data: [...this.sortedUserEdus].reverse().map((edu, i) => { return {
          x: edu.SchoolName,
          y: edu.GPA,
          fillColor: this.chartColorsHex[this.eduColors[edu.ID]]
        }})
      }]
    },

    eduTimes() {
      const edus = Object.values(this.userEdus)
      const count = edus.length
      const grades = []

      let total = 0, overlap = 0

      // Iterate between two educations and find period overlaps
      edus.forEach((e1, i) => {
        const
          e1Start = e1.StartYear,
          e1End = e1.EndYear || new Date().getFullYear()

        total += e1End - e1Start

        // Subtract overlaps if any
        if (i !== count - 1) { // In bounds check
          const
            e2 = edus[i + 1],
            e2Start = e2.StartYear,
            e2End = e2.EndYear || new Date().getFullYear()

          overlap += Math.max(0, Math.min(e1End, e2End) - Math.max(e1Start, e2Start) + 1)
        }

        e1.GPA && grades.push(e1.GPA)
      })

      return {
        count,
        average: grades.reduce((a, b) => a + b) / grades.length,
        total: total - overlap,
      }
    }
  },

  created() {
    // this.initialize()
    this.getUserEdus()
    this.newEdu = _.cloneDeep(this.newEduOriginal)
  },

  methods: {
    // async initialize() { this.getUserEdus() },

    async getUserEdus() {
      await fetch(
        this.dbPathUrl(['education', 'user', this.user.ID]),
        { headers: this.dbAuthHeaders }
      )
      .then(res => res.json())
      .then(data => {
        this.loading = false

        data.forEach((edu, i) => {
          // Parse Years, also null case for EndYear
          const EndYear = parseInt(edu.EndYear)
          const GPA = parseFloat(edu.GPA)

          // Save into object of objects
          this.$set(this.userEdus, edu.ID, {
            ...edu,
            StartYear:  parseInt(edu.StartYear),
            EndYear:    EndYear > 1 ? EndYear : null,
            GPA:        GPA || null
          })
          // Set Edit, Valid & Saving modes for each Education Form
          this.$set(this.userEdusModes, edu.ID, {
            edit: false, valid: true, saving: false
          })
          // Set Color for Chart and Timeline Items
          this.$set(this.eduColors, edu.ID, i % this.chartColorsHex.length)
        })
        // Save deep clone of all Educations for Forms reset
        this.userEdusOriginal = _.cloneDeep(this.userEdus)
      })
      .catch(err => {
        this.loading = false
        this.showToast('error', ['Error getting User Education History.', err.message])
      })
    },

    resetNewEducation() {
      this.newEdu = _.cloneDeep(this.newEduOriginal)
      this.newEduModes.edit = false
    },

    async addNewEducation() {
      // Make new ID for new Education
      const ID = crypto.randomUUID()
      const newEdu = { ..._.cloneDeep(this.newEdu), ID }

      // ######## ADD QUERY BELOW (convert Year Int to Date)
      //

      // Add to Array, make modes, clone original too
      this.$set(this.userEdus, ID, newEdu)
      this.$set(this.userEdusModes, ID, {
        edit: false, valid: true, saving: false
      })
      this.userEdusOriginal[ID] = _.cloneDeep(newEdu)
      this.resetNewEducation()
    },

    resetEducation(id) {
      this.userEdus[id] = _.cloneDeep(this.userEdusOriginal[id])
      this.userEdusModes[id].edit = false
    },

    async editEducation(id) {
      this.userEdusModes[id].saving = true
      this.userEdusOriginal[id] = _.cloneDeep(this.userEdus[id])

      // ######## EDIT QUERY BELOW
      //

      this.userEdusModes[id].saving = false
      this.userEdusModes[id].edit = false
    },

    async deleteEducation(id) {
      if (confirm('Are you sure?')) {
        // Delete
        this.$delete(this.userEdus, id)
        this.$delete(this.userEdusOriginal, id)

        // ######## DELETE QUERY BELOW
        //
      }
    }
  }
}
</script>

<style scoped>
</style>
