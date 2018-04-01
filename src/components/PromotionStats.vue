<template>
  <v-container class="fluid white">
    <v-layout row wrap>
      <v-flex xs6>
        <v-menu
          ref="start_date_menu"
          lazy
          :close-on-content-click="false"
          v-model="start_date_menu"
          transition="scale-transition"
          offset-y
          :nudge-right="40"
          min-width="290px"
          :return-value.sync="options.start_date"
        >
          <v-text-field slot="activator" v-model="options.start_date" :label="$t('start_date_label')" prepend-icon="mdi-calendar-today" readonly></v-text-field>
          <v-date-picker v-model="options.start_date" @change="saveStartDate" :max="today" no-title scrollable></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs6>
        <v-menu
          ref="end_date_menu"
          lazy
          :close-on-content-click="false"
          v-model="end_date_menu"
          transition="scale-transition"
          offset-y
          :nudge-right="40"
          min-width="290px"
          :return-value.sync="options.end_date"
        >
          <v-text-field slot="activator" v-model="options.end_date" :label="$t('end_date_label')" prepend-icon="mdi-calendar-today" readonly></v-text-field>
          <v-date-picker v-model="options.end_date" @change="saveEndDate" :max="today" no-title scrollable></v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-select
      :items="chartSeriesSelections"
      v-model="chartSeries"
      item-text="text"
      item-value="value"
      single-line
      top
      class="mx-2 d-block"
      ></v-select>
    <line-chart
      :chart-data="chartData"
      :options="{responsive: true, maintainAspectRatio: true}"
      :height="200"
      >
    </line-chart>
    <v-data-table
      :headers="headers"
      :items="stats"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate v-if="loading"></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ dateFormat(props.item.record_on) }}</td>
        <td class="text-xs-right">{{ props.item.pv }}</td>
        <td class="text-xs-right">{{ props.item.submissions }}</td>
        <td class="text-xs-right">{{ props.item.transactions }}</td>
        <td class="text-xs-right">{{ props.item.give_out }}</td>
        <td class="text-xs-right">{{ props.item.bonus }}</td>
        <td class="text-xs-right">{{ props.item.commission_fee }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import promotionAPI from '../api/promotion'
  import LineChart from './LineChart.vue'
  import i18n from '../locale/stats'
  import moment from 'moment'

  export default {
    i18n: i18n,
    components: {
      'line-chart': LineChart
    },
    data() {
      return {
        loading: false,
        options: {
          start_date: '',
          end_date: ''
        },
        pagination: {
          sortBy: 'record_on',
          descending: true
        },
        chartSeries: 'pv',
        stats: [],
        summary: null
      }
    },
    props: {
      promotionId: 0
    },
    computed: {
      token() {
        return this.$store.getters['token']
      },
      headers() {
        return [
          { text: this.$i18n.t('stats.header.record_on'), value: 'record_on' },
          { text: this.$i18n.t('stats.header.pv'), value: 'pv' },
          { text: this.$i18n.t('stats.header.submissions'), value: 'submissions' },
          { text: this.$i18n.t('stats.header.transactions'), value: 'transactions' },
          { text: this.$i18n.t('stats.header.give_out'), value: 'give_out' },
          { text: this.$i18n.t('stats.header.bonus'), value: 'bonus' },
          { text: this.$i18n.t('stats.header.commission_fee'), value: 'commission_fee' }
        ]
      },
      chartSeriesSelections() {
        return [
          { text: this.$i18n.t('stats.header.pv'), value: 'pv' },
          { text: this.$i18n.t('stats.header.submissions'), value: 'submissions' },
          { text: this.$i18n.t('stats.header.transactions'), value: 'transactions' },
          { text: this.$i18n.t('stats.header.give_out'), value: 'give_out' },
          { text: this.$i18n.t('stats.header.bonus'), value: 'bonus' },
          { text: this.$i18n.t('stats.header.commission_fee'), value: 'commission_fee' }
        ]
      },
      chartData() {
        let labels = []
        let data = []
        for (const i of this.stats) {
          labels.push(moment(i.record_on).format('DD/MM'))
          data.push(i[this.chartSeries])
        }
        let dataSets = []
        if (data.length > 0) {
          dataSets = [
            { label: this.$i18n.t('stats.header.' + this.chartSeries), backgroundColor: '#2196F3', data: data }
          ]
        }
        return { labels: labels, datasets: dataSets }
      }
    },
    methods: {
      dateFormat(d) {
        return moment(d).format('YYYY-MM-DD')
      },
      saveStartDate (date) {
        this.$refs.start_date_menu.save(date)
        this.getStats()
      },
      saveEndDate (date) {
        this.$refs.end_date_menu.save(date)
        this.getStats()
      },
      getStats() {
        const payload = {
          promotion_id: this.promotionId,
          start_date: this.options.start_date,
          end_date: this.options.end_date
        }
        this.loading = true
        promotionAPI.stats(this.token, payload).then((response) => {
          this.loading = false
          if (!response.code) {
            let stats = []
            if (response.stats) {
              for (let s of response.stats) {
                s['bonus'] /= Math.pow(10, s['decimals'])
                stats.push(s)
              }
            }
            this.stats = stats
            this.summary = response.summary
          }
        })
      }
    },
    mounted() {
      this.getStats()
    }
  }
</script>