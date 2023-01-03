<template>
  <transition appear mode="out-in">
    <progress-circular v-if="loading"/>
    <v-card v-else-if="jobVacancies" class="flex-grow-1">

      <v-row no-gutters>
        <!-- Search, Sorts & Filters -->
        <v-sheet class="rounded-t pa-2 flex-grow-1">

          <div class="text-h4 font-weight-bold green--text mb-1">Find your Job</div>

          <!-- Search & Filter -->
          <v-row no-gutters>
            <!-- Text Search -->
            <v-col cols="12" md="6" class="pe-md-1 pb-md-0">
              <v-text-field v-model="searchJobVacancy"
                label="Job Title"
                clearable solo flat outlined dense
                prepend-inner-icon="mdi-magnify"
                hide-details="auto"
                class="text-h6"
              />
            </v-col>
            <!-- LOCATION Search -->
            <v-col cols="12" md="3"
              class="d-flex text-h7 text-center font-weight-black py-1 pe-md-1 py-md-0 px-md-1"
            >
              <v-text-field v-model="searchJobVacancyLocation"
                label="Location"
                clearable solo flat outlined dense
                prepend-inner-icon="mdi-magnify"
                hide-details="auto"
                class="text-h6"
              />
            </v-col>
            <!-- DEPARTMENT Filter -->
            <v-col cols="12" md="3"
              class="d-flex text-h7 text-center font-weight-black ps-md-1"
            >
              <v-select v-model="selDepartment" :items="departmentsSelItems"
                label="Department"
                outlined dense
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <!-- DESKTOP - Sort Options -->
          <v-row no-gutters class="d-none d-md-flex justify-space-between flex-row pt-2">
            <div class="text-h6 font-weight-black green--text">Sort by</div>
            <!-- NAME -->
            <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text"
              :color="selSort.type === 'Name' ? 'green' : 'grey'"
              @click="
                selSort.asc = selSort.type !== 'Name' || !selSort.asc
                selSort.type = 'Name'
              "
            >
              <v-icon v-show="selSort.type !== 'Name' || selSort.asc === true">
                mdi-sort-alphabetical-ascending
              </v-icon>
              <v-icon v-show="selSort.type === 'Name' && selSort.asc === false">
                mdi-sort-alphabetical-descending
              </v-icon>
              <div class="ps-1">Job Title</div>
              <div/>
            </v-btn>
            <!-- RELEVANCE -->
            <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text"
              :color="selSort.type === 'relevance' ? 'green' : 'grey'"
              @click="
                selSort.asc = selSort.type !== 'relevance' || !selSort.asc
                selSort.type = 'relevance'
              "
            >
              <v-icon v-show="selSort.type !== 'relevance' || selSort.asc === true">
                mdi-sort-numeric-ascending
              </v-icon>
              <v-icon v-show="selSort.type === 'relevance' && selSort.asc === false">
                mdi-sort-numeric-descending
              </v-icon>
              <div class="ps-1">Relevance</div>
              <div/>
            </v-btn>
            <!-- ISSUED DATE -->
            <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text"
              :color="selSort.type === 'IssuedDate' ? 'green' : 'grey'"
              @click="
                selSort.asc = selSort.type !== 'IssuedDate' || !selSort.asc
                selSort.type = 'IssuedDate'
              "
            >
              <v-icon v-show="selSort.type !== 'IssuedDate' || selSort.asc === true">
                mdi-sort-numeric-ascending
              </v-icon>
              <v-icon v-show="selSort.type === 'IssuedDate' && selSort.asc === false">
                mdi-sort-numeric-descending
              </v-icon>
              <div class="ps-1">Issued Date</div>
              <div/>
            </v-btn>
            <!-- EXPIRED DATE -->
            <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text"
              :color="selSort.type === 'ExpiredDate' ? 'green' : 'grey'"
              @click="
                selSort.asc = selSort.type !== 'ExpiredDate' || !selSort.asc
                selSort.type = 'ExpiredDate'
              "
            >
              <v-icon v-show="selSort.type !== 'ExpiredDate' || selSort.asc === true">
                mdi-sort-numeric-ascending
              </v-icon>
              <v-icon v-show="selSort.type === 'ExpiredDate' && selSort.asc === false">
                mdi-sort-numeric-descending
              </v-icon>
              <div class="ps-1">Expired Date</div>
              <div/>
            </v-btn>
            <!-- SALARY -->
            <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text"
              :color="selSort.type === 'Salary' ? 'green' : 'grey'"
              @click="
                selSort.asc = selSort.type !== 'Salary' || !selSort.asc
                selSort.type = 'Salary'
              "
            >
              <v-icon v-show="selSort.type !== 'Salary' || selSort.asc === true">
                mdi-sort-numeric-ascending
              </v-icon>
              <v-icon v-show="selSort.type === 'Salary' && selSort.asc === false">
                mdi-sort-numeric-descending
              </v-icon>
              <div class="ps-1">Salary</div>
              <div/>
            </v-btn>
            <!-- APPLICANTS -->
            <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text"
              :color="selSort.type === 'Applicants' ? 'green' : 'grey'"
              @click="
                selSort.asc = selSort.type !== 'Applicants' || !selSort.asc
                selSort.type = 'Applicants'
              "
            >
              <v-icon v-show="selSort.type !== 'Applicants' || selSort.asc === true">
                mdi-sort-numeric-ascending
              </v-icon>
              <v-icon v-show="selSort.type === 'Applicants' && selSort.asc === false">
                mdi-sort-numeric-descending
              </v-icon>
              <div class="ps-1">N. Applicants</div>
              <div/>
            </v-btn>
          </v-row>

        </v-sheet>
      </v-row>

      <v-divider/>

      <!-- MOBILE - Sort Options -->
      <v-expansion-panels flat class="d-md-none" >
        <v-expansion-panel>

          <v-expansion-panel-header class="text-h6 font-weight-black justify-start">
            <div class="d-flex">
              <div class="text-h6 font-weight-black">Sort Options</div>
              <v-icon class="ms-1">mdi-tune</v-icon>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider class="mb-2"/>

            <!-- SORT TOGGLES -->
            <div class="d-flex flex-wrap my-1">
              <!-- NAME -->
              <v-btn small class="d-flex flex-grow-1 justify-space-between px-4 rounded-xl text-h6 white--text ms-md-2 mb-1 mb-md-0"
                :color="selSort.type === 'Name' ? 'green' : 'grey'"
                @click="
                  selSort.asc = selSort.type !== 'Name' || !selSort.asc
                  selSort.type = 'Name'
                "
              >
                <v-icon v-show="selSort.type !== 'Name' || selSort.asc === true">
                  mdi-sort-alphabetical-ascending
                </v-icon>
                <v-icon v-show="selSort.type === 'Name' && selSort.asc === false">
                  mdi-sort-alphabetical-descending
                </v-icon>
                <div class="ps-1">Job Title</div>
                <div/>
              </v-btn>
              <!-- RELEVANCE -->
              <v-btn small class="d-flex flex-grow-1 justify-space-between px-4 rounded-xl text-h6 white--text ms-md-2 mb-1 mb-md-0"
                :color="selSort.type === 'relevance' ? 'green' : 'grey'"
                @click="
                  selSort.asc = selSort.type !== 'relevance' || !selSort.asc
                  selSort.type = 'relevance'
                "
              >
                <v-icon v-show="selSort.type !== 'relevance' || selSort.asc === true">
                  mdi-sort-numeric-ascending
                </v-icon>
                <v-icon v-show="selSort.type === 'relevance' && selSort.asc === false">
                  mdi-sort-numeric-descending
                </v-icon>
                <div class="ps-1">Relevance</div>
                <div/>
              </v-btn>
              <!-- ISSUED DATE -->
              <v-btn small class="d-flex flex-grow-1 justify-space-between px-4 rounded-xl text-h6 white--text ms-md-2 mb-1 mb-md-0"
                :color="selSort.type === 'IssuedDate' ? 'green' : 'grey'"
                @click="
                  selSort.asc = selSort.type !== 'IssuedDate' || !selSort.asc
                  selSort.type = 'IssuedDate'
                "
              >
                <v-icon v-show="selSort.type !== 'IssuedDate' || selSort.asc === true">
                  mdi-sort-numeric-ascending
                </v-icon>
                <v-icon v-show="selSort.type === 'IssuedDate' && selSort.asc === false">
                  mdi-sort-numeric-descending
                </v-icon>
                <div class="ps-1">Issued Date</div>
                <div/>
              </v-btn>
              <!-- EXPIRED DATE -->
              <v-btn small class="d-flex flex-grow-1 justify-space-between px-4 rounded-xl text-h6 white--text ms-md-2 mb-1 mb-md-0"
                :color="selSort.type === 'ExpiredDate' ? 'green' : 'grey'"
                @click="
                  selSort.asc = selSort.type !== 'ExpiredDate' || !selSort.asc
                  selSort.type = 'ExpiredDate'
                "
              >
                <v-icon v-show="selSort.type !== 'ExpiredDate' || selSort.asc === true">
                  mdi-sort-numeric-ascending
                </v-icon>
                <v-icon v-show="selSort.type === 'ExpiredDate' && selSort.asc === false">
                  mdi-sort-numeric-descending
                </v-icon>
                <div class="ps-1">Expired Date</div>
                <div/>
              </v-btn>
              <!-- SALARY -->
              <v-btn small class="d-flex flex-grow-1 justify-space-between px-4 rounded-xl text-h6 white--text ms-md-2 mb-1 mb-md-0"
                :color="selSort.type === 'Salary' ? 'green' : 'grey'"
                @click="
                  selSort.asc = selSort.type !== 'Salary' || !selSort.asc
                  selSort.type = 'Salary'
                "
              >
                <v-icon v-show="selSort.type !== 'Salary' || selSort.asc === true">
                  mdi-sort-numeric-ascending
                </v-icon>
                <v-icon v-show="selSort.type === 'Salary' && selSort.asc === false">
                  mdi-sort-numeric-descending
                </v-icon>
                <div class="ps-1">Salary</div>
                <div/>
              </v-btn>
              <!-- APPLICANTS -->
              <v-btn small class="d-flex flex-grow-1 justify-space-between px-4 rounded-xl text-h6 white--text ms-md-2 mb-1 mb-md-0"
                :color="selSort.type === 'Applicants' ? 'green' : 'grey'"
                @click="
                  selSort.asc = selSort.type !== 'Applicants' || !selSort.asc
                  selSort.type = 'Applicants'
                "
              >
                <v-icon v-show="selSort.type !== 'Applicants' || selSort.asc === true">
                  mdi-sort-numeric-ascending
                </v-icon>
                <v-icon v-show="selSort.type === 'Applicants' && selSort.asc === false">
                  mdi-sort-numeric-descending
                </v-icon>
                <div class="ps-1">N. Applicants</div>
                <div/>
              </v-btn>
            </div>

          </v-expansion-panel-content>

        </v-expansion-panel>
      </v-expansion-panels>

      <v-row no-gutters fill-height>
        <v-col cols="12" md="5">
          <!-- JOB VACANCIES -->
          <v-sheet
            color="green"
            class="pa-2"
            :class="$vuetify.breakpoint.smAndDown ? 'rounded-b' : 'rounded-bl overflow-y-auto'"
            :height="$vuetify.breakpoint.smAndDown ? '' : '67vh'"
          >
            <transition-group mode="out-in">

              <v-card v-for="(job, Id) in selJobVacancies"
                :key="Id"
                class="mt-2 pa-2"
                @click="selJobVacancy = job"
              >
                <div class="d-flex flex-grow text-h7 text-md-h6">
                  <div v-if="job.Level" class="d-flex me-1 font-weight-regular" v-text="job.Level"/>
                  <div class="font-weight-bold" v-text="job.Name"/>
                </div>

                <div class="d-flex flex-wrap align-center">
                  <div class="font-weight-bold green--text me-2" v-text="job.Type"/>
                  <div class="font-weight-bold blue--text me-2" v-text="job.Hotel"/>
                  <v-spacer/>
                  <v-chip small class="rounded-xl font-weight-black" v-text="classroomDepartments[job.DepartmentID]"/>
                  <div class="grey--text font-weight-bold ms-auto ps-2" v-text="formatDateShort(job.IssuedDate)"></div>
                </div>

                <v-divider class="my-1"/>

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="d-flex flex-column grey--text">

                    <div v-if="job.Salary?.length === 2" class="d-flex font-weight-bold">
                      <div class="d-flex">
                        IDR {{ roundWithString(job.Salary[0] / 1000000, 'M+', 'M') }}&nbsp;
                      </div>
                      <div v-if="job.Salary[0] !== job.Salary[1]" class="d-flex">
                        to {{ roundWithString(job.Salary[1] / 1000000, 'M+', 'M') }}&nbsp;
                      </div>
                      monthly
                    </div>

                    <div class="d-flex">
                      accepting until
                      <div class="font-weight-bold ms-1" v-text="formatDateShort(job.ExpiredDate)"></div>
                    </div>

                  </div>

                  <v-spacer/>

                  <div v-if="job.Applicants" class="d-flex align-center">
                    <v-icon class="me-1" color="green">mdi-account-arrow-right</v-icon>
                    <div class="text-h6 font-weight-bold green--text" v-text="job.Applicants"/>
                  </div>
                </div>

                <!-- Fully qualified -->
                <div v-if="job.relevance === 1" class="d-flex align-center font-weight-black green--text">
                  <v-icon color="green" class="me-1">mdi-check-decagram</v-icon>
                  <div v-text="`You're qualified for this job!`"/>
                </div>

                <!-- No qualifications needed -->
                <div v-else-if="job.relevance === 2" class="d-flex align-center font-weight-black green--text">
                  <v-icon color="green" class="me-1">mdi-check-decagram</v-icon>
                  <div v-text="`No Archipelago qualifications required.`"/>
                </div>

                <!-- Almost qualified -->
                <div v-else-if="job.relevance === 3" class="d-flex align-center orange--text">
                  <v-icon color="orange" class="me-1">mdi-alert-decagram</v-icon>
                  You're almost qualified for this job.
                </div>

              </v-card>

            </transition-group>
          </v-sheet>
        </v-col>

        <v-col md="7" class="d-none d-md-flex flex-column justify-center" style="position: relative;">
          <v-sheet v-if="selJobVacancy"
            height="67vh"
            class="rounded-br d-flex flex-column"
          >
            <!-- Job Vacancy Header -->
            <v-card flat color="green lighten-5" class="rounded-0 d-flex align-center pa-2">
              <div>
                <div class="d-flex flex-wrap text-h5">
                  <div v-if="selJobVacancy.Level" class="font-weight-regular me-1" style="line-height: normal;" v-text="selJobVacancy.Level"/>
                  <div class="font-weight-bold text-wrap" style="line-height: normal;" v-text="selJobVacancy.Name"/>
                </div>
                <div class="font-weight-bold blue--text" style="line-height: normal;" v-text="selJobVacancy.Hotel"/>
              </div>

              <v-spacer/>

              <v-btn x-large dark color="green" class="mx-2">
                <v-icon large class="me-1">mdi-account-arrow-right</v-icon>
                <div class="d-flex flex-column align-center">
                  <div class="text-h5 font-weight-bold" style="line-height: normal;">APPLY</div>
                  <div>before {{ formatDateShort(selJobVacancy.ExpiredDate) }}</div>
                </div>

              </v-btn>

              <v-btn
                icon outlined large color="green"
                class="text-h5 font-weight-bold"
                @click="selJobVacancy = null"
              >
                X
              </v-btn>
            </v-card>

            <!-- Selected Job Vacancy -->
            <div class="d-flex flex-column overflow-auto pa-3">

              <v-row no-gutters>

                <v-col cols="4" class="mb-2">
                  <div class="green--text">Department</div>
                  <div class="font-weight-black" v-text="classroomDepartments[selJobVacancy.DepartmentID]"/>
                </v-col>
                <v-col cols="4" class="mb-2">
                  <div class="green--text">Hotel / Office</div>
                  <div class="font-weight-black" v-text="selJobVacancy.Hotel"/>
                </v-col>

                <v-col v-if="selJobVacancy.Level" cols="4" class="mb-2">
                  <div class="green--text">Career Level</div>
                  <div class="font-weight-black" v-text="selJobVacancy.Level"/>
                </v-col>
                <v-col v-else cols="4" class="mb-2"/>

                <v-col cols="4" class="mb-2">
                  <div class="green--text">Job Type</div>
                  <div class="font-weight-black" v-text="selJobVacancy.Type"/>
                </v-col>

                <v-col v-if="selJobVacancy.Salary" cols="8" class="mb-2">
                  <div class="green--text">Salary</div>
                  <div class="font-weight-black d-flex">
                    <div class="d-flex">
                      IDR {{ Math.round(selJobVacancy.Salary[0] / 10000) / 100 }}M&nbsp;
                    </div>
                    <div v-if="selJobVacancy.Salary[0] !== selJobVacancy.Salary[1]" class="d-flex">
                      - {{ Math.round(selJobVacancy.Salary[1] / 10000) / 100 }}M&nbsp;
                    </div>
                    monthly
                  </div>
                </v-col>
                <v-col v-else cols="4" class="mb-2"/>

              </v-row>

              <div class="d-flex ma-3">
                <v-card outlined color="green lighten-3" class="me-3"/>
                <div class="text-body-1" style="text-align: justify; text-justify: inter-word;" v-text="selJobVacancy.Description || loremIpsum"/>
              </div>

              <v-divider class="mb-2"/>

              <div v-if="selJobVacancy.Qualifications.length !== 0" class>
                <div class="font-weight-black text-h6">Qualifications</div>
                <div v-for="qual in selJobVacancy.Qualifications" class="mt-2">
                  <div v-if="userQualifications.includes(qual)" class="d-flex align-center">
                    <v-icon color="green" class="me-1">mdi-checkbox-outline</v-icon>
                    <div class="font-weight-black green--text" v-text="qualifications[qual].Name"/>
                  </div>
                  <div v-else class="d-flex">
                    <div class="d-flex flex-column align-center me-1">
                      <v-icon color="red">mdi-checkbox-blank-outline</v-icon>
                      <v-card outlined color="red" class="flex-grow-1"/>
                    </div>
                    <div class="d-flex flex-column">
                      <div class="font-weight-black red--text" v-text="qualifications[qual].Name"/>
                      <div v-for="cert in qualifications[qual].Certificates">
                        <div v-if="userCertificates.includes(cert)" class="d-flex align-center green--text">
                          <v-icon small color="green" class="me-1">mdi-checkbox-outline</v-icon>
                          <div v-text="certificates[cert].Name"/>
                          <div v-if="certificates[cert].Section" class="d-flex">
                            <div class="me-1">:</div>
                            {{ certificates[cert].Section }}
                          </div>
                        </div>
                        <div v-else class="d-flex align-center red--text">
                          <v-icon small color="red" class="me-1">mdi-checkbox-blank-outline</v-icon>
                          <div v-text="certificates[cert].Name"/>
                          <div v-if="certificates[cert].Section" class="d-flex">
                            <div class="me-1">:</div>
                            {{ certificates[cert].Section }}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
              <div v-else class="d-flex align-center font-weight-black green--text">
                <v-icon color="green" class="me-1">mdi-check-decagram</v-icon>
                No Archipelago qualifications required
              </div>
            </div>

          </v-sheet>
          <v-sheet v-else class="d-flex flex-column rounded-br align-center">
            <v-icon color="green" class="text-h1">mdi-briefcase</v-icon>
            <div class="d-flex align-center text-h5 my-2">
              We have
              <div v-if="selJobVacancies.length !== 1" class="text-h4 font-weight-bold mx-2 green--text" v-text="selJobVacancies.length + ' jobs'"/>
              <div v-else class="text-h4 font-weight-bold mx-2 green--text">a job</div>
              for you
            </div>
            <div class="text-h6 green--text font-weight-regular">Select a job to view more details</div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-dialog v-if="$vuetify.breakpoint.smAndDown && selJobVacancy" v-model="selJobVacancy">

        <!-- Job Vacancy Header -->
        <v-card flat color="green lighten-5" class="d-flex flex-column pa-2 mb-3">
          <div>
            <div class="d-flex flex-wrap text-h5">
              <div v-if="selJobVacancy.Level" class="font-weight-regular me-1" style="line-height: normal;" v-text="selJobVacancy.Level"/>
              <div class="font-weight-bold text-wrap" style="line-height: normal;" v-text="selJobVacancy.Name"/>
            </div>
            <div class="font-weight-bold blue--text" style="line-height: normal;" v-text="selJobVacancy.Hotel"/>
          </div>

          <div class="d-flex justify-space-between mt-2">
            <v-btn large dark color="green">
              <v-icon large class="me-1">mdi-account-arrow-right</v-icon>
              <div class="d-flex flex-column align-center">
                <div class="text-h5 font-weight-bold" style="line-height: normal;">APPLY</div>
                <div>before {{ formatDateShort(selJobVacancy.ExpiredDate) }}</div>
              </div>

            </v-btn>

            <v-btn
              icon outlined large color="green"
              class="text-h5 font-weight-bold"
              @click="selJobVacancy = null"
            >
              X
            </v-btn>
          </div>


        </v-card>

        <!-- Selected Job Vacancy -->
        <v-card class="d-flex flex-column overflow-auto px-2 py-4" height="67vh">

          <div class="mb-1">
            <div class="green--text">Department</div>
            <div class="font-weight-black" v-text="classroomDepartments[selJobVacancy.DepartmentID]"/>
          </div>
          <div class="mb-1">
            <div class="green--text">Hotel / Office</div>
            <div class="font-weight-black" v-text="selJobVacancy.Hotel"/>
          </div>

          <div v-if="selJobVacancy.Level" class="mb-1">
            <div class="green--text">Career Level</div>
            <div class="font-weight-black" v-text="selJobVacancy.Level"/>
          </div>

          <div class="mb-1">
            <div class="green--text">Job Type</div>
            <div class="font-weight-black" v-text="selJobVacancy.Type"/>
          </div>

          <div v-if="selJobVacancy.Salary" class="mb-1">
            <div class="green--text">Salary</div>
            <div class="font-weight-black d-flex">
              <div class="d-flex">
                IDR {{ Math.round(selJobVacancy.Salary[0] / 10000) / 100 }}M&nbsp;
              </div>
              <div v-if="selJobVacancy.Salary[0] !== selJobVacancy.Salary[1]" class="d-flex">
                - {{ Math.round(selJobVacancy.Salary[1] / 10000) / 100 }}M&nbsp;
              </div>
              monthly
            </div>
          </div>

          <v-divider class="my-2"/>

          <div v-if="selJobVacancy.Qualifications.length !== 0" class="my-1">
            <div class="font-weight-black text-h5">Qualifications</div>
            <div v-for="qual in selJobVacancy.Qualifications" class="mt-2">

              <div v-if="userQualifications.includes(qual)" class="d-flex">
                <v-icon color="green" class="me-1">mdi-checkbox-outline</v-icon>
                <div class="font-weight-black green--text" v-text="qualifications[qual].Name"/>
              </div>

              <div v-else class="d-flex">
                <div class="d-flex flex-column align-center me-1">
                  <v-icon color="red">mdi-checkbox-blank-outline</v-icon>
                  <v-card outlined color="red" class="flex-grow-1"/>
                </div>
                <div class="d-flex flex-column">
                  <div class="font-weight-black red--text" v-text="qualifications[qual].Name"/>
                  <div v-for="cert in qualifications[qual].Certificates" class="text-caption">
                    <div v-if="userCertificates.includes(cert)" class="d-flex align-start green--text">
                      <v-icon small color="green" class="me-1">mdi-checkbox-outline</v-icon>
                      <div v-text="certificates[cert].Name" style="line-height: normal;"/>
                      <div v-if="certificates[cert].Section" class="d-flex align-start" style="line-height: normal;">
                        <div class="me-1">:</div>
                        {{ certificates[cert].Section }}
                      </div>
                    </div>
                    <div v-else class="d-flex align-start red--text">
                      <v-icon small color="red" class="me-1">mdi-checkbox-blank-outline</v-icon>
                      <div v-text="certificates[cert].Name" style="line-height: normal;"/>
                      <div v-if="certificates[cert].Section" class="d-flex align-center" style="line-height: normal;">
                        <div class="me-1">:</div>
                        {{ certificates[cert].Section }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div v-else class="d-flex align-center font-weight-black green--text">
            <v-icon color="green" class="me-1">mdi-check-decagram</v-icon>
            No Archipelago qualifications required
          </div>

          <v-divider class="my-3"/>

          <div class="text-body-1 me-2" style="text-align: justify; text-justify: inter-word;" v-text="selJobVacancy.Description || loremIpsum"/>

        </v-card>

      </v-dialog>

    </v-card>
  </transition>
</template>

<script>
export default {

  data() { return {

    loading: false,

    searchJobVacancy: null,
    searchJobVacancyLocation: null,

    selSort: { type: 'Name', asc: true },
    selDepartment: 0,

    selJobVacancy: null,

    certificates: {
      1: {
        Name: 'Food & Beverages Standards & Guidelines',
        DepartmentID: 7
      },
      2: {
        Name: 'Guest Rooms Standards & Guidelines',
        DepartmentID: 5
      },
      3: {
        Name: 'PC & Devices',
        Section: 'Usage Guidelines',
        DepartmentID: 2
      },
      4: {
        Name: 'PC & Devices',
        Section: 'Hardware & Software Basics',
        DepartmentID: 2
      },
      5: {
        Name: 'Web',
        Section: 'HTML & CSS',
        DepartmentID: 2
      },
      6: {
        Name: 'Introduction to Arch Software',
        DepartmentID: 2
      },
      7: {
        Name: 'Web',
        Section: 'Introduction to Internet',
        DepartmentID: 2
      },
      8: {
        Name: 'IT Security Guidelines',
        DepartmentID: 2
      },
      9: {
        Name: 'Web',
        Section: 'Javascript & APIs',
        DepartmentID: 2
      },
      10: {
        Name: 'Network Cybersecurity',
        DepartmentID: 2
      },
      11: {
        Name: 'PC & Devices',
        Section: 'Components & I/O Devices',
        DepartmentID: 2
      },
      12: {
        Name: 'Web',
        Section: 'PHP & SQL',
        DepartmentID: 2
      },
      13: {
        Name: 'Software',
        Section: 'Programming Basics',
        DepartmentID: 2
      },
      14: {
        Name: 'Software',
        Section: 'Relational Databases & DBMS',
        DepartmentID: 2
      },
      15: {
        Name: 'Web',
        Section: 'Backend Design & Security',
        DepartmentID: 2
      },
      16: {
        Name: 'Servers',
        Section: 'Hardware & Software',
        DepartmentID: 2
      },
      17: {
        Name: 'Software',
        Section: 'Design & Development',
        DepartmentID: 2
      },
      18: {
        Name: 'Web',
        Section: 'UX & UI',
        DepartmentID: 2
      },
      19: {
        Name: 'Emergency Standards & Guidelines',
        DepartmentID: 1
      },
      20: {
        Name: 'Events Management',
        DepartmentID: 1
      },
      21: {
        Name: 'Guest Communication',
        DepartmentID: 1
      },
    },

    qualifications: {
      1: {
        Name: 'IT Standards and Guidelines',
        Certificates: [3, 6, 8]
      },
      2: {
        Name: 'Web Development',
        Certificates: [4, 7, 17, 5, 13, 9]
      },
      3: {
        Name: 'PHP Web Development',
        Certificates: [12]
      },
      4: {
        Name: 'Frontend Web Development',
        Certificates: [18]
      },
      5: {
        Name: 'Backend Web Development',
        Certificates: [15, 14]
      },
      6: {
        Name: 'PC Maintenance & Troubleshooting',
        Certificates: [4, 11, 7]
      },
      7: {
        Name: 'Enterprise Network',
        Certificates: [4, 11, 16, 10]
      },
      8: {
        Name: 'Hotel Staff',
        Certificates: [2, 1, 20, 19, 21]
      },
    },

    jobVacancies: {
      1: {
        Name: 'PHP Frontend Web Developer',
        DepartmentID: 2,
        Level: 'Junior',
        Type: 'Full-Time',
        Description: null,
        Hotel: 'Corporate Office Jakarta',
        IssuedDate: '2022-08-06',
        ExpiredDate: '2022-11-06',
        Qualifications: [1, 2, 4, 3],
        Salary: [6000000, 6500000],
        Applicants: 8,
      },
      2: {
        Name: 'Fullstack Web Developer',
        DepartmentID: 2,
        Type: 'Full-Time',
        Description: null,
        Hotel: 'Corporate Office Bali',
        IssuedDate: '2022-06-15',
        ExpiredDate: '2022-12-15',
        Qualifications: [1, 2, 4, 5],
        Salary: [8000000, 10000000],
        Applicants: 3,
      },
      3: {
        Name: 'Frontend Web Developer',
        DepartmentID: 2,
        Level: 'Junior',
        Type: 'Part-Time',
        Hotel: 'Corporate Office Bali',
        Description: null,
        IssuedDate: '2022-06-15',
        ExpiredDate: '2022-12-15',
        Qualifications: [1, 2, 4],
        Salary: [7000000, 7000000],
        Applicants: 6,
      },
      4: {
        Name: 'Backend Web Developer',
        DepartmentID: 2,
        Level: 'Junior',
        Type: 'Full-Time',
        Hotel: 'Corporate Office Jakarta',
        Description: null,
        IssuedDate: '2022-06-15',
        ExpiredDate: '2022-12-15',
        Qualifications: [1, 2, 5],
        Salary: [7500000, 8000000],
        Applicants: 2,
      },
      5: {
        Name: 'Hotel Website Developer',
        DepartmentID: 2,
        Type: 'Part-Time',
        Hotel: 'HARPER Kuta',
        Description: null,
        IssuedDate: '2022-04-20',
        ExpiredDate: '2022-06-20',
        Qualifications: [1, 2],
        Salary: [5000000, 5500000],
        Applicants: 20,
      },
      6: {
        Name: 'Head Receptionist',
        DepartmentID: 3,
        Type: 'Full-Time',
        Hotel: 'ASTON Manado',
        Description: null,
        IssuedDate: '2022-05-04',
        ExpiredDate: '2022-09-04',
        Qualifications: [1, 6, 8]
      },
      7: {
        Name: 'IT Officer',
        DepartmentID: 2,
        Level: 'Junior',
        Type: 'Full-Time',
        Hotel: 'ASTON Canggu',
        Description: null,
        IssuedDate: '2022-04-20',
        ExpiredDate: '2022-06-20',
        Qualifications: [1, 6, 7],
        Applicants: 2,
      },
      8: {
        Name: 'Receptionist',
        DepartmentID: 3,
        Type: 'Internship',
        Hotel: 'Aston Manado',
        Description: null,
        IssuedDate: '2022-05-04',
        ExpiredDate: '2022-09-04',
        Qualifications: [],
        Salary: [4000000, 4500000],
        Applicants: 22,
      },
    },

    userCertificates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 17, 18],
    userQualifications: [1, 2, 4],

    loremIpsum: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam faucibus semper augue, ac scelerisque quam molestie sed. Aliquam vitae molestie nunc. Fusce lectus justo, efficitur in tincidunt ac, suscipit at lorem. Etiam arcu urna, dignissim eu dictum vel, commodo et metus. Integer ullamcorper maximus dictum. Cras efficitur arcu vel nisi maximus ultricies. Donec tempor mi tortor, sed varius odio faucibus at. In vitae risus vestibulum, lacinia lectus vitae, aliquet nisi. Vivamus in tincidunt velit. Sed fringilla mauris at nisi vestibulum ullamcorper. Nullam ac hendrerit enim, ullamcorper ultrices est. Suspendisse congue egestas dui vel sagittis. Phasellus ornare auctor malesuada. Praesent viverra massa at malesuada mattis.`,

  }},

  computed: {

    departmentsSelItems() {
      return Object.values(this.classroomDepartments).map((text, value) => ({ text, value }))
    },

    selJobVacancies() {
      // Type Sort
      let jobVacancies = Object.values(this.jobVacancies)
      const { type, asc } = this.selSort

      // Sort depending on data type (string / value)
      if (['Name', 'IssuedDate', 'ExpiredDate'].includes(type)) {
        jobVacancies = jobVacancies.sort((a, b) => (asc || -1) * a[type].localeCompare(b[type], undefined, { sensitivity: 'base' }))
      // Sort Salary
      } else if (['Salary'].includes(type)) {
        // Salary null counts as 0
        jobVacancies = jobVacancies.sort((a, b) => (asc || -1) * (!(a.Salary && b.Salary) || (a.Salary[0] - b.Salary[0])))
      } else {
        jobVacancies = jobVacancies.sort((a, b) => (asc || -1) * (a[type] - b[type]))
      }

      // Name Search
      this.searchJobVacancy && (jobVacancies = jobVacancies.filter(jv =>
        [jv.Level, jv.Name].join(' ').toLowerCase().includes(this.searchJobVacancy.trim().toLowerCase())
      ))
      // Location Search
      this.searchJobVacancyLocation && (jobVacancies = jobVacancies.filter(jv =>
        jv.Hotel.toLowerCase().includes(this.searchJobVacancyLocation.trim().toLowerCase())
      ))
      // Department Filter
      this.selDepartment !== 0 && (jobVacancies = jobVacancies.filter(jv => jv.DepartmentID == this.selDepartment))
      // Return results
      return jobVacancies
    }
  },

  created() {
    // Assign Qualification Status
    Object.keys(this.jobVacancies).forEach(k => {
      const jv = this.jobVacancies[k]
      // If no Qualifications needed
      if (!jv.Qualifications.length) jv.relevance = 2
      else {
        // Find missing Qualifications
        const missingQualifications = jv.Qualifications.filter(q => !this.userQualifications.includes(q))
        // Check if fully or not qualified
        if (missingQualifications.length === 0) jv.relevance = 1
        else if (missingQualifications.length > 1) jv.relevance = 4
        // Else if only some Qualifications are missing  (1 missing)
        else jv.relevance = 3
      }
    })
  },

  methods: {

  },

}
</script>

<style>
  .v-enter-active, .v-leave-active {
    transition: all .25s ease;
  }
  .v-enter, .v-leave, .v-enter-from, .v-leave-to {
    opacity: 0;
  }
</style>
<style scoped>
</style>
