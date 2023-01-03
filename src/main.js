import Vue from 'vue'
import App from './App.vue'

// VUEX - https://vuex.vuejs.org/
import store from './store'

// VUE-ROUTER - https://router.vuejs.org/
import router from './router'

// PLUGINS
import vuetify from './plugins/vuetify'
import i18n from './plugins/vue-i18n'
import './plugins/vue-google-maps'
import './plugins/vue-shortkey'
import './plugins/vue-head'
import './plugins/vue-gtag'
import './plugins/apexcharts'
import './plugins/echarts'
import './plugins/animate'
import './plugins/clipboard'
import './plugins/moment'

// FILTERS
import './filters/capitalize'
import './filters/lowercase'
import './filters/uppercase'
import './filters/formatCurrency'
import './filters/formatDate'

// STYLES
// Main Theme SCSS
import './assets/scss/theme.scss'

// Animation library - https://animate.style/
import 'animate.css/animate.min.css'

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false

/*
|---------------------------------------------------------------------
| Main Vue Instance
|---------------------------------------------------------------------
|
| Render the vue application on the <div id="app"></div> in index.html
|
| https://vuejs.org/v2/guide/instance.html
|
*/

import _ from 'lodash'
Object.defineProperty(Vue.prototype, '$_', { value: _ });

import moment from 'moment'
import 'moment-precise-range-plugin'
import DB from './configs/db'
import ProgressCircular from './components/ProgressCircular'

Vue.mixin({

  components: {
    ProgressCircular
  },

  data() { return {
    dbAuthHeaders: { Authorization: 'Basic ' + Buffer.from(DB.username + ':' + DB.password).toString('base64') },

    // Frontend "Tables"

    classroomStatus: {
      all:      'ALL',
      active:   'ACTIVE',
      draft:    'DRAFT',
      pending:  'PENDING',
      closed:   'CLOSED',
    },

    classroomDepartments: {
      0: 'ALL',
      1: 'General',
      2: 'Information Technology',
      3: 'Front Office',
      4: 'Engineering',
      5: 'Housekeeping',
      6: 'FB Product',
      7: 'FB Service',
      8: 'Sales & Marketing',
      9: 'Human Resources',
      10: 'Accounting',
    },
  }},

  methods: {

    // Make Backend Path URL
    dbPathUrl: path => [DB.baseUrl, ...[].concat(path)].join('/'),
    // Make Backend Path URL with Parameters
    dbPathParamsUrl: (path, params) => [DB.baseUrl, ...[].concat(path)].join('/') + '?' + URLSearchParams(params).toString(),

    formatResult : (res, data) => JSON.stringify({
      status: res.status + '-' + res.statusText,
      headers: {
        'Content-Type': res.headers.get('Content-Type'),
        'Content-Length': res.headers.get('Content-Length')
      },
      length: res.headers.get('Content-Length'),
      data
    }, null, 2),

    formatDateTime : date => new Date(date).toISOString(),
    formatDate : date => new Date(date).toISOString().split('T')[0],
    formatDateMonthYear: date => {
      return new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: 'short' })
    },

    formatDateShort: date => {
      return date ? new Date(date).toLocaleDateString('id', { year: '2-digit', month: '2-digit', day: '2-digit'}) : '-'
    },

    roundWithString : (num, string, round) => {
      num = num.toString().split('.')

      return num[0] + (num[1] ? string : round || '')
    },

    copyLinkClipboard(route) {
      navigator.clipboard.writeText(location.origin + route)
      this.showToast('success', 'Link copied to clipboard.')
    },

    getDuration(start, end) {
      return moment(end ? this.formatDateTime(end) : undefined)
        .preciseDiff(moment(this.formatDateTime(start)), true)
    },

    formatDuration(start, end) {
      const { years, months, days } = this.getDuration(start, end)

      return [
        years ? `${ years }y` : null,
        months ? `${ months }m` : null,
        days ? `${ months }d` : null
      ].join(' ')
    },

    formatDurationYears(start, end) {
      const years = (end || new Date().getFullYear()) - start

      return /* html */`
        ${ start } — ${ end || 'Present' }
        <div class="mx-1 font-weight-black">·</div>
        ${ years }y
      `
    },

    getDurationDays(start, end) {
      return moment(end ? this.formatDateTime(end) : undefined)
        .diff(moment(this.formatDateTime(start)), 'days', false)
    },

    // Trigger Toast with Mode
    showToast(color, strings) {
      this.$store.commit('app/showToast', {
        color,
        message:
          ({
            error: 'Error: ',
            warning: 'Warning: '
          }[color] || '')                         // Add Label depending on Mode
          + [].concat(strings).join('\n'),        // Force convert string/s to Array
        timeout: color === 'error' ? 10000 : 3000
      })
    }
  }
})

export default new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
