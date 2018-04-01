<template>
  <v-layout fill-height>
    <v-dialog v-model="addChannelDiaglog">
      <v-card>
        <v-card-title class="headline">{{ $t('add_channel_title') }}</v-card-title>
        <v-card-text>
          <v-form v-model="newChannelForm.valid" ref="newChannelForm" lazy-validation>
            <v-text-field v-model="newChannelForm.name" :label="$t('channel_name_label')" :rules="channelNameRules" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="addChannelDiaglog=false">{{ $t('close') }}</v-btn>
          <v-btn color="primary" :loading="submitting" :disabled="!newChannelForm.valid || submitting" @click.native="submitNewChannelForm">{{ $t('submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-flex xs12 fill-height>
      <v-list class="fill-height">
        <template v-for="(channel, index) in channels">
          <v-divider v-if="index > 0"></v-divider>
          <v-list-tile :key="channel.id" ripple :to="{name: 'channel', params: {id: channel.id}}">
            <v-list-tile-content>
              <v-list-tile-title v-text="channel.name"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
  import * as types from '../store/mutation-types'
  import i18n from '../locale/channels'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    data() {
      return {
        submitting: false,
        addChannelDiaglog: false,
        newChannelForm: {
          valid: true,
          name: ''
        }
      }
    },
    computed: {
      channels() {
        return this.$store.getters['channels']
      },
      token() {
        return this.$store.getters['token']
      },
      channelNameRules() {
        return [
          v => !!v || this.$i18n.t('error.channel_name_required'),
          v => v.length <= 20 || this.$i18n.t('error.channel_name_less_than_20'),
          v => v.length >= 5 || this.$i18n.t('error.channel_name_more_than_5')
        ]
      }
    },
    methods: {
      getChannels() {
        this.$store.dispatch(types.CHANNEL_LIST_REQUEST, this.token).then(res => {
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
      submitNewChannelForm() {
        if (!this.$refs.newChannelForm.validate()) {
          return false
        }
        this.submitting = true
        this.addChannelDiaglog = false
        this.$store.dispatch(types.CHANNEL_ADD_REQUEST, { token: this.token, name: this.newChannelForm.name }).then(res => {
          this.submitting = false
          this.getChannels()
        }, err => {
          this.showErrorDialog({ title: this.$i18n.t('error.create_channel_failed'), message: err.message })
          this.submitting = false
        })
      },
      toggleLoading(v) {
        let state = types.HIDE_LOADING
        if (v) {
          state = types.SHOW_LOADING
        }
        this.$store.dispatch(state)
      },
      showErrorDialog(err) {
        this.$store.dispatch(types.SHOW_ERROR_DIALOG, err)
      }
    },
    created() {
      bus.$on('add_channel', () => {
        this.addChannelDiaglog = true
      })
    },
    mounted() {
      this.toggleLoading(true)
      this.getChannels()
      bus.$emit('update_toolbar_icons', [{ name: 'addChannel', icon: 'mdi-plus', event: { name: 'add_channel' } }])
      bus.$emit('update_toolbar_items', null)
    },
    beforeDestroy() {
      bus.$off('add_channel')
    }
  }

</script>