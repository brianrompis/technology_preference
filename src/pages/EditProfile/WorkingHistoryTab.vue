<template>
  <div>
    <!-- Mobile Title -->
    <div class="d-sm-none">
      <div class="text-h4 primary--text font-weight-bold mx-2 mt-2">Career</div>
      <v-divider/>
    </div>

    <transition appear mode="out-in">
      <progress-circular v-if="loading"/>
      <div v-else>

        <div v-if="sortedUserWorks.length">

          <div class="d-flex flex-wrap text-center justify-space-around pt-2">
            <div class="d-flex flex-column flex-md-row align-center red--text mx-1 mt-1">
              <div class="font-weight-bold text-h4 text-md-h3 me-md-2" v-text="workTimes.count"/>
              <div class="font-weight-bold text-h6 text-md-start my-auto" style="line-height: normal;">Positions</div>
            </div>
            <div class="d-flex flex-column flex-md-row align-center blue--text mx-1 mt-1">
              <div class="font-weight-bold text-h4 text-md-h3 me-md-2" v-text="roundWithString(workTimes.total / 365, '+')"/>
              <div class="font-weight-bold text-h6 text-md-start my-auto" style="line-height: normal;">Work<br/>Years</div>
            </div>
            <div class="d-flex flex-column flex-md-row align-center green--text mx-1 mt-1">
              <div class="font-weight-bold text-h4 text-md-h3 me-md-2" v-text="roundWithString(workTimes.average / 365, '+')"/>
              <div class="font-weight-bold text-h6 text-md-start my-auto" style="line-height: normal;">Average<br/>Years</div>
            </div>
            <div class="d-flex flex-column flex-md-row align-center indigo--text mx-1 mt-1">
              <div class="d-flex align-center">
                <v-progress-circular
                  :value="workTimes.archi"
                  width="16"
                  rotate="-90"
                  class="me-md-2 me-1"
                />
                <div class="font-weight-bold text-h4 text-md-h3 me-sm-1" v-text="workTimes.archi + '%'"/>
              </div>
              <div class="font-weight-bold text-h6 text-md-start my-auto" style="line-height: normal;">With<br/>Archipelago</div>
            </div>
          </div>

          <apexchart
            type="rangeBar"
            height="192"
            :options="chartOptions"
            :series="sortedChartSeries"
            class="mx-2"
          />

          <v-divider/>

        </div>

        <v-timeline align-top dense class="ms-md-2 pt-3 pt-md-4 pe-2 pe-md-4">
          <transition-group appear>

            <!-- Add Work -->
            <v-timeline-item
              key="newWork"
              small color="green"
              class="pb-3 pb-md-4"
              :hide-dot="!newWorkModes.edit"
            >
              <transition mode="out-in">
                <v-form v-if="newWorkModes.edit" v-model="newWorkModes.valid"
                  class="d-flex flex-column ms-md-2"
                >
                  <!-- Position -->
                  <v-text-field v-model="newWork.Position"
                    outlined dense
                    label="Position *"
                    hide-details
                    class="mb-1"
                    :rules="rules.required"
                  />
                  <!-- Company Name -->
                  <v-text-field v-model="newWork.CompanyName"
                    outlined dense
                    label="Company Name *"
                    hide-details
                    class="mb-1"
                    :rules="rules.required"
                  />
                  <!-- Trade Name -->
                  <v-text-field v-model="newWork.CompanyPublicName"
                    outlined dense
                    label="Company Trade Name"
                    hide-details
                    class="mb-1"
                  />
                  <div class="d-flex mb-1">
                    <!-- Start Date -->
                    <v-menu v-model="newWorkModes.modelStartDate"
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="newWork.StartDate"
                          outlined dense readonly
                          label="Start Date *"
                          hide-details
                          prepend-inner-icon="mdi-calendar"
                          class="me-1"
                          :rules="rules.required"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="newWork.StartDate"/>
                    </v-menu>
                    <!-- End Date -->
                    <v-menu v-model="newWorkModes.modelEndDate"
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="newWork.EndDate"
                          outlined dense readonly
                          label="End Date"
                          hide-details
                          prepend-inner-icon="mdi-calendar"
                          class="ms-1"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="newWork.EndDate"/>
                    </v-menu>
                  </div>
                  <!-- City -->
                  <v-text-field v-model="newWork.City"
                    outlined dense
                    label="City *"
                    hide-details
                    class="mb-1"
                    :rules="rules.required"
                  />
                  <!-- Description -->
                  <v-textarea
                    v-model="newWork.Description" outlined
                    dense
                    label="Description"
                    hide-details
                    rows="2"
                    class="mb-1"
                  />
                  <!-- Create Buttons -->
                  <div class="d-flex align-center">
                    <v-btn
                      color="green"
                      class="white--text text-h6 me-1"
                      :disabled="!newWorkModes.valid"
                      :loading="newWorkModes.saving"
                      @click="addNewWork"
                    >
                      <v-icon class="me-1">mdi-content-save</v-icon>
                      Save
                    </v-btn>
                    <v-btn
                      color="secondary"
                      class="text-h6 mx-1"
                      :disabled="newWorkModes.saving"
                      @click="resetNewWork"
                    >
                      Cancel
                    </v-btn>
                    <div class="ms-1 text--secondary">* Required</div>
                  </div>
                </v-form>
                <v-btn v-else
                  color="green"
                  class="text-h6 white--text ms-md-2"
                  @click="newWorkModes.edit = true"
                >
                  <v-icon class="me-1">mdi-plus</v-icon>
                  Add
                </v-btn>
              </transition>
            </v-timeline-item>

            <!-- User Work -->
            <v-timeline-item v-for="work in sortedUserWorks"
              :key="work.ID" small
              class="pb-3 pb-md-4"
              :color="userWorksModes[work.ID].edit ? 'orange' : chartColorsNames[workColors[work.ID]]"
            >
              <transition mode="out-in">
                <v-form v-if="userWorksModes[work.ID].edit" v-model="userWorksModes[work.ID].valid"
                  class="ms-md-2"
                >
                  <!-- Position -->
                  <v-text-field v-model="userWorks[work.ID].Position"
                    outlined dense
                    label="Position *"
                    hide-details
                    class="mb-1"
                    :rules="rules.required"
                  />
                  <!-- Company Name -->
                  <v-text-field v-model="userWorks[work.ID].CompanyName"
                    outlined dense
                    label="Company Name *"
                    hide-details
                    class="mb-1"
                    :rules="rules.required"
                  />
                  <!-- Trade Name -->
                  <v-text-field v-model="userWorks[work.ID].CompanyPublicName"
                    outlined dense
                    label="Company Trade Name"
                    hide-details
                    class="mb-1"
                  />
                  <div class="d-flex mb-1 align-center">
                    <v-switch v-model="userWorks[work.ID].IsArchipelago"
                      hide-details class="ma-0"
                    />
                    <div class="ms-1">Part of Archipelago</div>
                    <v-divider vertical class="mx-2"/>
                    <v-text-field v-model="userWorks[work.ID].HotelID"
                      outlined dense hide-details
                      label="Hotel / Office"
                      :disabled="!userWorks[work.ID].IsArchipelago"
                    />
                  </div>
                  <div class="d-flex mb-1">
                    <!-- Start Date -->
                    <v-menu v-model="userWorksModes[work.ID].modelStartDate"
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="userWorks[work.ID].StartDate"
                          outlined dense readonly
                          label="Start Date *"
                          hide-details
                          prepend-inner-icon="mdi-calendar"
                          class="me-1"
                          :rules="rules.required"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="userWorks[work.ID].StartDate"/>
                    </v-menu>
                    <!-- End Date -->
                    <v-menu v-model="userWorksModes[work.ID].modelEndDate"
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="userWorks[work.ID].EndDate"
                          outlined dense readonly clearable
                          label="End Date"
                          hide-details
                          prepend-inner-icon="mdi-calendar"
                          class="ms-1"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="userWorks[work.ID].EndDate"/>
                    </v-menu>
                  </div>
                  <!-- City -->
                  <v-text-field v-model="userWorks[work.ID].City"
                    outlined dense
                    label="City *"
                    hide-details
                    class="mb-1"
                    :rules="rules.required"
                  />
                  <!-- Description -->
                  <v-textarea
                    v-model="userWorks[work.ID].Description" outlined
                    dense clearable
                    label="Description *"
                    hide-details
                    rows="2"
                    class="mb-1"
                  />
                  <!-- Edit Buttons -->
                  <div class="d-flex align-center">
                    <v-btn
                      color="green"
                      class="white--text text-h6 me-1"
                      :disabled="!userWorksModes[work.ID].valid"
                      :loading="userWorksModes[work.ID].saving"
                      @click="editWork(work.ID)"
                    >
                      <v-icon class="me-1">mdi-content-save</v-icon>
                      Save
                    </v-btn>
                    <v-btn
                      color="secondary"
                      class="text-h6 mx-1"
                      @click="resetWork(work.ID)"
                    >
                      Cancel
                    </v-btn>
                    <div class="ms-1 text--secondary">* Required</div>
                  </div>
                </v-form>
                <!-- Info Display -->
                <div v-else class="ms-md-2">
                  <div class="d-flex align-start">
                    <div>
                      <!-- Position -->
                      <div
                        class="text-h6"
                        style="line-height: normal;"
                        v-text="work.Position"
                      />
                      <!-- Company Name -->
                      <div class="d-flex mb-1">
                        <div
                          class="text-h7 font-weight-bold"
                          style="line-height: normal;"
                          v-text="work.CompanyName"
                        />
                        <div
                          class="text-h7"
                          style="line-height: normal;"
                        >&nbsp;({{work.CompanyPublicName}})</div>
                        <v-chip v-if="work.IsArchipelago"
                          x-small color="indigo" text-color="white"
                          class="mx-2"
                          :ripple="false"
                        >
                          Archipelago
                        </v-chip>
                      </div>
                    </div>
                    <v-spacer/>
                    <v-btn
                      icon small color="orange"
                      class="me-1"
                      @click="userWorksModes[work.ID].edit = true"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon small color="red"
                      @click="deleteWork(work.ID)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>

                  </div>

                  <!-- Period -->
                  <div
                    class="d-flex text-h7 text--secondary"
                  >
                    {{ formatDateMonthYear(work.StartDate) }} — {{ work.EndDate ? formatDateMonthYear(work.EndDate) : 'Present' }}
                    <div class="mx-1 font-weight-black" v-text="'·'"/>
                    {{ formatDuration(work.StartDate, work.EndDate) }}
                  </div>
                  <!-- Location -->
                  <div
                    class="text-h7 text--secondary"
                    v-text="work.City"
                  />
                  <!-- Description -->
                  <div v-if="work.Description"
                    class="mt-1"
                    v-text="work.Description"
                  />

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

      // DB Fetch and Form contents
      userWorks: {
        // work: {
        //   ID: '',
        //   UserID: '',
        //   Position: '',
        //   CompanyName: '',
        //   StartDate: '',
        //   EndDate: '',
        //   City: '',
        //   Description: '',
        //   HotelID: '',
        // }
      },

      // Deep Copy of DB Fetch, for Forms reset
      userWorksOriginal: {},

      // Edit, Valid & Loading states of each User Work Form
      userWorksModes: {
        // work: {
        //   edit: false,
        //   valid: true,
        //   modelStartDate: null,
        //   modelEndDate: null,
        //   saving: false
        // }
      },

      // New Work Form contents
      newWork: null,

      newWorkOriginal: {
        // ID: crypto.randomUUID()
        UserID: this.user.ID,
        Position: null,
        CompanyName: null,
        StartDate: null,
        EndDate: null,
        City: null,
        Description: null,
        HotelID: null
      },

      // Edit, Valid & Loading states of new Work Form
      newWorkModes: {
        edit: false,
        valid: false,
        saving: false,
        modelStartDate: null,
        modelEndDate: null
      },

      // Form Input validations
      rules: {
        required: [value => !!value || 'Required.']
      },

      // Display colors
      chartColorsHex: ['#008FFB', '#1DE9B6', '#E040FB', '#FFC107', '#F44336'], // For Chart
      chartColorsNames: ['blue', 'teal accent-3', 'purple accent-2', 'amber', 'red'], // For Timeline

      // Index of each Work to Color Charts
      workColors: {
        // workID: 2    -> chartColorsHex[2], chartColorsNames[2]
      },

      // Chart Data Series
      chartSeries: [
        // {
        //   data: [
        //     {
        //       x: 'Work 1 - Place 1',
        //       y: [
        //         new Date('2019-02-27').getTime(),
        //         new Date('2019-03-04').getTime()
        //       ],
        //       fillColor: '#008FFB'
        //     },
        //     {
        //       x: 'Work 2 - Place 2',
        //       y: [
        //         new Date('2019-03-04').getTime(),
        //         new Date('2019-03-08').getTime()
        //       ],
        //       fillColor: '#00E396'
        //     },
        //   ]
        // }
      ],

      // Chart Properties
      chartOptions: {
        chart: {
          type: 'rangeBar',
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
            horizontal: true,
            distributed: true,
            dataLabels: { hideOverflowingLabels: false }
          }
        },
        dataLabels: {
          enabled: false,
          style: { colors: ['#f3f4f5', '#fff'] }
        },
        xaxis: { type: 'datetime' },
        yaxis: { show: false },
        grid: {
          row: {
            colors: ['#f3f4f5', '#fff'],
            opacity: 1
          }
        }
      },

      // Donut Options
      // donutOptions: {
      //   chart: {
      //     type: 'donut'
      //   },
      //   dataLabels: {
      //     enabled: true,
      //     formatter: val => val + " %",
      //     style: {
      //       fontFamily: 'Montserrat, sans-serif',
      //       fontSize: '1.5em',
      //       fontWeight: 'bold'
      //     },
      //     dropShadow: {
      //       top: 0,
      //       left: 0,
      //       opacity: 1
      //     }
      //   },
      //   labels: ['Archipelago', 'Other'],
      //   legend: {
      //     position: 'bottom',
      //     fontFamily: 'Montserrat, sans-serif',
      //     fontSize: '17.4px',
      //     fontWeight: 'bold'
      //   },
      //   plotOptions: {
      //     pie: { expandOnClick: false }
      //   },
      //   states: {
      //     hover: { filter: { type: 'none' } },
      //     active: { filter: { type: 'none' } }
      //   }
      // }
    }
  },

  computed: {
    // Sorted User Works for display
    sortedUserWorks() {
      // Object of Works to Sorted Array of Works
      return Object.values(this.userWorks).sort((a, b) => new Date(b.StartDate) - new Date(a.StartDate))
    },
    // Total Work Days, Archipelago Work Days & Average days per Workplace
    workTimes() {
      const works = Object.values(this.userWorks)
      const count = works.length

      let total = 0, overlap = 0, archi = 0

      // Iterate between two works and find period overlaps
      works.forEach((w1, i) => {
        const
          w1Start = new Date(w1.StartDate),
          w1End = w1.EndDate ? new Date(w1.EndDate) : new Date(),
          days = Math.ceil((w1End - w1Start) / 86400000)

        total += days
        w1.IsArchipelago && (archi += days)

        // Subtract overlaps if any
        if (i !== count - 1) { // In bounds check
          const
            w2 = works[i + 1],
            w2Start = new Date(w2.StartDate),
            w2End = w2.EndDate ? new Date(w2.EndDate) : new Date()

          overlap += Math.max(0, Math.ceil(
            Math.min(w1End, w2End) - Math.max(w1Start, w2Start)
          ) / 86400000 + 1)
        }
      })

      return {
        count,
        total: total - overlap,
        average: Math.round(total / count),
        archi: Math.round(archi / total * 100)
      }
    },
    sortedChartSeries() {
      return [{
        data: this.sortedUserWorks.map((work, i) => { return {
          x: `${ work.Position } - ${ work.CompanyName }`,
          y: [new Date(work.StartDate).getTime(), (work.EndDate ? new Date(work.EndDate) : new Date()).getTime()],
          fillColor: this.chartColorsHex[this.workColors[work.ID]]
        }})
      }]
    },
    donutSeries() {
      return [this.workTimes.archi, 100 - this.workTimes.archi]
    }
  },

  created() {
    // this.initialize()
    this.getUserWorks()
    this.newWork = _.cloneDeep(this.newWorkOriginal)
  },

  methods: {
    // async initialize() { this.getUserWorks() },

    // Get User Employment History
    async getUserWorks() {
      await fetch(
        this.dbPathUrl(['employment_history', 'user', this.user.ID]),
        { headers: this.dbAuthHeaders }
      )
      .then(res => res.json())
      .then(data => {
        this.loading = false

        console.log('employment_history', data)

        data.forEach((work, i) => {
          // Save into object of objects
          // Parse Years, also null case for EndDate
          const EndDate = parseInt(work.EndDate)

          this.$set(this.userWorks, work.ID, {
            ...work,
            StartDate:  this.formatDate(work.StartDate),
            EndDate:    EndDate > 1 ? this.formatDate(work.EndDate) : null
          })
          // Set Edit, Valid & Saving modes for each Work Form
          this.$set(this.userWorksModes, work.ID, {
            edit: false, valid: true, saving: false, modelStartDate: null, modelEndDate: null
          })
          // Set Color for Chart and Timeline Items
          this.$set(this.workColors, work.ID, i % this.chartColorsHex.length)
        })
        // Save deep clone of all Works for Forms reset
        this.userWorksOriginal = _.cloneDeep(this.userWorks)
      })
      .catch(err => {
        this.loading = false
        this.showToast('error', ['Error getting User Employment History.', err.message])
      })
    },

    resetNewWork() {
      this.newWork = _.cloneDeep(this.newWorkOriginal)
      this.newWorkModes.edit = false
    },

    async addNewWork() {
      // Make new ID for new Work
      const ID = crypto.randomUUID()
      const newWork = {
        ..._.cloneDeep(this.newWork),
        ID,
        UserID: this.user.ID
      }

      await fetch(
        this.dbPathUrl('employment_history'),
        {
          method: 'POST',
          headers: this.dbAuthHeaders,
          body: JSON.stringify([{
            ...newWork,
            StartDate: this.formatDateTime(newWork.StartDate),
            EndDate: newWork.EndDate ? this.formatDateTime(newWork.EndDate) : null,
          }])
        }
      )
      .then(res => {
        // Add to Array, make modes, clone original too
        this.$set(this.userWorks, ID, newWork)
        this.$set(this.userWorksModes, ID, {
          edit: false, valid: true, saving: false, modelStartDate: null, modelEndDate: null
        })
        this.$set(this.workColors, ID, Object.keys(this.workColors).length % this.chartColorsHex.length)
        this.userWorksOriginal[ID] = _.cloneDeep(newWork)

        this.resetNewWork()
      })
      .catch(err => {
        this.showToast('error', ['Error adding User Employment.', err.message])
      })
    },

    resetWork(id) {
      this.userWorks[id] = _.cloneDeep(this.userWorksOriginal[id])
      this.userWorksModes[id].edit = false
    },

    async editWork(id) {
      this.userWorksModes[id].saving = true
      this.userWorksOriginal[id] = _.cloneDeep(this.userWorks[id])
      const work = this.userWorks[id]

      await fetch(
        this.dbPathUrl(['employment_history', id]),
        {
          method: 'PUT',
          headers: this.dbAuthHeaders,
          body: JSON.stringify([{
            ...work,
            StartDate: this.formatDateTime(work.StartDate),
            EndDate: work.EndDate ? this.formatDateTime(work.EndDate) : null,
          }])
        }
      )
      .then(res => {
        this.userWorksModes[id].saving = false
        this.userWorksModes[id].edit = false
      })
      .catch(err => {
        this.showToast('error', ['Error editing User Employment.', err.message])
      })

    },

    async deleteWork(id) {
      if (confirm('Are you sure?')) {

        await fetch(
          this.dbPathUrl(['employment_history', id]),
          {
            method: 'DELETE',
            headers: this.dbAuthHeaders,
          }
        )
        .then(res => {
          this.$delete(this.userWorks, id)
          this.$delete(this.userWorksOriginal, id)
        })
        .catch(err => {
          this.showToast('error', ['Error deleting User Employment.', err.message])
        })
      }
    }

    /* OLD CODE

    convertToMonthDate(str) {
      return (new Date(new Date(str) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 7)
    },

    enterEditMode() {
      this.editMode = true
    },

    cancelEditMode() {
      this.userWorks = [...this.originalData]
      this.addQueue = new Map()
      this.editQueue = new Set()
      this.deleteQueue = []
      this.editMode = false
    },

    adduserWorks() {
      const id = crypto.randomUUID()
      const newData = {
        UserID: this.user.ID,
        City:"",
        CompanyName:"",
        Description:"",
        EndDate: this.convertToMonthDate(new Date()),
        HotelID:"",
        ID: id,
        Position:"",
        StartDate: this.convertToMonthDate(new Date()),
      }
      this.datePicker.push({
        StartDatePicker: false,
        EndDatePicker: false
      })
      // add new id to map
      this.addQueue.set(id, newData)
      // add to data array
      this.userWorks.push(newData)
    },

    deleteuserWorks(id, index) {
      // prepare to delete if existed in the DB
      if (this.addQueue.has(id)) {
        this.addQueue.delete(id)
      } else {
        this.deleteQueue.push({ 'id': id})
      }
      // remove from array
      this.userWorks.splice(index, 1)
      this.datePicker.pop()
    },

    changeWatcher(id) {
      // save id to editQueue set if not a new data
      if (!this.addQueue.has(id)) this.editQueue.add(id)
    },

    async addMultipleData(map) {
      let body = []
      for (const id  of this.addQueue.keys()) {
        body.push(map.get(id))
      }
      console.log("add multiple data:")
      console.log(map)
      try {
        const res = await fetch(
          this.dbPathUrl('employment_history'),
          {
            method: 'POST',
            headers: this.dbAuthHeaders,
            body: JSON.stringify(body)
          }
        )
        if (!res.ok) {
          this.showToast('error', ['Error adding working histories to DB', res.status, res.statusText])
        } else {
          const responseText = await res.json()
          if (responseText == "Successfully add an employment history.") {
            this.addQueue = new Map()
          }
          console.log("RES: ", res.status)
          this.showToast('success', responseText)
        }
      } catch(err) {
        this.showToast('error', ['Error adding working histories to DB', err.message])
      }
    },

    async saveEditedData(map) {
      let body = []
      for (const id of this.editQueue.values()) {
        let record = map.get(id)
        body.push(map.get(id))
      }
      console.log("save edited data:")
      console.log(body)
      try {
        const res = await fetch(
          this.dbPathUrl(['employment_history', 'edit']),
          {
            method: 'PUT',
            headers: this.dbAuthHeaders,
            body: JSON.stringify(body)
          }
        )

        if (!res.ok) {
          this.showToast('error', ['Error saving Work Histories.', res.status, res.statusText])
        } else {
          const responseText = await res.json()
          if (responseText == "The employment_histories are edited successfully!") {
            this.editQueue = new Set()
          }
          console.log("RES: ", res.status)
          this.showToast('success', responseText)
        }
      } catch(err) {
        this.alertMode = 'error'
        this.alertText = "Error saving working histories to DB " + err.message
        this.alert_snakebar = true
      }
    },

    async sendDeleteRequest() {
      try {
        const res = await fetch(
          this.dbPathUrl(['employment_history', 'delete']),
          {
            method: 'POST',
            headers: this.dbAuthHeaders,
            body: JSON.stringify(this.deleteQueue)
          }
        )
        if (!res.ok) {
          console.log('Error deleting working histories', res.status)
          console.log(res.statusText)
          this.alertMode = 'error'
          this.alertText = "Error deleting working histories. " + res.statusText
          this.alert_snakebar = true
        } else {
          const responseText = await res.json()
          if (responseText == "The employment_histories are deleted successfully!") {
            this.deleteQueue = []
          }
          console.log("res status: ", res.status)
          this.alertMode = 'success'
          this.alertText = responseText
          this.alert_snakebar = true
        }
      } catch(err) {
        this.alertMode = 'error'
        this.alertText = "Error deleting working histories from DB " + err.message
        this.alert_snakebar = true
      }
    },

    async submitChanges() {
      //create a map from the data array
      const dataMap = new Map(
        this.userWorks.map(object => {
          if (object.StartDate.length == 7) {
            object.StartDate = new Date(object.StartDate + "-01")
          }
          if (object.EndDate.length == 7) {
            object.EndDate = new Date(object.EndDate + "-01")
          }
          return [object.ID, object]
        })
      )

      // ADD
      // look for unsubmitted data
      if (this.addQueue.size) await this.addMultipleData(dataMap)

      // EDIT
      // use watch event each time changes happen
      if (this.editQueue.size) await this.saveEditedData(dataMap)

      // DELETE
      // use the deleteQueue array
      if (this.deleteQueue.length) await this.sendDeleteRequest()

      this.editMode = false

      //reformat date in array
      for (let i in this.userWorks) {
        this.userWorks[i].StartDate = this.convertToMonthDate(this.userWorks[i].StartDate)
        this.userWorks[i].EndDate = this.convertToMonthDate(this.userWorks[i].EndDate)
      }
    },
    */
  }
}
</script>

<style>

</style>
