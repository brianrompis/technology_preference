<template>
  <div>
    <div class="text-h4 text-md-h3">Certificates</div>

    <div class="text-h5 py-3 text--secondary">
      Work in progress: Archipelago Certificates
    </div>

  </div>
</template>
<script>

export default {
  components:{

  },
  data() { return {
    certificates: [],
    tab: null,
    result: null
  }},
  created() {
    this.initialize()
  },
  methods: {
    async initialize() {
      await this.getUserCertificates(2)
    },

    async getUserCertificates(id) {
      try {
        const res = await fetch(
          this.dbPathUrl(['certificate', id]),
          { headers: this.dbAuthHeaders }
        )

        !res.ok && this.showToast('error', ['Error getting User Certificates.', res.status, res.statusText])

        const data = await res.json()

        this.result = this.formatResult(res, data)

        data && (this.certificates = data)
      } catch (err) {
        this.result = err.message
        this.showToast('error', ['Error getting User Certificates.', this.result])
      }
    }
  }
}
</script>
<style>

</style>
