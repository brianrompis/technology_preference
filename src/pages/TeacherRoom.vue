<template>
  <transition appear mode="out-in">
    <progress-circular v-if="loading"/>
    <div v-else-if="classrooms" class="flex-grow-1">

      <div class="d-flex justify-space-between mb-2">
        <!-- Title -->
        <div class="text-h4 text-md-h3">Teacher's Room</div>
        <!-- Sync Button -->
        <v-tooltip left color="grey">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              large
              color="red"
              class="text-h5 white--text font-weight-bold"
              v-bind="attrs"
              v-on="on"
              @click="syncGoogleClassroom"
            >
              <v-icon class="me-2">mdi-sync</v-icon>
              Sync
            </v-btn>
          </template>
          <span>Sync data with Google Classroom</span>
        </v-tooltip>
      </div>

      <!-- Scorecard - Classes Preview -->
      <v-card class="d-flex flex-wrap align-center text-center text-subtitle-1 text-md-h5 font-weight-black pa-1 pa-md-2">

        <!-- Students Classes Count -->
        <div class="d-flex flex-grow-1 justify-space-around">
          <div>
            <div class="d-flex justify-center text-h4 text-sm-h3 font-weight-black">
              {{ /* Students */ 0 }}
              <v-icon class="ms-1 ms-md-3 text-h4 text-sm-h3">mdi-account-school</v-icon>
            </div>
            Students
          </div>

          <div>
            <div class="d-flex justify-center text-h4 text-sm-h3 font-weight-black">
              {{ classroomsCounts.total || 0 }}
              <v-icon class="ms-1 ms-md-3 text-h4 text-sm-h3">mdi-book</v-icon>
            </div>
            Classes
          </div>

          <v-divider vertical class="d-none d-sm-flex"/>
        </div>

        <!-- Classes Counts by Status -->
        <div class="d-flex flex-grow-1 justify-space-around mt-sm-0">
          <div class="blue--text">
            <div class="d-flex justify-center text-h4 text-sm-h3 font-weight-black">
              {{ classroomsCounts.status.ONGOING || 0 }}
              <v-icon color="blue" class="ms-1 ms-md-3 text-h4 text-sm-h3">mdi-google-classroom</v-icon>
            </div>
            Ongoing
          </div>
          <div class="green--text">
            <div class="d-flex justify-center text-h4 text-sm-h3 font-weight-black">
              {{ classroomsCounts.status.REVIEWED || 0 }}
              <v-icon color="green" class="ms-1 ms-md-3 text-h4 text-sm-h3">mdi-door-open</v-icon>
            </div>
            Approved
          </div>
          <div class="amber--text">
            <div class="d-flex justify-center text-h4 text-sm-h3 font-weight-black">
              {{ classroomsCounts.status.DRAFT || 0 }}
              <v-icon color="amber" class="ms-1 ms-md-3 text-h4 text-sm-h3">mdi-book-search</v-icon>
            </div>
            Pending
          </div>
          <div class="red--text">
            <div class="d-flex justify-center text-h4 text-sm-h3 font-weight-black">
              {{ classroomsCounts.status.CLOSED || 0 }}
              <v-icon color="red" class="ms-1 ms-md-3 text-h4 text-sm-h3">mdi-door-closed</v-icon>
            </div>
            Closed
          </div>
        </div>

      </v-card>

      <v-divider class="my-3"/>

      <!-- View Mode & Create Class Buttons -->
      <div class="d-flex align-end mb-2">

        <!-- VIEW MODE -->
        <v-card class="pa-1 d-none d-md-flex align-center">

          <div class="font-weight-black red--text" style="line-height: normal;">VIEW<br/>MODE</div>

          <v-divider vertical class="mx-2"/>

          <v-btn
            small fab
            class="rounded white--text me-1"
            :color="!selGridMode ? 'red' : 'grey'"
            @click="selGridMode = false"
          >
            <v-icon class="text-h4">mdi-view-sequential</v-icon>
          </v-btn>
          <v-btn
            small fab
            class="rounded white--text"
            :color="selGridMode ? 'red' : 'grey'"
            @click="selGridMode = true"
          >
            <v-icon class="text-h4">mdi-view-grid</v-icon>
          </v-btn>

        </v-card>

        <v-spacer/>

        <!-- CREATE CLASS -->
        <v-btn
          large
          color="green"
          class="text-h5 white--text font-weight-bold"
          :disabled="!!classroomForm"
          @click="newFormClassroom"
        >
          <v-icon class="me-2">mdi-plus</v-icon>
          Create Class
        </v-btn>

      </div>

      <!-- CLASSES -->
      <div class="mb-6">

        <!-- Search & Filter-->
        <v-card class="red--text">

          <v-row no-gutters class="pa-2">
            <!-- Text Search -->
            <v-text-field v-model="searchClassroom"
              label="Search Classroom"
              clearable solo flat dense outlined
              prepend-inner-icon="mdi-magnify"
              hide-details="auto"
              class="pa-0 text-h6 font-weight-black"
            />
            <!-- DESKTOP - Sort Name Toggle -->
            <v-btn
              small fab
              class="rounded white--text mx-1 d-none"
              :class="selGridMode ? 'd-md-none' : 'd-md-flex'"
              :color="selSort.type === 'Name' ? 'red' : 'grey'"
              @click="
                selSort.asc = selSort.type !== 'Name' || !selSort.asc
                selSort.type = 'Name'
              "
            >
              <v-icon large v-show="selSort.type !== 'Name' || selSort.asc === true">
                mdi-sort-alphabetical-ascending
              </v-icon>
              <v-icon large v-show="selSort.type === 'Name' && selSort.asc === false">
                mdi-sort-alphabetical-descending
              </v-icon>
            </v-btn>
            <!-- DESKTOP - STATUS Filter -->
            <v-col md="2"
              class="d-none text-h7 text-center font-weight-black me-1"
              :class="selGridMode ? 'd-md-none' : 'd-md-flex'"
              v-show="selGridMode"
            >
              <v-select v-model="selStatus" :items="statusSelItems"
                label="Filter by STATUS"
                dense outlined hide-details="auto"
                height="10"
              />
            </v-col>
            <!-- DESKTOP - DEPARTMENT Filter -->
            <v-col md="3"
              class="d-none text-h7 text-center font-weight-black"
              :class="selGridMode ? 'd-md-none' : 'd-md-flex'"
              v-show="selGridMode"
            >
              <v-select v-model="selDepartment" :items="departmentsSelItems"
                label="Filter by DEPARTMENT"
                dense outlined hide-details="auto"
                height="10"
              />
            </v-col>
          </v-row>

          <v-divider/>

          <!-- DESKTOP - Sort Other Attributes -->
          <v-row
            no-gutters
            class="d-none text-h7 text-center font-weight-black text-uppercase"
            :class="selGridMode ? 'd-md-none' : 'd-md-flex'"
          >
            <!-- CAPACITY Sort Toggle -->
            <v-col cols="1" class="pa-1 d-flex flex-column">
              <div class="text-truncate">Capacity</div>
              <div class="d-flex flex-grow-1 justify-space-around align-center">
                <v-btn x-small fab class="rounded white--text me-1"
                  :color="selSort.type === 'Capacity' ? 'red' : 'grey'"
                  @click="
                    selSort.asc = selSort.type !== 'Capacity' || !selSort.asc
                    selSort.type = 'Capacity'
                  "
                >
                  <v-icon class="text-h5" v-show="selSort.type !== 'Capacity' || selSort.asc === true">
                    mdi-sort-numeric-ascending
                  </v-icon>
                  <v-icon class="text-h5" v-show="selSort.type === 'Capacity' && selSort.asc === false">
                    mdi-sort-numeric-descending
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-divider vertical/>
            <!-- REGISTRATION PERIOD Sort Toggle -->
            <v-col cols="2" class="pa-1 d-flex flex-column">
              <div class="text-truncate">Registration Period</div>
              <div class="d-flex flex-grow-1 justify-space-around align-center">
                <v-btn x-small fab class="rounded white--text me-1"
                  :color="selSort.type === 'RegistrationStart' ? 'red' : 'grey'"
                  @click="
                    selSort.asc = selSort.type !== 'RegistrationStart' || !selSort.asc
                    selSort.type = 'RegistrationStart'
                  "
                >
                  <v-icon class="text-h5" v-show="selSort.type !== 'RegistrationStart' || selSort.asc === true">
                    mdi-sort-numeric-ascending
                  </v-icon>
                  <v-icon class="text-h5" v-show="selSort.type === 'RegistrationStart' && selSort.asc === false">
                    mdi-sort-numeric-descending
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-divider vertical/>
            <!-- CLASS PERIOD Sort Toggle -->
            <v-col cols="2" class="pa-1 d-flex flex-column">
              <div class="text-truncate">Class Period</div>
              <div class="d-flex flex-grow-1 justify-space-around align-center">
                <v-btn x-small fab class="rounded white--text me-1"
                  :color="selSort.type === 'ClassStart' ? 'red' : 'grey'"
                  @click="
                    selSort.asc = selSort.type !== 'ClassStart' || !selSort.asc
                    selSort.type = 'ClassStart'
                  "
                >
                  <v-icon class="text-h5" v-show="selSort.type !== 'ClassStart' || selSort.asc === true">
                    mdi-sort-numeric-ascending
                  </v-icon>
                  <v-icon class="text-h5" v-show="selSort.type === 'ClassStart' && selSort.asc === false">
                    mdi-sort-numeric-descending
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-divider vertical/>
            <!-- PASSING GRADE Sort Toggle -->
            <v-col cols="1" class="pa-1 d-flex flex-column justify-start">
              <div class="text-truncate">P. Grade</div>
              <div class="d-flex flex-grow-1 justify-space-around align-center">
                <v-btn x-small fab class="rounded white--text me-1"
                  :color="selSort.type === 'PassingGrade' ? 'red' : 'grey'"
                  @click="
                    selSort.asc = selSort.type !== 'PassingGrade' || !selSort.asc
                    selSort.type = 'PassingGrade'
                  "
                >
                  <v-icon class="text-h5" v-show="selSort.type !== 'PassingGrade' || selSort.asc === true">
                    mdi-sort-numeric-ascending
                  </v-icon>
                  <v-icon class="text-h5" v-show="selSort.type === 'PassingGrade' && selSort.asc === false">
                    mdi-sort-numeric-descending
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-divider vertical/>
            <!-- TOPICS -->
            <v-col cols="3" class="pa-1">
              <div class="text-truncate">Topics</div>
            </v-col>
            <v-divider vertical/>
            <!-- TEACHERS -->
            <v-col cols="3" class="pa-1 d-flex flex-column justify-start">
              <div class="text-truncate">Teachers</div>
            </v-col>
          </v-row>

          <!-- MOBILE - Sort & Filter Attributes -->
          <v-expansion-panels
            flat
            :class="selGridMode ? 'd-md-block' : 'd-md-none'"
          >
            <v-expansion-panel>

              <v-expansion-panel-header class="text-h6 font-weight-black justify-start">
                <div class="d-flex">
                  Options
                  <v-icon class="ms-1">mdi-tune</v-icon>
                </div>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <v-divider class="mb-2"/>

                <!-- SORT TOGGLES -->
                <div class="d-flex flex-wrap flex-column flex-md-row justify-space-between my-1">
                  <div class="text-h6">Sort by</div>
                  <!-- NAME -->
                  <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text me-1 mb-1"
                    :color="selSort.type === 'Name' ? 'red' : 'grey'"
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
                    <div class="ps-1">Class Name</div>
                    <div/>
                  </v-btn>
                  <!-- REGISTRATION PERIOD -->
                  <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text me-1 mb-1"
                    :color="selSort.type === 'RegistrationStart' ? 'red' : 'grey'"
                    @click="
                      selSort.asc = selSort.type !== 'RegistrationStart' || !selSort.asc
                      selSort.type = 'RegistrationStart'
                    "
                  >
                    <v-icon v-show="selSort.type !== 'RegistrationStart' || selSort.asc === true">
                      mdi-sort-numeric-ascending
                    </v-icon>
                    <v-icon v-show="selSort.type === 'RegistrationStart' && selSort.asc === false">
                      mdi-sort-numeric-descending
                    </v-icon>
                    <div class="ps-1">Registration Period</div>
                    <div/>
                  </v-btn>
                  <!-- CLASS PERIOD  -->
                  <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text me-1 mb-1"
                    :color="selSort.type === 'ClassStart' ? 'red' : 'grey'"
                    @click="
                      selSort.asc = selSort.type !== 'ClassStart' || !selSort.asc
                      selSort.type = 'ClassStart'
                    "
                  >
                    <v-icon v-show="selSort.type !== 'ClassStart' || selSort.asc === true">
                      mdi-sort-numeric-ascending
                    </v-icon>
                    <v-icon v-show="selSort.type === 'ClassStart' && selSort.asc === false">
                      mdi-sort-numeric-descending
                    </v-icon>
                    <div class="ps-1">Class Period</div>
                    <div/>
                  </v-btn>
                  <!-- PASSING GRADE -->
                  <v-btn small class="d-flex justify-space-between px-3 rounded-xl text-h6 white--text me-1 mb-1"
                    :color="selSort.type === 'PassingGrade' ? 'red' : 'grey'"
                    @click="
                      selSort.asc = selSort.type !== 'PassingGrade' || !selSort.asc
                      selSort.type = 'PassingGrade'
                    "
                  >
                    <v-icon v-show="selSort.type !== 'PassingGrade' || selSort.asc === true">
                      mdi-sort-numeric-ascending
                    </v-icon>
                    <v-icon v-show="selSort.type === 'PassingGrade' && selSort.asc === false">
                      mdi-sort-numeric-descending
                    </v-icon>
                    <div class="ps-1">Passing Grade</div>
                    <div/>
                  </v-btn>
                </div>

                <v-row no-gutters class="d-flex justify-space-between">

                  <div class="text-h6 mt-1">Filter by</div>

                  <!-- MOBILE - STATUS Filter -->
                  <v-col
                    cols="12" md="6"
                    class="text-h7 text-center font-weight-black me-1 mt-1"
                  >
                    <v-select v-model="selStatus" :items="statusSelItems"
                      label="STATUS"
                      dense outlined hide-details="auto"
                    />
                  </v-col>
                  <!-- MOBILE - DEPARTMENT Filter -->
                  <v-col
                    cols="12" md="6"
                    class="text-h7 text-center font-weight-black mt-1"
                  >
                    <v-select v-model="selDepartment" :items="departmentsSelItems"
                      label="DEPARTMENT"
                      dense outlined hide-details="auto"
                    />
                  </v-col>

                </v-row>

              </v-expansion-panel-content>

            </v-expansion-panel>
          </v-expansion-panels>

        </v-card>

        <!-- DESKTOP - CLASSES TABLE -->
        <div
          class="d-none"
          :class="selGridMode ? 'd-md-none' : 'd-md-block'"
        >
          <transition-group mode="out-in">

            <!-- CLASS TABLE CARD -->
            <v-card v-for="classroom in selClassrooms" :key="classroom.Id" class="mt-1">
              <!-- Upper Row -->
              <div class="d-flex justify-space-between align-center pa-1 red lighten-5" style="line-height: normal;">
                <!-- Left Side -->
                <div>
                  <div class="d-flex text-h6 font-weight-black">
                    <!-- NAME -->
                    <div class="text-uppercase me-1" v-text="classroom.Name"/>
                    <!-- SECTION -->
                    <div v-if="classroom.Section" class="d-flex">
                      <div class="mx-1">:</div>
                      <div class="text--secondary" v-text="classroom.Section"/>
                    </div>
                  </div>
                  <div class="d-flex align-center">
                    <div class="font-weight-black">
                      <!-- STATUS -->
                      <v-chip small v-if="classroom.Status === 'active'" class="rounded-xl white--text green">
                        <div class="text-truncate">ACTIVE</div>
                      </v-chip>
                      <v-chip small v-else-if="classroom.Status === 'draft'" class="rounded-xl white--text blue">
                        <div class="text-truncate">DRAFT</div>
                      </v-chip>
                      <v-chip small v-else="classroom.Status === 'pending'" class="rounded-xl white--text amber">
                        <div class="text-truncate">PENDING</div>
                      </v-chip>
                      <!-- DEPARTMENT -->
                      <v-chip small class="text-wrap rounded-xl font-weight-black mx-1" v-text="classroomDepartments[classroom.DepartmentId]"/>
                      <!-- VISIBILITY -->
                      <v-chip small v-if="classroom.Public" class="rounded-xl white--text blue">
                        <div class="text-truncate">Public</div>
                      </v-chip>
                      <v-chip small v-else class="rounded-xl white--text indigo">
                        <div class="text-truncate">Archipelago</div>
                      </v-chip>
                    </div>
                    <!-- DESCRIPTION -->
                    <div class="ms-1" v-text="classroom.Description"/>
                  </div>
                </div>
                <!-- Right Side - ACTIONS -->
                <div class="d-flex">
                  <!-- View Classroom -->
                  <v-btn
                    outlined color="blue"
                    class="white--text mx-1"
                    :href="classroom.AlternateLink" target="_blank"
                  >
                    <v-icon class="me-2">mdi-google</v-icon>
                    <div class="text-center">VIEW<br/>CLASSROOM</div>
                  </v-btn>
                  <!-- Invite Teacher -->
                  <v-btn
                    outlined color="green"
                    class="white--text mx-1"
                  >
                    <v-icon class="me-2">mdi-account-plus</v-icon>
                    <div class="text-center">INVITE<br/>TEACHER</div>
                  </v-btn>
                  <!-- Edit Classroom -->
                  <v-btn
                    outlined icon color="orange"
                    class="mx-1"
                    :loading="saving === classroom.Id"
                    @click="editFormClassroom(classroom.Id)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <!-- Delete Classroom -->
                  <v-btn
                    outlined icon color="red"
                    class="mx-1"
                    :loading="saving === classroom.Id"
                    @click="deleteClassroom(classroom.Id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>

              <v-divider/>

              <!-- Lower Row -->
              <v-row no-gutters>
                <!-- CAPACITY -->
                <v-col cols="1" class="pa-1 font-weight-bold d-flex align-center justify-center text-center">
                  {{ 'WIP' /* Classroom Students */ }} / {{ classroom.Capacity }}
                </v-col>
                <v-divider vertical/>
                <!-- REGISTRATION PERIOD -->
                <v-col cols="2" class="pa-1 font-weight-bold d-flex align-center justify-space-around">
                  <div class="text--disabled text-subtitle-2">from</div>
                  <div v-text="formatDateShort(classroom.RegistrationStart)" class="text-truncate"/>
                  <div class="text--disabled text-subtitle-2">to</div>
                  <div v-text="formatDateShort(classroom.RegistrationEnd)" class="text-truncate"/>
                </v-col>
                <v-divider vertical/>
                <!-- CLASS PERIOD -->
                <v-col cols="2" class="pa-1 font-weight-bold d-flex align-center justify-space-around">
                  <div class="text--disabled text-subtitle-2">from</div>
                  <div v-text="formatDateShort(classroom.ClassStart)" class="text-truncate"/>
                  <div class="text--disabled text-subtitle-2">to</div>
                  <div v-text="formatDateShort(classroom.ClassEnd)" class="text-truncate"/>
                </v-col>
                <v-divider vertical/>
                <!-- PASSING GRADE -->
                <v-col cols="1" class="pa-1 font-weight-bold d-flex align-center justify-center text-center">
                  {{ classroom.PassingGrade }} / 100
                </v-col>
                <v-divider vertical/>
                <!-- TOPICS -->
                <v-col cols="3" class="ps-1 pt-1 d-flex flex-wrap align-center justify-space-around">
                  <v-chip v-for="topic in classroom.Topics" small class="me-1 mb-1" v-text="topic.Name"/>
                  <div v-if="!classroom.Topics" class="text--secondary me-1 mb-1">—</div>
                </v-col>
                <!-- TEACHERS -->
                <v-divider vertical/>
                <v-col cols="3" class="pa-1 d-flex flex-column align-center justify-center">
                  WIP
                </v-col>
              </v-row>

            </v-card>
          </transition-group>

        </div>
        <!-- EO CLASSES TABLE -->

        <!-- MOBILE - CLASSES GRID -->
        <v-row
          no-gutters
          :class="selGridMode ? 'd-md-flex' : 'd-md-none'"
          class="mt-4"
        >
          <transition-group mode="out-in" class="d-flex flex-wrap ma-n2 flex-grow-1">
            <!-- CLASS GRID CARD -->
            <v-col v-for="classroom in selClassrooms"
              :key="classroom.Id"
              cols="12" md="6" lg="4" xl="3"
              class="pa-2"
            >
              <v-card class="d-flex flex-column flex-grow-1 justify-space-between fill-height">

                <!-- Card Top -->
                <div class="red lighten-5">

                  <div class="d-flex justify-space-between font-weight-black pa-2 pb-0">
                    <!-- Top Left - NAME - SECTION - DEPARTMENT - VISIBILITY -->
                    <div>
                      <div class="d-flex text-h6" style="line-height: normal;" v-text="classroom.Name"/>
                      <div v-if="classroom.Section" class="text-subtitle-1" style="line-height: normal;" v-text="classroom.Section"/>
                      <v-chip small class="mt-1 me-1" v-text="classroomDepartments[classroom.DepartmentId]"/>
                      <v-chip small v-if="classroom.Public" class="rounded-xl white--text blue mt-1">
                        <div class="text-truncate">Public</div>
                      </v-chip>
                      <v-chip small v-else class="rounded-xl white--text indigo mt-1">
                        <div class="text-truncate">Archipelago</div>
                      </v-chip>
                    </div>
                    <!-- Top Right - CAPACITY - STATUS -->
                    <div class="d-flex flex-column justify-start align-end">
                      <div class="text-h6 mb-1" style="line-height: normal;">{{ 'WIP' /* Classroom Students */ }} / {{ classroom.Capacity }}</div>
                      <v-chip v-if="classroom.Status === 'ONGOING'" small class="white--text blue">ONGOING</v-chip>
                      <v-chip v-else-if="classroom.Status === 'REVIEWED'" small class="white--text green">AVAILABLE</v-chip>
                      <v-chip v-else-if="classroom.Status === 'DRAFT'" small  class="white--text amber">PENDING</v-chip>
                      <v-chip v-else="classroom.Status === 'RED'" small  class="white--text red">CLOSED</v-chip>
                    </div>
                  </div>

                  <!-- DESCRIPTION -->
                  <div v-if="classroom.Description"
                    class="d-flex pa-2 pb-0"
                  >
                    <v-card outlined color="red" class="me-1"/>
                    <div v-text="classroom.Description"/>
                  </div>

                  <v-divider class="mt-2"/>

                </div>

                <!-- TOPICS -->
                <div v-if="classroom.Topics" class="d-flex justify-space-between align-center pa-2 pb-0">
                  <div class="mb-1">Topics</div>
                  <div class="d-flex flex-wrap">
                    <v-chip v-for="topic in classroom.Topics" small class="surface font-weight-bold ms-1 mb-1" v-text="topic.Name"/>
                  </div>
                </div>
                <!-- TEACHERS -->
                <div class="d-flex justify-space-between pa-2 pb-0">
                  Teachers
                  <div class="d-flex flex-wrap font-weight-bold">
                    WIP
                  </div>
                </div>

                <!-- Card Bottom -->
                <div>

                  <v-divider class="mt-2"/>
                  <v-row no-gutters class="text-center pa-2 pb-0">
                    <!-- REGISTRATION PERIOD -->
                    <v-col cols="6">
                      Registration Period
                      <div class="font-weight-bold">{{ formatDateShort(classroom.RegistrationStart) }} - {{ formatDateShort(classroom.RegistrationEnd) }}</div>
                    </v-col>
                    <v-divider vertical/>
                    <!-- CLASS PERIOD -->
                    <v-col cols="6">
                      Class Period
                      <div class="font-weight-bold">{{ formatDateShort(classroom.ClassStart) }} - {{ formatDateShort(classroom.ClassEnd) }}</div>
                    </v-col>
                  </v-row>

                  <!-- ACTIONS -->
                  <div class="d-flex justify-space-between align-center pa-2">
                    <!-- View Classroom -->
                    <v-btn
                      outlined color="blue"
                      class="white--text px-1"
                      :href="classroom.AlternateLink" target="_blank"
                    >
                      <v-icon class="me-1 d-none d-md-flex">mdi-google</v-icon>
                      <div class="text-center">VIEW<br/>CLASSROOM</div>
                    </v-btn>
                    <!-- Invite Teacher -->
                    <v-btn
                      outlined color="green"
                      class="white--text px-1"
                    >
                      <v-icon class="me-1 d-none d-md-flex">mdi-account-plus</v-icon>
                      <div class="text-center">INVITE<br/>TEACHER</div>
                    </v-btn>
                    <!-- Edit Classroom -->
                    <v-btn
                      outlined icon color="orange"
                      :loading="saving === classroom.Id"
                      @click="editFormClassroom(classroom.Id)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <!-- Delete Classroom -->
                    <v-btn
                      outlined icon color="red"
                      :loading="saving === classroom.Id"
                      @click="deleteClassroom(classroom.Id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>

                </div>

              </v-card>
            </v-col>
          </transition-group>

        </v-row>
        <!-- EO CLASSES GRID -->

      </div>

      <!-- CLASS CREATE / EDIT FORM -->
      <v-dialog v-if="classroomForm" v-model="classroomForm"
        persistent
        max-width="800px"
      >
        <v-card class="pa-3 lighten-5" :color="classroomFormMode === 'new' ? 'green' : 'orange'">
          <v-form v-model="classroomFormValid" class="font-weight-bold">

            <!-- Form Title -->
            <div class="text-h5 font-weight-black">{{ classroomFormMode === 'new' ? 'Create' : 'Edit'}} Class</div>

            <v-divider class="my-2"/>

            <!-- Name -->
            <v-row no-gutters class="my-2">
              <v-text-field v-model="classroomForm.Name"
                outlined dense
                label="Name *"
                hide-details="auto"
                :rules="rules.required"
              />
            </v-row>
            <!-- Description -->
            <v-row no-gutters class="my-2">
              <v-col cols="12">
                <v-text-field v-model="classroomForm.Description"
                  outlined dense
                  hide-details="auto"
                  label="Description"
                />
              </v-col>
            </v-row>

            <v-divider class="my-2"/>

            <v-row no-gutters class="my-2">
              <!-- Department -->
              <v-col cols="6" class="pe-1">
                <v-select v-model="classroomForm.DepartmentId"
                  outlined dense
                  label="Department *"
                  hide-details="auto"
                  :items="departmentsSelItems.slice(1)"
                  :rules="rules.required"
                />
              </v-col>
              <!-- Section -->
              <v-col cols="6" class="ps-1">
                <v-text-field v-model="classroomForm.Section"
                  outlined dense
                  hide-details="auto"
                  label="Section"
                />
              </v-col>
            </v-row>

            <v-row no-gutters class="my-2">
              <!-- Capacity -->
              <v-col cols="6" class="pe-1">
                <v-text-field v-model="classroomForm.Capacity"
                  outlined dense
                  label="Capacity *"
                  hide-details="auto"
                  type="number"
                  :rules="rules.isCapacity"
                />
              </v-col>
              <!-- Passing Grade -->
              <v-col cols="6" class="ps-1">
                <v-text-field v-model="classroomForm.PassingGrade"
                  outlined dense
                  label="Passing Grade *"
                  hide-details="auto"
                  type="number"
                  :rules="rules.isPassingGrade"
                />
              </v-col>
            </v-row>

            <v-divider class="my-2"/>

            <!-- Registration Period -->
            <v-row no-gutters>
              <v-col cols="2" class="d-flex align-center text--secondary">
                Registration Period *
              </v-col>
              <v-col cols="10">
                <v-row no-gutters>
                  <!-- Start -->
                  <v-col cols="12" sm="6" class="pe-sm-1 pb-1 pb-sm-0">
                    <v-menu v-model="formModelRegistrationStart"
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="formatDateShort(classroomForm.RegistrationStart)"
                          outlined dense readonly
                          label="Start Date *"
                          hide-details="auto"
                          prepend-inner-icon="mdi-calendar"
                          :rules="rules.required"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="classroomForm.RegistrationStart"/>
                    </v-menu>
                  </v-col>
                  <!-- End -->
                  <v-col cols="12" sm="6" class="ps-sm-1">
                    <v-menu v-model="formModelRegistrationEnd"
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="formatDateShort(classroomForm.RegistrationEnd)"
                          outlined dense readonly
                          label="End Date *"
                          hide-details="auto"
                          prepend-inner-icon="mdi-calendar"
                          :rules="rules.required"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="classroomForm.RegistrationEnd"/>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- Class Period -->
            <v-row no-gutters class="my-2">
              <v-col cols="2" class="d-flex align-center text--secondary">
                Class Period *
              </v-col>
              <v-col cols="10">
                <v-row no-gutters>
                  <!-- Start -->
                  <v-col cols="12" sm="6" class="pe-sm-1 pb-1 pb-sm-0">
                    <v-menu v-model="formModelClassStart"
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="formatDateShort(classroomForm.ClassStart)"
                          outlined dense readonly
                          label="Start Date *"
                          hide-details="auto"
                          prepend-inner-icon="mdi-calendar"
                          :rules="rules.required"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="classroomForm.ClassStart"/>
                    </v-menu>
                  </v-col>
                  <!-- End -->
                  <v-col cols="12" sm="6" class="ps-sm-1">
                    <v-menu v-model="formModelClassEnd"
                      transition="fade-transition"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :value="formatDateShort(classroomForm.ClassEnd)"
                          outlined dense readonly
                          label="End Date *"
                          hide-details="auto"
                          prepend-inner-icon="mdi-calendar"
                          :rules="rules.required"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="classroomForm.ClassEnd"/>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-divider class="my-2"/>

            <!-- Save - Cancel -->
            <v-row no-gutters class="mt-2 d-flex align-center">
              <v-btn
                color="blue"
                class="white--text text-h6"
                :disabled="!classroomFormValid"
                :loading="saving"
                @click="classroomFormMode === 'new' ? addClassroom() : editClassroom(classroomForm.Id)"
              >
                <v-icon class="me-1">mdi-content-save</v-icon>
                Save
              </v-btn>
              <v-btn
                color="secondary"
                class="text-h6 mx-2"
                :disabled="saving"
                @click="resetFormClassroom"
              >
                Cancel
              </v-btn>
              <div class="text--secondary font-weight-regular">* Required</div>
            </v-row>

          </v-form>
        </v-card>
      </v-dialog>


    </div>

  </transition>
</template>

<script>
import DB from '../configs/db'

export default {
  data: () => ({

    loading: true,
    saving: null,

    searchClassroom: null,

    selGridMode: false,
    selSort: { type: 'Name', asc: true },

    selStatus: 'all',
    selDepartment: 0, // All

    // DB Fetch
    classrooms: {
      // id: {
      //
      // }
    },

    // New Classroom Form reset contents
    newClassroomOriginal: {
      // ID: crypto.randomUUID()
      Name: null,
      Status: 'DRAFT',
      Description: null,
      DepartmentId: null,
      Section: null,
      Capacity: null,
      PassingGrade: null,
      RegistrationStart: null,
      RegistrationEnd: null,
      ClassStart: null,
      ClassEnd: null,
      Topics: [],
      Teachers: [
        // #### Self Teacher here
      ],
      AlternateLink: null,
    },

    // Form contents for Classroom CREATE or EDIT
    classroomForm: null,
    // Form usage mode: CREATE / EDIT
    classroomFormMode: null,
    // Form Rules Validation
    classroomFormValid: null,

    formModelRegistrationStart: null,
    formModelRegistrationEnd: null,
    formModelClassStart: null,
    formModelClassEnd: null,

    // OLD CODE

    rules: {
      required: [v => !!v || 'Required.'],
      isCapacity: [v => v > 0 || 'Too low.'],
      isPassingGrade: [
        v => v >= 0 || 'Too low.',
        v => v <= 100 || 'Too high.'
      ]
    },

    alert_snakebar: false,
    alertText: '',
    alertMode: 'error'
  }),

  computed: {
    statusSelItems() {
      return Object.entries(this.classroomStatus).map(([value, text]) => ({ value, text }))
    },
    departmentsSelItems() {
      return Object.values(this.classroomDepartments).map((text, value) => ({ text, value }))
    },
    selClassrooms() {
      // Type Sort
      let classrooms = Object.values(this.classrooms)
      const { type, asc } = this.selSort

      // Sort depending on data type (string / value)
      if (['Name', 'RegistrationStart', 'RegistrationEnd', 'ClassStart', 'ClassEnd'].includes(type)) {
        classrooms = classrooms.sort((a, b) => (asc || -1) * a[type].localeCompare(b[type], undefined, { sensitivity: 'base' }))
      } else {
        classrooms = classrooms.sort((a, b) => (asc || -1) * (a[type] - b[type]))
      }
      // Text Search
      this.searchClassroom && (classrooms = classrooms.filter(cr =>
        // Name or Section
        [cr.Name + cr.Section].join(' ').toLowerCase().includes(this.searchClassroom.trim().toLowerCase())
      ))
      // Department Filter
      this.selDepartment !== 0 && (classrooms = classrooms.filter(cr => cr.DepartmentId == this.selDepartment))
      // Status Filter
      this.selStatus !== 'all' && (classrooms = classrooms.filter(cr => cr.Status === this.selStatus))
      // Return results
      return classrooms
    },
    classroomsCounts() {
      const counts = {
        total: Object.keys(this.classrooms).length,
        status: {},
        department: {}
      }

      Object.values(this.classrooms).forEach(cr => {
        const { Status: s } = cr
        let { DepartmentId: d } = cr

        // Safe add count to status
        s in counts.status ? counts.status[s]++ : counts.status[s] = 1
        // Safe add count to department
        d = d || 0  // Add count to Classes without Department if so
        d in counts.department ? counts.department[d]++ : counts.department[d] = 1
      })
      return counts
    }
  },

  created() {
    this.getClassrooms()
  },

  methods: {

    async syncGoogleClassroom() {
      this.loading = true

      await fetch( this.dbPathUrl('sync'), { headers: this.dbAuthHeaders } )
      .then(res => res.json())
      .then(data => {
        this.loading = false
        this.classrooms = {} // Wipe Classrooms
        data.forEach(classroom => {
          this.$set(this.classrooms, classroom.Id, classroom)
        })
        this.showToast('success', 'Synced with Google Classroom.')
      })
      .catch(err => {
        this.syncGoogleClassroomLoading = false
        this.showToast('error', ['Error syncing data with Google Classroom.', err.message])
      })
    },

    async getClassrooms() {
      await fetch(
        this.dbPathUrl('classes'),
        { headers: this.dbAuthHeaders }
      )
      .then(res => res.json())
      .then(data => {
        this.loading = false
        console.log('Classrooms', data)
        data.forEach(classroom => {
          // Parse Dates for Form Date compatibility
          this.$set(this.classrooms, classroom.Id, {
            ...classroom,
            DepartmentId: parseInt(classroom.DepartmentId),
            RegistrationStart: this.formatDate(classroom.RegistrationStart),
            RegistrationEnd: this.formatDate(classroom.RegistrationEnd),
            ClassStart: this.formatDate(classroom.ClassStart),
            ClassEnd: this.formatDate(classroom.ClassEnd),
          })
        })
      })
      .catch(err => {
        this.loading = false
        this.showToast('error', ['Error getting Classes.', err.message])
      })
    },

    parseBody(classroom) {
      return JSON.stringify({
        ...classroom,
        DepartmentId: classroom.DepartmentId.toString(),
        Capacity: parseInt(classroom.Capacity),
        RegistrationStart: this.formatDateTime(classroom.RegistrationStart),
        RegistrationEnd: this.formatDateTime(classroom.RegistrationEnd),
        ClassStart: this.formatDateTime(classroom.ClassStart),
        ClassEnd: this.formatDateTime(classroom.ClassEnd),
      })
    },

    async addClassroom() {
      // Make new ID for Classroom
      const Id = crypto.randomUUID()
      this.saving = Id
      // New Classroom for Local addition
      const classroom = { ..._.cloneDeep(this.classroomForm), Id }

      await fetch(this.dbPathUrl('classes'), {
        method: 'POST',
        headers: this.dbAuthHeaders,
        body: this.parseBody({ classroom }) // New Classroom for POST addition
      })
      .then(res => {
        // Add to Classrooms
        this.$set(this.classrooms, Id, classroom)
        this.saving = null
        this.resetFormClassroom()
      })
      .catch(err => {
        this.saving = null
        this.resetFormClassroom()
        this.showToast('error', err.message)
      })
    },

    async editClassroom(Id) {
      this.saving = Id
      const classroom = _.cloneDeep(this.classroomForm)

      await fetch(this.dbPathUrl(['classes', Id]), {
        method: 'PUT',
        headers: this.dbAuthHeaders,
        body: this.parseBody(classroom)
      })
      .then(res => {
        // Edit in Classrooms
        this.$set(this.classrooms, Id, classroom)
        this.saving = null
        this.resetFormClassroom()
      })
      .catch(err => {
        this.saving = null
        this.resetFormClassroom()
        this.showToast('error', err.message)
      })
    },

    async deleteClassroom(Id) {
      if (confirm('Are you sure?')) {
        this.saving = Id
        await fetch(this.dbPathUrl(['classes', Id]), {
          method: 'DELETE',
          headers: this.dbAuthHeaders
        })
        .then(res => {
          this.saving = null
          this.$delete(this.classrooms, Id)
        })
        .catch(err => {
          this.saving = null
          this.showToast('error', err.message)
        })
      }
    },

    newFormClassroom() {
      this.classroomFormMode = 'new'
      this.classroomForm = _.cloneDeep(this.newClassroomOriginal)
    },
    editFormClassroom(id) {
      this.classroomFormMode = 'edit'
      this.classroomForm = _.cloneDeep(this.classrooms[id])
    },
    resetFormClassroom() {
      this.classroomFormMode = null
      this.classroomForm = null
    },

  }
}
</script>

<style scoped>

  .v-enter-active, .v-leave-active {
    transition: all .25s ease;
  }
  .v-enter, .v-leave, .v-enter-from, .v-leave-to {
    opacity: 0;
  }

  .v-chip {
    height: auto !important;
  }
  .v-chip .v-chip__content {
    max-width: 100%;
    height: auto;
    min-height: 32px;
    white-space: pre-wrap;
  }

  .scale-small {
    transform: scale(.8);
  }

</style>
