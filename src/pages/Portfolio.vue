<template>
  <div>

    <div class="d-flex align-end justify-space-between py-1 px-3 px-md-8 px-xl-16">
      <div class="d-flex flex-column flex-md-row align-center">

        <img
          height="24px"
          class="d-none d-md-flex"
          :src="require(`@/assets/images/logos/archipelago-logo-${ toolbarTheme === 'dark' || globalTheme === 'dark' ? 'white' : 'normal' }.png`)"
          alt="ARCHIPELAGO"
        >
        <div class="d-none d-md-flex text-h4 primary--text text-center ms-2">
          Academy
        </div>

        <img
          height="16px"
          class="d-md-none"
          :src="require(`@/assets/images/logos/archipelago-logo-${ toolbarTheme === 'dark' || globalTheme === 'dark' ? 'white' : 'normal' }.png`)"
          alt="ARCHIPELAGO"
        >
        <div class="d-md-none text-h7 font-weight-bold lh-normal primary--text text-center text-no-wrap">
          A C A D E M Y
        </div>

      </div>
      <div class="overline text-end">
        © 2022 ARCHIPELAGO INTERNATIONAL
      </div>
    </div>
    <v-divider/>

    <div v-if="user" class="py-3 py-md-4 px-3 px-md-8 px-xl-16">

      <!-- USER HEADER -->
      <v-row no-gutters class="align-center mb-3 mb-md-4">

        <v-col cols="12" md="8" class="d-flex flex-column flex-md-row align-center">

          <!-- PICTURE -->
          <div>
            <v-responsive aspect-ratio="1" class="me-0 me-md-6 rounded-lg">
              <v-img v-if="user.Picture" :src="user.Picture"/>
              <v-container v-else
                fill-height
                class="flex-column justify-center align-center secondary text-h4 font-weight-bold white--text"
              >
                <v-icon color="white" class="text-h1">mdi-account</v-icon>
                No Image
              </v-container>
            </v-responsive>
          </div>

          <!-- NAME POSITION COMPANY -->
          <div class="text-center text-md-start my-3 my-md-0">
            <div class="text-h4 text-md-h3 font-weight-bold" v-text="user.FullName"/>
            <div v-if="sortedUserWorks[0]">
              <div class="text-h6" v-text="sortedUserWorks[0].Position"/>
              <div class="text-h6" v-text="sortedUserWorks[0].CompanyName"/>
            </div>
          </div>

        </v-col>

        <!-- CONTACT INFO -->
        <v-col cols="12" md="4" class="d-flex justify-center justify-md-start ps-md-3">

          <div class="text-h6">
            <div v-if="user.Email" class="d-flex align-center">
              <v-icon>mdi-at</v-icon>
              <v-divider vertical class="mx-1"/>
              <div v-text="user.Email"/>
            </div>
            <div v-if="user.Phone" class="d-flex align-center">
              <v-icon>mdi-cellphone</v-icon>
              <v-divider vertical class="mx-1"/>
              <div class="py-1" v-text="user.Phone"/>
            </div>
            <div v-if="user.Address" class="d-flex align-center">
              <v-icon>mdi-home</v-icon>
              <v-divider vertical class="mx-1"/>
              <div v-text="user.City + ', ' + user.Country"/>
            </div>
          </div>

        </v-col>

      </v-row>

      <v-row no-gutters>

        <!-- DESKTOP - SKILLS COLUMN -->
        <v-col md="5" lg="2" class="pe-md-3 mb-3 d-none d-md-block">
          <div class="text-h4 font-weight-bold text-uppercase">Skills</div>
          <v-divider class="mb-2"/>

          <div>
            <div v-for="skill in sortedUserSkills" v-if="userSkills"
              :key="skill.ID"
              small
              class="pb-2 pb-md-4"
            >
                <!-- SKILL INFO -->
                <div
                  class="text-h6"
                  style="line-height: normal;"
                  v-text="skill.Name"
                />
                <div v-if="skill.Description" v-text="skill.Description" />

                <v-rating v-if="skill.Level"
                  readonly
                  empty-icon="mdi-circle-outline"
                  full-icon="mdi-circle"
                  icon-label="Level"
                  length="5"
                  size="12"
                  :value="skill.Level"
                />
            </div>
          </div>
        </v-col>

        <v-divider class="d-none d-md-flex mb-3" vertical/>

        <!-- EMPLOYMENT HISTORY COLUMN -->
        <v-col v-if="sortedUserWorks.length" cols="12" md="7" lg="6" class="px-lg-3 ps-md-3 mb-3">

          <div class="text-h4 font-weight-bold text-uppercase">CAREER</div>
          <v-divider class="mb-2"/>

          <div class="d-flex text-center justify-space-around">
            <div class="d-flex flex-column flex-xl-row align-center red--text">
              <div class="font-weight-bold text-h4 me-sm-1" v-text="workTimes.count"/>
              <div class="text-h6 lh-normal text-xl-start my-auto">Positions</div>
            </div>
            <div class="d-flex flex-column flex-xl-row align-center blue--text">
              <div class="font-weight-bold text-h4 me-sm-1" v-text="roundWithString(workTimes.total / 365, '+')"/>
              <div class="text-h6 lh-normal text-xl-start my-auto">Work<br/>Years</div>
            </div>
            <div class="d-flex flex-column flex-xl-row align-center green--text">
              <div class="font-weight-bold text-h4 me-sm-1" v-text="roundWithString(workTimes.average / 365, '+')"/>
              <div class="text-h6 lh-normal text-xl-start my-auto">Years<br/>Average</div>
            </div>
            <div class="d-flex flex-column flex-xl-row align-center indigo--text">
              <div class="d-flex align-center">
                <v-progress-circular
                  :value="workTimes.archi"
                  width="16"
                  rotate="-90"
                  class="me-1"
                />
                <div class="font-weight-bold text-h4 me-sm-1" v-text="workTimes.archi + '%'"/>
              </div>
              <div class="text-h6 lh-normal text-xl-start my-auto">With<br/>Archipelago</div>
            </div>
          </div>

          <apexchart
            type="rangeBar"
            height="192"
            :options="chartOptions"
            :series="sortedChartSeries"
          />


          <v-timeline align-top dense class="pa-0">

            <div class="d-flex justify-end pe-1" style="position: absolute; top: 0; z-index: 1; width: 100%;">
              <v-btn
                small elevation="0"
                :color="showWorksInfos ? 'blue' : 'grey'"
                class="white--text"

                @click="showWorksInfos = !showWorksInfos"
              >
                <v-icon small class="me-1">mdi-file-search</v-icon>
                Show Info
              </v-btn>
            </div>


            <v-timeline-item v-for="work in sortedUserWorks"
              :key="work.ID"
              small
              class="pb-3"
              :color="chartColorsNames[workColors[work.ID]]"
            >
              <div class="ms-md-2">
                <!-- Position -->
                <div
                  class="text-h6 lh-normal"
                  v-text="work.Position"
                />
                <!-- Company Name -->
                <div class="d-flex align-center">

                  <div
                    class="text-h7 lh-normal"
                    v-text="work.CompanyName"
                  />
                  <v-chip v-if="work.IsArchipelago"
                    x-small color="indigo" text-color="white"
                    class="mx-1"
                    :ripple="false"
                  >
                    Archipelago
                  </v-chip>
                </div>
                <transition mode="out-in">
                  <div v-if="showWorksInfos" class="mt-1">
                    <!-- Period -->
                    <div class="d-flex text-h7 text--secondary">
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
              </div>
            </v-timeline-item>
          </v-timeline>

        </v-col>

        <!-- MOBILE - SKILLS COLUMN -->
        <v-col cols="12" class="mb-3 d-md-none">
          <div class="text-h4 font-weight-bold text-uppercase">Skills</div>
          <v-divider class="mb-2"/>

          <div>
            <div v-for="skill in sortedUserSkills" v-if="userSkills"
              :key="skill.ID"
              small
              class="pb-2 pb-md-4"
            >
                <!-- SKILL INFO -->
                <div class="d-flex">
                  <div
                    class="text-h6"
                    style="line-height: normal;"
                    v-text="skill.Name"
                  />
                  <div v-if="skill.Description">: {{ skill.Description }}</div>
                </div>

                <v-rating
                  empty-icon="mdi-circle-outline"
                  full-icon="mdi-circle"
                  icon-label="Level"
                  length="5"
                  size="12"
                  :value="skill.Level"
                />
            </div>
          </div>
        </v-col>

        <v-divider class="d-none d-lg-flex mb-3" vertical/>

        <v-col v-if="sortedUserEdus.length" cols="12" md="7" lg="4" class="ps-lg-3 mb-3">

          <div class="text-h4 font-weight-bold text-uppercase">Education</div>
          <v-divider class="mb-2"/>

          <v-timeline align-top dense class="pa-0">
            <v-timeline-item v-for="edu in sortedUserEdus"
              :key="edu.ID"
              small
              class="pb-3 pb-md-4"
              color="primary"
            >
              <!-- Info Display -->
              <div class="ms-md-2">
                <!-- School Name -->
                <div
                  class="text-h6 lh-normal"
                  style="margin-bottom: 4px;"
                  v-text="edu.SchoolName"
                />

                <!-- Level · GPA -->
                <div class="d-flex">
                  <!-- Education Level -->
                  <div v-if="edu.EducationLevel !== 'other'"
                    v-text="eduLevelNames[edu.EducationLevel]"
                  />
                  <!-- Dot Separator -->
                  <div v-if="edu.EducationLevel !== 'other' && (edu.GPA && edu.GPA > 0)"
                    class="mx-1 font-weight-black" v-text="'·'"
                  />
                  <!-- GPA -->
                  <div v-if="edu.GPA && edu.GPA > 0"
                    v-text="'GPA ' + edu.GPA"
                  />
                </div>
                <!-- Period -->
                <div
                  class="d-flex text--secondary"
                  v-html="formatDurationYears(edu.StartYear, edu.EndYear)"
                />
                <v-divider class="mt-1"/>
              </div>

            </v-timeline-item>
          </v-timeline>
        </v-col>

      </v-row>

      <v-row no-gutters>

        <v-col cols="12" md="6" class="pe-md-3 mb-3">
          <div class="text-h4 font-weight-bold text-uppercase">Certificates</div>
          <v-divider class="mb-2"/>

          WIP
        </v-col>

        <v-divider class="d-none d-md-flex mb-3" vertical/>

        <v-col cols="12" md="6" class="ps-md-3 mb-3">
          <div class="text-h4 font-weight-bold text-uppercase">Qualifications</div>
          <v-divider class="mb-2"/>

          WIP
        </v-col>

      </v-row>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() { return {
    user: null,
    userWorks: {},
    userSkills: {},

    showWorksInfos: false,

    // ######## EXPERIENCE

    // Display colors
    chartColorsHex: ['#008FFB', '#1DE9B6', '#E040FB', '#FFC107', '#F44336'], // For Chart
    chartColorsNames: ['blue', 'teal accent-3', 'purple accent-2', 'amber', 'red'], // For Timeline

    // Index of each Work to Color Charts
    workColors: {},

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

    // ######## EDUCATION

    eduLevelNames: {
      smp:    'Junior High School',
      sma:    'High School',
      s1:     'Bachelor / Associate',
      s2:     'Master',
      other:  'Other'
    },

    userEdus: {}

  }},
  computed: {
    ...mapState('app', ['globalTheme', 'menuTheme', 'toolbarTheme']),

    // ######## EXPERIENCE

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

    // ######## EDUCATION

    sortedUserEdus() {
      // Object of Educations to Sorted Array of Educations
      return Object.values(this.userEdus).sort((a, b) => parseInt(b.StartYear) - parseInt(a.StartYear))
    },

    // ######## SKILLS

    sortedUserSkills() {
      return Object.values(this.userSkills).sort((a, b) => b.Level - a.level)
    },
  },

  created() {
    const { id } = this.$route.params

    this.getUser(id)
    this.getUserWorks(id)
    this.getUserEdus(id)
    this.getUserSkills(id)
  },

  methods: {

    async getUser(id) {
      await fetch( this.dbPathUrl(['user', id]), { headers: this.dbAuthHeaders })
        .then(res => res.json())
        .then(data => { this.user = { ...data, Birth: this.formatDate(data.Birth) } })
        .catch(err => this.showToast('error', ['Error getting User.', err.message]))
    },

    async getUserWorks(id) {
      await fetch( this.dbPathUrl(['employment_history', 'user', id]), { headers: this.dbAuthHeaders })
        .then(res => res.json())
        .then(data => {
          data.forEach((work, i) => {
          // Save into object of objects
          // Parse Years, also null case for EndDate
            const EndDate = parseInt(work.EndDate)

            this.$set(this.userWorks, work.ID, {
              ...work,
              StartDate:  this.formatDate(work.StartDate),
              EndDate:    EndDate > 1 ? this.formatDate(work.EndDate) : null
            })
            // Set Color for Chart and Timeline Items
            this.$set(this.workColors, work.ID, i % this.chartColorsHex.length)
          })
        })
        .catch(err => this.showToast('error', ['Error getting User Employment History.', err.message]))
    },

    async getUserEdus(id) {
      await fetch( this.dbPathUrl(['education', 'user', id]), { headers: this.dbAuthHeaders })
        .then(res => res.json())
        .then(data => {
          data.forEach(edu => {
          // Save into object of objects
          // Parse Years, also null case for EndYear
            const EndYear = parseInt(edu.EndYear)

            this.$set(this.userEdus, edu.ID, {
              ...edu,
              StartYear:  parseInt(edu.StartYear),
              EndYear:    EndYear > 1 ? EndYear : null
            })
          })
        })
        .catch(err => this.showToast('error', ['Error getting User Education History.', err.message]))
    },

    async getUserSkills(id) {
      await fetch(
        this.dbPathUrl(['skill', 'user', id]),
        { headers: this.dbAuthHeaders }
      )
      .then(res => res.json())
      .then(data => {
        data.forEach(skill => {
          this.$set(this.userSkills, skill.ID, {
            ...skill
          })
        })
      })
      .catch(err => {
        this.loading = false
        this.showToast('error', ['Error getting User Skills.', err.message])
      })
    },

  }
}
</script>
<style>
  .v-enter-active, .v-leave-active {
    transition: all .25s ease;
  }
  .v-enter, .v-leave, .v-enter-from, .v-leave-to {
    opacity: 0;
  }
  .lh-normal {
    line-height: normal !important;
  }
</style>
<style scoped>
  :deep(.v-timeline-item__body) {
    max-width: none;
  }
  :deep(.v-timeline-item__divider) {
    min-width: 48px;
  }
  .v-timeline-item {
    justify-content: flex-end;
  }
  .v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse)::before {
    left: calc(24px - 1px);
  }
</style>
