<template>
  <div id="app">
    <!-- <transition name="bounce"> -->
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
    <!-- </transition> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import Utils from './config/utils.js';

export default {
  name: 'app',
  data() {
    return {
    }
  },
  created() {
    this.getPosition();
    this.getAppName();

    // 如果是微信浏览器下跳转到微信页面
    if(!Utils.valueFromUrl('code') && navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
      window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf88cbf4dba349e56&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_base#wechat_redirect');
    }

    if(Utils.valueFromUrl('code') && navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
      // this.wxConfig();
      // 为了防止页面刷新导致openid丢失，需要保存起来，有效期1天
      if (this.OpenId === '') {
        this.$store.commit('SetOpenId', Utils.read('ZJSH_WX_OpenId'));
      }
    }

    // 从缓存中获取数据
    this.$store.commit('SetToken', Utils.read('ZJSH_WX_Token'));
    this.$store.commit('SetUserId', Utils.read('ZJSH_WX_UserId'));
    this.$store.commit('SetDefaultAddressId', Utils.read('ZJSH_WX_DefaultAddressId'));

    // 设置全局请求头
    axios.defaults.headers.common['zjsh_version'] = this.zjsh_version;
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.timeout = 30000; // 设置超时时间

    // 设置拦截器，当接口返回2004时打开登录
    axios.interceptors.response.use(response => {
      if (JSON.parse(response.request.response).Meta.ErrorCode === '2004') {
        this.$store.dispatch('Logout');
        // 如果上一个路径不是登录,则在接口返回2004进入登录页面
        if (this.AutoToLogin === '1' && ' black_friday sf_activity qianneizhu one_recharge one_recharge_index one_recharge_order user index activity service_detail new_user_coupon express errand user_about user_connect_us '.indexOf(' ' + this.$route.name + ' ') === -1) {
          this.$store.commit('SetAutoToLogin', '0');
          this.$router.push({
            name: 'login'
          });
        } else if(this.$route.name !== 'login') {
          // 无需跳转则AutoToLogin重置为1
          this.$store.commit('SetAutoToLogin', '1');
        }
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
      let code = Utils.valueFromUrl('code');
      if (code !== '') {
        this.getOpenId(code);
      }
    }

    window.handleAppPushEvent = data => {
      let j = data;
      if (j) {
        this.isOpenBanner = '0';
        j = JSON.parse(j);
        if (j.Type == '0') {} else if (j.Type == '1') {
          switch (j.AppViewId) {
            case '1000':
            case '1001':
            case '1002':
              this.openLogin();
              break;
            case '10013':
              this.$router.push({
                name: 'user_coupon'
              });
              break;
            case '10017':
              this.$router.push({
                name: 'order_detail',
                params: {
                  orderId: j.Order.OrderId
                }
              });
              break;
            case '10024':
              this.$router.push({
                name: 'user_balance',
              });
              break;
            case '10027':
              this.$router.push({
                name: 'order_pay',
                params: {
                  orderId: j.Order.OrderId
                }
              });
              break;
          }
        } else if (j.Type == '2') {}
      }
    };

    // 为同城家政分包的兼容处理
    if (this.$store.state.AppName === '同城家政') {
      document.querySelector('#app').style.height = 'calc(100% - 64px)';
      document.querySelector('#app').style.transform = 'translateY(0)';
      document.querySelector('#app').style.overflow = 'hidden';
      document.querySelector('#app').style.position = 'relative';
      if (document.querySelector('.menu-router-view')) {
        document.querySelector('.menu-router-view').style.display = 'block';
        document.querySelector('.menu-router-view').style.height = '100%';
        document.querySelector('.menu-router-view').style.overflow = 'scroll';
      }
    }
  },
  methods: {
    getOpenId(WxCode) {
      this.$store.dispatch('GetWxpayOpenId', {
          WxCode
        })
        .then(res => {})
        .catch(err => {});
    },
    getPosition() {
      if (Utils.read('ZJSH_WX_Position')) {
        this.$store.commit('SetCurrentPosition', JSON.parse(decodeURIComponent(Utils.read('ZJSH_WX_Position'))));
      }
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(result => {
        if (geolocation.getStatus() == window.BMAP_STATUS_SUCCESS) {
          this.$store.commit('SetCurrentPosition', {
            Longitude: result.point.lng,
            Latitude: result.point.lat,
          });
        } else {
          this.$alert(this.ALERT_MSG.POSITION_ERROR);
        }
      }, {
        enableHighAccuracy: true
      });
    },
    getAppName() {
      let name = Utils.valueFromUrl('utm_term') || '助家生活';
      name = decodeURIComponent(name);
      var titles = this.$store.state.ROUTER_TO_TITLE;
      titles['index'] = name;
      document.title = titles['index'];
      this.$store.commit('SetROUTER_TO_TITLE', titles);
      this.$store.commit('SetAppName', name);
      this.$store.commit('SetOrderFrom', name);
    },
    verifyToken() {
      this.$store.dispatch('VerifyToken')
        .then(res => {
          this.getAppDeviceId();
          this.$store.commit('SetIsLogin', '1');
          this.saveUserInfo();
        })
        .catch(err => {
          if ((this.$route.name === 'index' || this.$route.name == 'service_detail' || this.$route.name === 'errand' || this.$route.name === 'express')) {
            this.isOpenBanner = '1';
          }
        });
    },
    getAppDeviceId() {
      var that = this;
      if (this.IsIos) {
        function setupWebViewJavascriptBridge(callback) {
          if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
          }
          if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
          }
          window.WVJBCallbacks = [callback];
          var WVJBIframe = document.createElement('iframe');
          WVJBIframe.style.display = 'none';
          WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
          document.documentElement.appendChild(WVJBIframe);
          setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
          }, 0)
        }
        setupWebViewJavascriptBridge(bridge => {
          bridge.callHandler('iosGetAppDeviceId',
            PushDeviceId => {
              this.$store.dispatch('UpdatePushDeviceID', {
                  PushDeviceId
                })
                .then(res => {})
                .catch(err => {});
            }
          );
        });
      }
    },
    saveUserInfo() {
      this.$store.dispatch('GetUserInfo')
        .then(res => {})
        .catch(err => {});
    },
    wxConfig() {
      // wx.config({
      //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      //   appId: '', // 必填，公众号的唯一标识
      //   timestamp: '', // 必填，生成签名的时间戳
      //   nonceStr: '', // 必填，生成签名的随机串
      //   signature: '', // 必填，签名，见附录1
      //   jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      // });
      // wx.onMenuShareTimeline({
      //   title: '', // 分享标题
      //   link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      //   imgUrl: '', // 分享图标
      //   success: function() {
      //     // 用户确认分享后执行的回调函数
      //   },
      //   cancel: function() {
      //     // 用户取消分享后执行的回调函数
      //   }
      // });
    },
  },
  computed: {
    ...mapState(['Token', 'OpenId', 'AutoToLogin', 'IsIos', 'IsAndroid', 'zjsh_version', 'OrderFrom', 'ALERT_MSG']),
  },
}
</script>

<style scoped>
/* 兼容ios弹簧效果 */
#app
{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #eef2f5;
  -webkit-overflow-scrolling: touch;
}

.router-view
{
  height: 100%;
  background-color: #eef2f5;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
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
</style>
