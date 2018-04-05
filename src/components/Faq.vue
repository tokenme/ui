<template>
  <v-container fluid class="px-0 pt-0 pb-0">
    <v-expansion-panel focusable>
      <v-expansion-panel-content v-for="(item, idx) in faq" :key="idx">
        <div slot="header">{{ item.title }}</div>
        <v-card>
          <v-card-text class="grey lighten-3">{{ item.desc }}</v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
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
        return this.$store.getters.getByLocale(this.locale)
      }
    },
    methods: {
      getFaq() {
        this.$store.dispatch(types.FAQ_REQUEST).then(res => {
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