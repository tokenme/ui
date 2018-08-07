<template>
  <div class="guide" v-if="isVisible">
    <div class="header">
      <router-link class="title" to="/" >
        <img src="https://open.weixin.qq.com/cgi-bin/openproxy?url=http%3A%2F%2Fwx.qlogo.cn%2Fmmhead%2FQ3auHgzwzM6fd6a9G6qY8JjsRNpytSwEBz084wpZqNvQibzMDTsVw2A%2F0" />
        <span>糖果航母</span>
      </router-link>
      <router-link to="/">
        <Icon type="md-contact" size='32' color='#dd3232'/>
      </router-link>
    </div>
    <div class="center">
      <v-carousel class="swiper" :cycle='false' hide-controls   >
        <v-carousel-item>
          <img src="https://static.tianxi100.com/img/wechat_mp_guide/1.jpg">
        </v-carousel-item>
        <v-carousel-item>
          <img src="https://static.tianxi100.com/img/wechat_mp_guide/2.jpg">
        </v-carousel-item>
        <v-carousel-item>
          <img src="https://static.tianxi100.com/img/wechat_mp_guide/3.jpg">
        </v-carousel-item>
        <v-carousel-item>
          <img src="https://static.tianxi100.com/img/wechat_mp_guide/4.jpg">
        </v-carousel-item>
      </v-carousel>
    </div>
    <div class="footer">
      <a href="javascript:void(0)" @click="auth">进入钱包 ></a>
    </div>
  </div>
</template>

<script>
import * as types from '../store/mutation-types'
export default {
  name: 'Guide',
  data: {
    return: {
      isVisible: false,
      jwt: '',
      mpCode: ''
    }
  },
  methods: {
    auth() {
      location.href = window.location.protocol + '//' + window.location.hostname + '/auth/wechat-mp/get-code';
      // location.href = 'https://tmm.tianxi100.com/auth/wechat-mp/get-code';
    }
  },
  created() {
    this.jwt = localStorage.getItem('jwt')
    this.mpCode = this.$route.query.code
    let relogin = this.$route.query.relogin || 0
    let shareKey = localStorage.getItem('share_key') || null
    if (this.jwt === null) {
      if (this.mpCode) {
        this.$store.dispatch(types.LOGIN_REQUEST, {
          wechat_mp_code: this.mpCode
        }).then(res => {
          if (res.token) {
            localStorage.setItem('jwt', JSON.stringify(res));
            if (shareKey !== null) {
              localStorage.removeItem('share_key')
              this.$router.replace('/show/' + shareKey)
            } else {
              this.$router.replace('/')
            } 
          }
        })
      } else {
        if (relogin === 0) {
          this.isVisible = true
        } else {
          location.href = window.location.protocol + '//' + window.location.hostname + '/auth/wechat-mp/get-code'
        }
      }
    } else {
      this.$store.dispatch(types.USER_INFO_REQUEST).then(res => {
        if (shareKey !== null) {
          localStorage.removeItem('share_key')
          this.$router.replace('/show/' + shareKey)
        } else {
          this.$router.replace('/')
        } 
      }, err => {
        console.log(err)
        localStorage.clear()
        location.href = window.location.protocol + '//' + window.location.hostname + '/auth/wechat-mp/get-code'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
a {
  color: #ffffff;
}
a:active,a:hover{
  color: #ffffff
}
html,body{
  height: 100%;
}
.guide{
  background:#ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-between;
}
.guide .header{
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: space-between;
  padding: 3% 3%;
  .title{
    display: flex;
    align-items: center;
    margin-top: 28px;
    span{
      font-size: 16px;
      font-weight: 600;
      color: black
    }
  }
  img{
    height:50px;
  }
}
.guide .center{
  .swiper{
    margin-top: 10%;
    border-top: 0.1px solid #ffffff;
    .v-carousel__controls{
      margin-bottom: 10%;
      background: none;
    }
    .v-btn{
      margin: 6% !important;
    }
    .v-carousel__controls__item{
      color:#7f7d77;
      width: 10px;
      height: 10px;
    }
    .v-carousel__controls__item--active{
      color: #dd3232 !important;
    }
    div.jumbotron__content{
      display: flex;
      align-items: center;
    }
    .theme--dark.btn{
        color: #7f7d77;
    }
    div.carousel__controls{
        background: #ffffff;
    }
  }
  .swiper img{
    width: 100%;
    margin: auto;
  }
}
.guide .footer{
  width: 100%;
  height:40%;
  background: #e91e63;
  color: #ffffff;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  .plane{
    margin-right: 10px
  }
}
.guide .footer a{
  text-decoration:none;
}
</style>
