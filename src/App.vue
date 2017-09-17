<template>
  <div id="app">
    <!-- <transition name="bounce"> -->
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
    <!-- </transition> -->

    <div class="new-user-coupon" v-if="isShowNewUserCoupon === '1'">
      <div class="coupon">
        <img class="img-coupon" @click="routerToNewUser" src="./assets/images/bg_detail.png">

        <img class="btn-close" @click="isShowNewUserCoupon = '0'" src="./assets/images/coupon_close.png">
      </div>
    </div>

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
      title: '',
      isShowNewUserCoupon: '0',
    }
  },
  created() {
    document.querySelector('body').addEventListener('touchmove', function(e) {
      if (!document.querySelector('#app').contains(e.target)) {
        e.preventDefault();
      }
    });

    this.getAppName();

    // 如果是微信浏览器下跳转到微信页面
    if(!this.valueFromUrl('code') && navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
      window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf88cbf4dba349e56&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_base#wechat_redirect');
    }

    if(this.valueFromUrl('code') && navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
      // this.wxConfig();
      // 为了防止页面刷新导致openid丢失，需要保存起来，有效期1天
      if (this.OpenId == '') {
        this.$store.commit('SetOpenId', Common.getCookie('ZJSH_WX_OpenId'));
    }
    }

    // 从缓存中获取数据
    this.$store.commit('SetToken', Common.getCookie('ZJSH_WX_Token'));
    this.$store.commit('SetUserId', Common.getCookie('ZJSH_WX_UserId'));
    this.$store.commit('SetDefaultAddressId', Common.getCookie('ZJSH_WX_DefaultAddressId'));

    // 设置全局请求头
    axios.defaults.headers.common['zjsh_version'] = this.zjsh_version;
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.timeout = '30000'; // 设置15秒超时时间

    // 设置拦截器，当接口返回2004时打开登录
    axios.interceptors.response.use(response => {
      if (this.interceptorsExceptList.indexOf(this.$route.name) == -1 && JSON.parse(response.request.response).Meta.ErrorCode === "2004") {
        this.$store.commit('SetIsLogin', '0');
        this.openLogin();
      }
      return response;
    }, error => Promise.reject(error));

    // 检测Token是否有效
    if (window.parent === window.self) {
      this.verifyToken();
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
          res.data.Meta.ErrorCode != '2004' && this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    getAppName() {
      let name = this.valueFromUrl('utm_term');
      var titles = this.$store.state.ROUTER_TO_TITLE;
      if(name) {
        this.$store.commit('SetAppName', decodeURIComponent(name));
        titles['index'] += name;
        document.title = titles['index'];
        this.$store.commit('SetROUTER_TO_TITLE', titles);
      } else {
        titles['index'] += '助家生活';
        document.title = titles['index'];
        this.$store.commit('SetROUTER_TO_TITLE', titles);
      }
    },
    verifyToken() {
      axios.post(API.VerifyToken, qs.stringify({
        Token: this.Token,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.$store.commit('SetIsLogin', '1');
          this.saveUserInfo();
        } else {
          if((this.$route.name == 'index' || this.$route.name == 'service_detail' || this.$route.name == 'errand' || this.$route.name == 'express') && !document.getElementById('module_login').classList.contains('active')) {
            this.isShowNewUserCoupon = '1';
          }
        }
      });
    },
    saveUserInfo() {
      axios.post(API.GetUserInfo, qs.stringify({
        Token: this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.$store.commit('SetUserInfo', res.data.Body.Info);
        }
      });
    },
    wxConfig() {
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '', // 必填，签名，见附录1
        jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.onMenuShareTimeline({
        title: '', // 分享标题
        link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: '', // 分享图标
        success: function() {
          // 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });
    },
    routerToNewUser() {
      this.isShowNewUserCoupon = '0';
      this.$router.push({
        name: 'new_user_coupon',
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
  background-color: #eef2f5;
}
.router-view
{
  background-color: #eef2f5;
  /*overflow: scroll;
  -webkit-overflow-scrolling: touch;*/
}
/*.bounce-enter-active {
    animation: bounce-in .3s;
}
.bounce-leave-active {
  animation: bounce-out 60ms;
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
}*/
.new-user-coupon
{
  position: fixed;
  top: 0;
  left: 0;
  transform: translateZ(0);
  z-index: 99999;
  width: 100%;
  height: 100%;
}
.new-user-coupon .coupon
{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: auto;
}
.new-user-coupon .coupon .img-coupon
{
  width: 100%;
}
.new-user-coupon .btn-close
{
  position: absolute;
  top: -0.333333rem;
  right: -0.333333rem;
  width: 0.666667rem;
  height: auto;
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
  opacity: 0;
}
#module_login::after
{
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999;
  display: block;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
#module_login.active
{
  transform: translateY(0);
  opacity: 1;
  transition: all .5s;
}
</style>
