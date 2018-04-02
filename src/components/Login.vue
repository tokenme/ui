<template>
  <v-container fluid full-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card flat>
          <v-card-title class="d-block text-xs-center">
            <img src="https://static.tianxi100.com/img/logo/200x200.png" width="120"/>
          </v-card-title>
          <v-card-text>
            <v-form v-model="loginForm.valid" ref="form" lazy-validation>
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
              <v-text-field prepend-icon="mdi-cellphone-iphone" v-model="loginForm.mobile" :label="$t('form.mobile')" :rules="mobileRules" required></v-text-field>
              <v-text-field prepend-icon="mdi-key" v-model="loginForm.passwd" :label="$t('form.password')" :rules="passwordRules" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" :to="{name: 'register'}">{{ $t('register') }}</v-btn>
            <v-btn color="danger" :to="{name: 'resetPassword'}">{{ $t('reset_password') }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!loginForm.valid || submitting" :loading="submitting" @click="submitForm">{{ $t('login') }}</v-btn>
          </v-card-actions>
          <v-card-actions>
            <telegram-login 
                mode="callback"
                telegram-login="TokenmeBot"
                userpic = "true"
                @callback="telegramLoginCallback">
            </telegram-login>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import TelegramLogin from '../components/TelegramLogin.vue'
  import * as types from '../store/mutation-types'
  import {countries} from '../twilio-countries'
  import i18n from '../locale/login'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    components: {
      'telegram-login': TelegramLogin
    },
    data() {
      return {
        submitting: false,
        loginForm: {
          valid: true,
          passwd: '',
          mobile: ''
        },
        countries: countries,
        countryFilter (item, queryText, itemText) {
          const hasValue = val => val != null ? val : ''
          const text = hasValue(item.name)
          const query = hasValue(queryText)
          return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
        }
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
      passwordRules() {
        return [
          v => !!v || this.$i18n.t('error.password_required')
        ]
      }
    },
    methods: {
      telegramLoginCallback(user) {
        this.submitting = true
        this.$store.dispatch(types.TELEGRAM_UPDATE_REQUEST, user)
        this.$store.dispatch(types.LOGIN_REQUEST, {
          telegram: JSON.stringify(user)
        }).then(res => {
          this.submitting = false
          if (this.$router.query && this.$router.query.redirect) {
            this.$router.push(this.$router.query.redirect)
          } else {
            this.$router.push({
              path: '/'
            })
          }
        }, err => {
          this.submitting = false
          if (user && user.id !== 0) {
            this.showErrorDialog({ title: this.$i18n.t('failed_title'), message: this.$i18n.t('error.telegram_auth') })
            return
          }
          this.showErrorDialog({ title: this.$i18n.t('failed_title'), message: err.message })
        })
      },
      submitForm(e) {
        if (!this.$refs.form.validate()) {
          return false
        }
        this.submitting = true
        this.$store.dispatch(types.LOGIN_REQUEST, {
          username: this.countryCode + '.' + this.loginForm.mobile,
          password: this.loginForm.passwd
        }).then(res => {
          this.submitting = false
          if (this.$router.query && this.$router.query.redirect) {
            this.$router.push(this.$router.query.redirect)
          } else {
            this.$router.push({
              path: '/'
            })
          }
        }, err => {
          this.submitting = false
          this.showErrorDialog({ title: this.$i18n.t('failed_title'), message: err.message })
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