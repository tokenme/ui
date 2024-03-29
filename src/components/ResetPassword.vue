<template>
  <v-layout fill-height>
    <v-flex xs12 fill-height>
      <v-card flat tile>
        <v-card-text>
          <v-form v-model="registerForm.valid" ref="form" lazy-validation>
            <v-select
              :items="countries"
              :filter="countryFilter"
              v-model="countryCode"
              item-text="name"
              item-value="code"
              :label="$t('form.country')"
              :rules="countryCodeRules"
              autocomplete
              required
            >
              <template slot="item" slot-scope="data">
                <span>{{ data.item.name }}, +{{ data.item.code }}</span>
              </template>
            </v-select>
            <v-text-field prepend-icon="mdi-cellphone-iphone" v-model="registerForm.mobile" :label="$t('form.mobile')" @change="onMobileChange" :rules="mobileRules" required></v-text-field>
            <v-btn block color="primary" :loading="authSending" :disabled="smsCountdown>0 || !registerForm.mobile || !countryCode || verifing" @click="authSend">{{ authSendBtn }}</v-btn>
            <v-text-field prepend-icon="mdi-verified" v-model="registerForm.verify_code" :label="$t('form.verify_code')" :rules="verifyRules" required></v-text-field>
            <v-text-field prepend-icon="mdi-key" v-model="registerForm.passwd" :label="$t('form.password')" :rules="passwordRules" type="password"></v-text-field>
            <v-text-field prepend-icon="mdi-key" v-model="registerForm.repasswd" :label="$t('form.repassword')" :rules="repasswordRules" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" :to="{name: 'login'}">{{ $t('login') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!registerForm.valid || submitting" :loading="submitting" @click="submitForm">{{ $t('submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import * as types from '../store/mutation-types'
  import smsAPI from '../api/sms'
  import userAPI from '../api/user'
  import {countries} from '../twilio-countries'
  import i18n from '../locale/register'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    data() {
      return {
        submiting: false,
        registerForm: {
          valid: true,
          mobile: '',
          passwd: '',
          repasswd: '',
          verify_code: ''
        },
        countries: countries,
        countryFilter (item, queryText, itemText) {
          const hasValue = val => val != null ? val : ''
          const text = hasValue(item.name)
          const query = hasValue(queryText)
          return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
        },
        authSending: false,
        verifing: false,
        smsCountdown: 0
      }
    },
    computed: {
      countryCode: {
        get() {
          return this.$store.getters['countryCode']
        },
        set(value) {
          this.$store.dispatch(types.CHANGE_COUNTRY_CODE_REQUEST, value)
        }
      },
      authSendBtn() {
        if (this.smsCountdown <= 0) {
          return this.$i18n.t('auth_send')
        }
        return '(' + this.smsCountdown + ') ' + this.$i18n.t('auth_send')
      },
      countryCodeRules() {
        return [
          v => !!v || this.$i18n.t('error.country_code_required')
        ]
      },
      mobileRules() {
        return [
          v => !!v || this.$i18n.t('error.mobile_required'),
          v => /^\d{1,14}$/.test(v) || this.$i18n.t('error.mobile_invalid')
        ]
      },
      verifyRules() {
        return [
          v => !!v || this.$i18n.t('error.mobile_verified')
        ]
      },
      passwordRules() {
        return [
          v => !!v || this.$i18n.t('error.password_required')
        ]
      },
      repasswordRules() {
        return [
          v => this.registerForm.passwd === v || this.$i18n.t('error.repassword_invalid')
        ]
      }
    },
    methods: {
      authSendCountdown() {
        let self = this
        self.smsCountdown -= 1
        if (self.smsCountdown <= 0) {
          return
        }
        setTimeout(self.authSendCountdown, 1000)
      },
      onMobileChange() {
        this.registerForm.verify_code = ''
      },
      authSend() {
        this.authSending = true
        this.smsCountdown = 60
        smsAPI.authSend({ mobile: this.registerForm.mobile, country: this.countryCode }).then((response) => {
          this.authSending = false
          if (response.code) {
            this.smsCountdown = 0
            this.showErrorDialog({ title: this.$i18n.t('error.auth_send_failed'), message: response.message })
          } else {
            let self = this
            setTimeout(self.authSendCountdown, 1000)
          }
        })
      },
      submitForm(e) {
        if (!this.$refs.form.validate()) {
          return false
        }
        const payload = {
          country_code: this.countryCode,
          mobile: this.registerForm.mobile,
          verify_code: this.registerForm.verify_code,
          passwd: this.registerForm.passwd,
          repasswd: this.registerForm.repasswd
        }
        this.submitting = true
        userAPI.resetPassword(payload).then((response) => {
          this.submitting = false
          if (response.code) {
            this.showErrorDialog({ title: this.$i18n.t('error.failed_title'), message: response.message })
            return
          }
          this.$router.push({
            name: 'login'
          })
        })
      },
      showErrorDialog(err) {
        this.$store.dispatch(types.SHOW_ERROR_DIALOG, err)
      }
    },
    mounted() {
      bus.$emit('update_toolbar_icons', null)
      bus.$emit('update_toolbar_items', null)
    }
  }
</script>