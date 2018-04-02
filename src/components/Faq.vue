<template>
  <v-container fluid>
    <div v-html="faq"></div>
  </v-container>
</template>

<script>
  import * as types from '../store/mutation-types'
  import { bus } from '../bus'

  export default {
    computed: {
      locale() {
        return this.$store.getters['locale']
      },
      faq() {
        const faq = this.$store.getters.getByLocale(this.locale)
        return window.marked(faq, { sanitize: true })
      }
    },
    methods: {
      getFaq() {
        this.$store.dispatch(types.FAQ_REQUEST, this.locale).then(res => {
          this.toggleLoading(false)
        }, err => {
          this.toggleLoading(false)
          if (err.code === 401) {
            this.$router.push({
              name: 'login'
            })
          }
        })
      },
      toggleLoading(v) {
        let state = types.HIDE_LOADING
        if (v) {
          state = types.SHOW_LOADING
        }
        this.$store.dispatch(state)
      }
    },
    mounted() {
      this.toggleLoading(true)
      this.getFaq()
      bus.$emit('changeTab', '')
      bus.$emit('showGoback', true)
      bus.$emit('update_toolbar_icons', null)
      bus.$emit('update_toolbar_items', null)
    }
  }
</script>