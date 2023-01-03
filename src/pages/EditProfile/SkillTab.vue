<template>
  <div v-if="userSkills">
    <!-- Mobile Title -->
    <div class="d-sm-none">
      <div class="text-h4 primary--text font-weight-bold mx-2 mt-2">Skills</div>
      <v-divider/>
    </div>

    <!-- Skills -->
    <!-- Schools Input Form -->
    <transition appear mode="out-in">
      <progress-circular v-if="loading"/>
      <v-timeline v-else align-top dense class="ms-md-2 pt-2 pt-md-4 pe-2 pe-md-4">

        <transition-group appear>
          <!-- Add Skill -->
          <v-timeline-item
            key="newSkill"
            small color="green"
            class="pb-2 pb-md-4"
            :hide-dot="!newSkillModes.edit"
          >
            <transition mode="out-in">

              <v-form v-if="newSkillModes.edit" v-model="newSkillModes.valid"
                class="ms-md-2"
              >
                <v-text-field v-model="newSkill.Name"
                  outlined dense
                  label="Name *"
                  hide-details="auto"
                  class="mb-1"
                  :rules="rules.required"
                />
                <v-text-field v-model="newSkill.Description"
                  outlined dense
                  label="Description"
                  hide-details="auto"
                  class="mb-1"
                />
                <div class="d-flex align-center">
                  <div class="me-2">Level:</div>
                  <v-rating v-model="newSkill.Level"
                    color="orange" empty-icon="mdi-circle-outline" full-icon="mdi-circle"
                    icon-label="Level"
                    length="5" size="20"
                  />
                  <v-divider vertical class="mx-1" />
                  <v-btn v-show="newSkill.Level"
                    icon
                    @click="newSkill.Level = 0"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>

                <!-- Create Buttons -->
                <div class="d-flex align-center mt-2">
                  <v-btn
                    color="green"
                    class="white--text text-h6 me-1"
                    :disabled="!newSkillModes.valid"
                    :loading="newSkillModes.saving"
                    @click="addNewSkill"
                  >
                    <v-icon class="me-1">mdi-content-save</v-icon>
                    Save
                  </v-btn>
                  <v-btn
                    color="secondary"
                    class="text-h6 mx-1"
                    @click="resetNewSkill"
                  >
                    Cancel
                  </v-btn>
                  <div class="ms-1 text--secondary">* Required</div>
                </div>

              </v-form>

              <v-btn v-else
                color="green"
                class="text-h6 white--text ms-md-2"
                @click="newSkillModes.edit = true"
              >
                <v-icon class="me-1">mdi-plus</v-icon>
                Add
              </v-btn>
            </transition>
          </v-timeline-item>

          <!-- User Skill -->
          <v-timeline-item v-for="skill in sortedUserSkills" v-if="userSkills"
            :key="skill.ID"
            small
            class="pb-2 pb-md-4"
            :color="userSkillsModes[skill.ID].edit ? 'orange' : 'primary'"
          >
            <transition mode="out-in">
              <!-- Edit Form -->
              <v-form v-if="userSkillsModes[skill.ID].edit" v-model="userSkillsModes[skill.ID].valid"
                class="ms-md-2"
              >
                <v-text-field v-model="userSkills[skill.ID].Name"
                  outlined dense
                  label="Name *"
                  hide-details="auto"
                  class="mb-1"
                  :rules="rules.required"
                />
                <v-text-field v-model="userSkills[skill.ID].Description"
                  outlined dense
                  label="Description"
                  hide-details="auto"
                  class="mb-1"
                />
                <div class="d-flex align-center">
                  <div class="me-2">Level:</div>
                  <v-rating v-model="userSkills[skill.ID].Level"
                    color="orange" empty-icon="mdi-circle-outline" full-icon="mdi-circle"
                    icon-label="Level"
                    length="5" size="20"
                  />
                  <div v-show="userSkills[skill.ID].Level">
                    <v-divider vertical class="mx-1" />
                    <v-btn icon @click="userSkills[skill.ID].Level = 0">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>

                <!-- Edit Buttons -->
                <div class="d-flex align-center mt-2">
                  <v-btn
                    color="green"
                    class="white--text text-h6 me-1"
                    :disabled="!userSkillsModes[skill.ID].valid"
                    :loading="userSkillsModes[skill.ID].saving"
                    @click="editSkill(skill.ID)"
                  >
                    <v-icon class="me-1">mdi-content-save</v-icon>
                    Save
                  </v-btn>
                  <v-btn
                    color="secondary"
                    class="text-h6 mx-1"
                    @click="resetSkill(skill.ID)"
                  >
                    Cancel
                  </v-btn>
                  <div class="ms-1 text--secondary">* Required</div>
                </div>

              </v-form>
              <!-- Info Display -->
              <div v-else class="ms-md-2">

                <!-- SKILL INFO -->
                <div class="d-flex">
                  <div>
                    <div
                      class="text-h6"
                      style="line-height: normal;"
                      v-text="skill.Name"
                    />
                    <div v-if="skill.Description" v-text="skill.Description"/>
                    <v-rating v-if="skill.Level"
                      readonly length="5" size="16"
                      empty-icon="mdi-circle-outline" full-icon="mdi-circle"
                      icon-label="Level"
                      :value="skill.Level"
                    />
                  </div>
                  <v-spacer/>
                  <v-btn
                    icon small color="orange"
                    class="me-1"
                    @click="userSkillsModes[skill.ID].edit = true"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon small color="red"
                    @click="deleteSkill(skill.ID)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>

            </transition>
          </v-timeline-item>

        </transition-group>

      </v-timeline>
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
      userSkills: {
        // skill: {
        //  ID:
        //  Name:
        //  Level:
        //  Description:
        // }
      },

      // Deep Copy of DB Fetch, for Forms reset
      userSkillsOriginal: {},

      // Edit, Valid & Loading states of each User Skill Form
      userSkillsModes: {
        // skill: {
        //   edit: false,
        //   valid: true,
        //   saving: false
        // }
      },

      // New Skill Form contents
      newSkill: null,

      newSkillOriginal: {
        // ID: crypto.randomUUID()
        UserID: this.user.ID
        //
      },

      // Edit, Valid & Loading states of new Skill Form
      newSkillModes: {
        edit: false,
        valid: false,
        saving: false
      },

      // Form Input validations
      rules: {
        required: [value => !!value || 'Required.']
      }
    }
  },

  computed: {
    // Sorted User Edus for display
    sortedUserSkills() {
      // Object of Skills to Sorted Array of Skills by Level
      return Object.values(this.userSkills).sort((a, b) => b.Level - a.level)
    }
  },

  created() {
    // this.initialize()
    this.getUserSkills()
    this.newSkill = _.cloneDeep(this.newSkillOriginal)
  },

  methods: {
    // async initialize() { this.getUserSkills() },

    // Get User Skills
    async getUserSkills() {
      await fetch(
        this.dbPathUrl(['skill', 'user', this.user.ID]),
        { headers: this.dbAuthHeaders }
      )
      .then(res => res.json())
      .then(data => {
        this.loading = false

        console.log(data)

        data.forEach(skill => {
          // Save into object of objects
          this.$set(this.userSkills, skill.ID, {
            ...skill
          })
          // Set Edit, Valid & Saving modes for each Skill Form
          this.$set(this.userSkillsModes, skill.ID, {
            edit: false, valid: true, saving: false
          })
        })
        // Save deep clone of all Skills for Forms reset
        this.userSkillsOriginal = _.cloneDeep(this.userSkills)
      })
      .catch(err => {
        this.loading = false
        this.showToast('error', ['Error getting User Skills.', err.message])
      })
    },

    resetNewSkill() {
      this.newSkill = _.cloneDeep(this.newSkillOriginal)
      this.newSkillModes.edit = false
    },

    async addNewSkill() {
      // Make new ID for new Skill
      const ID = crypto.randomUUID()
      const newSkill = {
        ..._.cloneDeep(this.newSkill),
        ID,
        UserID: this.user.ID
      }

      await fetch(
        this.dbPathUrl('skill'),
        {
          method: 'POST',
          headers: this.dbAuthHeaders,
          body: JSON.stringify([newSkill])
        }
      )
      .then(res => {
        // Add to Array, make modes, clone original too
        this.$set(this.userSkills, ID, newSkill)
        this.$set(this.userSkillsModes, ID, {
          edit: false, valid: true, saving: false
        })
        this.userSkillsOriginal[ID] = _.cloneDeep(newSkill)
        this.resetNewSkill()
      })
      .catch(err => {
        this.showToast('error', ['Error adding User Skill.', err.message])
      })

    },

    resetSkill(id) {
      this.userSkills[id] = _.cloneDeep(this.userSkillsOriginal[id])
      this.userSkillsModes[id].edit = false
    },

    async editSkill(id) {
      this.userSkillsModes[id].saving = true
      this.userSkillsOriginal[id] = _.cloneDeep(this.userSkills[id])
      const skill = this.userSkills[id]

      await fetch(
        this.dbPathUrl(['skill', id]),
        {
          method: 'PUT',
          headers: this.dbAuthHeaders,
          body: JSON.stringify([skill])
        }
      )
      .then(res => {
        this.userSkillsModes[id].saving = false
        this.userSkillsModes[id].edit = false
      })
      .catch(err => {
        this.showToast('error', ['Error editing User Skill.', err.message])
      })

    },

    async deleteSkill(id) {
      if (confirm('Are you sure?')) {

        await fetch(
          this.dbPathUrl(['skill', id]),
          {
            method: 'DELETE',
            headers: this.dbAuthHeaders,
          }
        )
        .then(res => {
          this.$delete(this.userSkills, id)
          this.$delete(this.userSkillsOriginal, id)
        })
        .catch(err => {
          this.showToast('error', ['Error deleting User Skill.', err.message])
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
