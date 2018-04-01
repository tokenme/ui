<template>
  <v-layout fill-height>
    <v-dialog v-model="addAdzoneDiaglog">
      <v-card>
        <v-card-title class="headline">{{ $t('add_adzone_title') }}</v-card-title>
        <v-card-text>
          <v-form v-model="newAdzoneForm.valid" ref="newAdzoneForm" lazy-validation>
            <v-text-field v-model="newAdzoneForm.name" :label="$t('adzone_name_label')" :rules="adzoneNameRules" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="addAdzoneDiaglog=false">{{ $t('close') }}</v-btn>
          <v-btn color="primary" :loading="submitting" :disabled="!newAdzoneForm.valid || submitting" @click.native="submitNewAdzoneForm">{{ $t('submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-flex xs12 fill-height>
      <v-list class="fill-height">
        <template v-for="(adzone, index) in adzones">
          <v-subheader v-if="adzone.header" :key="adzone.header">{{ $t('channel') }}: {{ adzone.header }}</v-subheader>
          <v-divider v-if="index > 0"></v-divider>
          <v-list-tile v-if="!adzone.header" :key="adzone.id">
            <v-list-tile-content>
              <v-list-tile-title v-text="adzone.name"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
  import * as types from '../store/mutation-types'
  import i18n from '../locale/adzones'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    data() {
      return {
        submitting: false,
        channelId: 0,
        addAdzoneDiaglog: false,
        newAdzoneForm: {
          valid: true,
          name: ''
        }
      }
    },
    computed: {
      adzones() {
        const adzones = this.$store.getters.getAdzonesByChannelId(this.channelId)
        return [{header: this.channel.name}, ...adzones]
      },
      channel() {
        return this.$store.getters.getChannelById(this.channelId)
      },
      token() {
        return this.$store.getters['token']
      },
      adzoneNameRules() {
        return [
          v => !!v || this.$i18n.t('error.adzone_name_required'),
          v => v.length <= 20 || this.$i18n.t('error.adzone_name_less_than_20'),
          v => v.length >= 5 || this.$i18n.t('error.adzone_name_more_than_5')
        ]
      }
    },
    methods: {
      getChannels() {
        this.$store.dispatch(types.CHANNEL_LIST_REQUEST, this.token).then(res => {}, err => {
          if (err.code === 401) {
            this.$router.push({
              name: 'login'
            })
            return
          }
          this.showErrorDialog({ title: this.$i18n.t('error.get_channels_failed'), message: err.message })
        })
      },
      getAdzones() {
        this.$store.dispatch(types.ADZONE_LIST_REQUEST, { token: this.token, channel_id: this.channelId }).then(res => {
          this.toggleLoading(false)
        }, err => {
          this.toggleLoading(false)
          if (err.code === 401) {
            this.$router.push({
              name: 'login'
            })
            return
          }
          this.showErrorDialog({ title: this.$i18n.t('failed_title'), message: err.message })
        })
      },
      submitNewAdzoneForm() {
        if (!this.$refs.newAdzoneForm.validate()) {
          return false
        }
        this.submitting = true
        this.addAdzoneDiaglog = false
        this.$store.dispatch(types.ADZONE_ADD_REQUEST, { token: this.token, name: this.newAdzoneForm.name, channel_id: this.channelId }).then(res => {
          this.submitting = false
          this.getAdzones()
        }, err => {
          this.showErrorDialog({ title: this.$i18n.t('error.add_adzone_failed'), message: err.message })
          this.submitting = false
        })
      },
      showErrorDialog(err) {
        this.$store.dispatch(types.SHOW_ERROR_DIALOG, err)
      },
      toggleLoading(v) {
        let state = types.HIDE_LOADING
        if (v) {
          state = types.SHOW_LOADING
        }
        this.$store.dispatch(state)
      }
    },
    created() {
      this.channelId = parseInt(this.$route.params.id)
      bus.$on('add_adzone', () => {
        this.addAdzoneDiaglog = true
      })
    },
    mounted() {
      this.toggleLoading(true)
      this.getAdzones()
      const channel = this.$store.getters.getChannelById(this.channelId)
      if (channel.id === undefined) {
        this.getChannels()
      }
      bus.$emit('update_toolbar_icons', [{ name: 'addAdzone', icon: 'mdi-plus', event: { name: 'add_adzone' } }])
    },
    beforeDestroy() {
      bus.$off('add_adzone')
    }
  }

</script>