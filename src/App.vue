<template>
  <div id="app">
    <transition name="bounce">
      <keep-alive>
        <router-view class="router-view"></router-view>
      </keep-alive>
    </transition>

    <warn-info :warn-msg="AlertMsg" :timeout="AlertTimout" :is-warn="AlertStatus"></warn-info>

    <m-login id="module_login"></m-login>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MLogin from './components/Plugs/m-login.vue';
import API from './config/backend';
import axios from 'axios';
import qs from 'qs';
import Common from './config/Common';

export default {
  name: 'app',
  data() {
    return {
    }
  },
  created() {
    // 从缓存中获取Token, UserId, OrderIdForPay
    this.$store.commit('SetToken', Common.getCookie('ZJSH_WX_Token'));
    this.$store.commit('SetUserId', Common.getCookie('ZJSH_WX_UserId'));
    // this.$store.commit('SetDefaultAddressId', Common.getCookie('ZJSH_WX_DefaultAddressId'));
    this.$store.commit('SetOrderIdForPay', Common.getCookie('ZJSH_WX_OrderIdForPay'));
    this.$store.commit('SetThreeServiceId', Common.getCookie('ZJSH_WX_ThreeServiceId'));
    this.$store.commit('SetThreeServiceName', decodeURIComponent(Common.getCookie('ZJSH_WX_ThreeServiceName')));

    // 为了防止页面刷新导致openid丢失，需要保存起来，有效期1天
    if(this.OpenId == '') {
      this.$store.commit('SetOpenId', Common.getCookie('ZJSH_WX_OpenId'));
    }

    // 设置全局请求头
    axios.defaults.headers.common['zjsh_version'] = this.zjsh_version;

    // 设置拦截器，当接口返回2004时跳转到登录页
    // 拦截器例外：“我的”页面
    axios.interceptors.response.use(response => {
      //if (!this.interceptorsExceptList.includes(this.$route.name) && JSON.parse(response.request.response).Meta.ErrorCode === "2004") {
      if (!this.interceptorsExceptList.includes(this.$route.name) && JSON.parse(response.request.response).Meta.ErrorCode === "2004") {
        // this.$router.push({
        //   path: '/login'
        // });
        this.$store.commit('SetIsLogin', '0');
        this.openLogin();
      }
      return response;
    }, error => Promise.reject(error));

    // 检测Token是否有效
    if (window.parent === window.self) {
      this.vertifyToken();
    }
  },
  mounted() {
    if (window.parent === window.self) {
      if (this.valueFromUrl('code')) {
        this.getOpenId();
      }
    }
  },
  methods: {
    valueFromUrl(key) {
      var url = window.location.search;
      var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
      var result = url.substr(1).match(reg);
      return result ? decodeURIComponent(result[2]) : null;
    },
    getOpenId() {
      // 从url中提取code
      let code = this.valueFromUrl('code');
      axios.post(API.GetWxpayOpenId, qs.stringify({
        Token: this.Token,
        WxCode: code,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.$store.commit('SetOpenId', res.data.Body.OpenId);
        } else {
          // this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        // this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    openLogin() {
      document.getElementById('module_login').classList.add('active');
      this.$store.commit('SetIsOpenLogin', '1');
      var WVJBIframe = document.createElement('iframe');
      document.title = '登录';
      WVJBIframe.style.display = 'none';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe)
      }, 0);
    },
    vertifyToken() {
      axios.post(API.VerifyToken, qs.stringify({
        Token: this.Token,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.$store.commit('SetIsLogin', '1');
        }
      });
    },
  },
  computed: {
    ...mapState(['Token', 'OpenId', 'zjsh_version', 'interceptorsExceptList', 'ALERT_MSG', 'AlertMsg', 'AlertTimout', 'AlertStatus']),
  },
  components: {
    MLogin
  },
}
</script>

<style>
html,
body,
#app,
.router-view
{
  height: 100%;
}
.router-view
{
  background-color: #eef2f5;
}
.bounce-enter-active {
    animation: bounce-in .3s;
}
.bounce-leave-active {
  /* animation: bounce-out 60ms; */
}
@keyframes bounce-in {
  0% {
    -webkit-transform: translate3d(100%,0,0);
    transform: translate3d(100%,0,0);
  }
  100% {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
  }
}
@keyframes bounce-out {
  0% {
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
  }
  100% {
    -webkit-transform: translate3d(100%,0,0);
    transform: translate3d(-100%,0,0);
  }
}
#module_login
{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  transform: translateZ(0) translateY(100%);
  width: 100%;
  height: 100%;
  background-color: #fff;
  transition: all .5s;
}
#module_login.active
{
  transform: translateY(0);
  transition: all .5s;
}
</style>
