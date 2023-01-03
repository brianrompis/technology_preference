<template>
  <transition appear mode="out-in">
    <progress-circular v-if="loading"/>
    <div v-else-if="user" class="flex-grow-1 mx-lg-8 mx-xl-16">

      <div class="d-flex flex-wrap mb-3">
        <v-btn
          color="blue"
          class="text-h6 white--text px-4 me-2 mb-1"
          @click="$router.push(`/portfolio/${user.ID}`)"
        >
          <v-icon class="me-2">mdi-file-search</v-icon>
          View Portfolio
        </v-btn>
        <div class="d-flex">
          <v-btn
            color="red"
            class="text-h7 white--text px-2 me-2 mb-1"
            @click=""
          >
            <v-icon class="me-2">mdi-file-download</v-icon>
            Download<br/>PDF
          </v-btn>
          <v-btn
            color="orange"
            class="text-h6 white--text px-2 me-2 mb-1"
            @click="copyLinkClipboard(`/portfolio/${ user.ID }`)"
          >
            <v-icon class="me-2">mdi-share</v-icon>
            Share
          </v-btn>
        </div>
      </div>

      <v-card>

        <v-tabs v-model="tab">

          <v-tabs-slider color="primary" />

          <v-tab to="#information" class="flex-column flex-md-row flex-grow-1">
            <v-icon class="me-md-2">mdi-card-account-details</v-icon>
            <div class="d-none d-sm-inline text-h7 text-md-h6">Information</div>
          </v-tab>

          <v-tab to="#skill" class="flex-column flex-md-row flex-grow-1">
            <v-icon class="me-md-2">mdi-head-cog</v-icon>
            <div class="d-none d-sm-inline text-h7 text-md-h6">Skills</div>
          </v-tab>

          <v-tab to="#work" class="flex-column flex-md-row flex-grow-1">
            <v-icon class="me-md-2">mdi-briefcase</v-icon>
            <div class="d-none d-sm-inline text-h7 text-md-h6">Career</div>
          </v-tab>

          <v-tab to="#education" class="flex-column flex-md-row flex-grow-1">
            <v-icon class="me-md-2">mdi-school</v-icon>
            <div class="d-none d-sm-inline text-h7 text-md-h6">Education</div>
          </v-tab>

          <!-- <v-tab to="#certification" class="flex-column flex-md-row flex-grow-1">
            <v-icon class="me-md-2">mdi-file-certificate</v-icon>
            <div class="d-none d-sm-inline text-h7 text-md-h6">Certifications</div>
          </v-tab> -->

          <!-- <v-tab to="#tabs-account" class="flex-column flex-md-row flex-grow-1">
            <v-icon class="me-md-2">mdi-account-lock</v-icon>
            <div class="d-none d-sm-inline text-h7 text-md-h6">Account</div>
          </v-tab> -->

          <!-- <v-tab to="#tabs-password" class="flex-column flex-md-row flex-grow-1">
            <v-icon class="me-md-2">mdi-account-lock</v-icon>
            <div class="d-none d-sm-inline text-h7 text-md-h6">Password</div>
          </v-tab> -->

        </v-tabs>

        <v-divider/>

        <v-tabs-items v-model="tab">

          <v-tab-item value="information">
            <basic-profile-tab ref="info" :user="user" @updateUser="updateUser"/>
          </v-tab-item>

          <v-tab-item value="skill">
            <skill-tab ref="skill" :user="user"/>
          </v-tab-item>

          <v-tab-item value="work">
            <working-history-tab ref="work" :user="user"/>
          </v-tab-item>

          <v-tab-item value="education">
            <education-history-tab ref="education" :user="user"/>
          </v-tab-item>

          <!-- <v-tab-item value="certification">
            <certification-tab ref="certification" :user="user"/>
          </v-tab-item> -->

          <!-- <v-tab-item value="tabs-account">
            <change-account-tab v-if="user" :user="user" ref="tabs-account" class="pa-2 pa-md-4"/>
          </v-tab-item> -->

          <!-- <v-tab-item value="tabs-password">
            <change-password-tab  v-if="user" :user="user" ref="tabs-password" class="pa-2 pa-md-4"/>
          </v-tab-item> -->

        </v-tabs-items>

      </v-card>

    </div>
    <div v-else class="text--secondary">User not found</div>
  </transition>
</template>

<script>
import BasicProfileTab from './EditProfile/BasicProfileTab'
import SkillTab from './EditProfile/SkillTab'
import WorkingHistoryTab from './EditProfile/WorkingHistoryTab'
import EducationHistoryTab from './EditProfile/EducationHistoryTab'
// import CertificationTab from './EditProfile/CertificationTab'


// import ChangeAccountTab from './EditProfile/ChangeAccountTab.vue'
// import ChangePasswordTab from './EditProfile/ChangePasswordTab'

export default {
  components: {
    BasicProfileTab,
    SkillTab,
    WorkingHistoryTab,
    EducationHistoryTab,
    // CertificationTab

    // ChangeAccountTab
    // ChangePasswordTab
  },
  data () {
    return {
      loading: true,
      result: null,

      user: null,             // User Data
      tab: null              // Selected Tab
    }
  },
  created() {
    this.initialize()
  },
  methods: {
    async initialize() {
      await this.getUser('2')
    },

    async getUser(id) { // Temporary: use User ID from session
      await fetch( this.dbPathUrl(['user', id]), { headers: this.dbAuthHeaders } )
      .then(res => res.json())
      .then(data => {
        this.loading = false

        // Convert Query Date Format String to Form Date Format String
        // Parse null case
        this.user = {
          ...data,
          Birth: parseInt(data.Birth) > 1 ? this.formatDate(data.Birth) : null
        }
      })
      .catch(err => this.showToast('error', ['Error getting User.', err.message]))
    },

    // Update Client-side User Info
    updateUser(userInfo) {
      this.user = userInfo
    }
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

  .text-label {
    margin-top: 10px;
    margin-bottom: 12px;
  }

  .form-divider {
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse)::before {
    left: calc(24px - 1px);
  }
</style>

<style scoped>
  /* :deep(.v-text-field__details), */
  /* :deep(.v-messages) {
    display: none !important;
  } */

  :deep(.v-input__slot) {
    margin-bottom: 0 !important;
  }

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
  .v-tab {
    min-width: 0;
    max-width: none;
  }
</style>
