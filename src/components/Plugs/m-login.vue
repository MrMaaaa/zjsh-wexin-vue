<template>
<div>
  <!-- <header class="header" :class="{ disable: phoneNumber !== '' }">欢迎体验{{ AppName }}的服务<br>请先验证手机号</header> -->

  <section class="login">
    <div class="login-row flex-row">
      <div class="flex-row">
        <img class="icon-header" src="../../assets/images/register_phone.png">
        <span class="input-prev">+86</span><input class="input" v-model="phoneNumber" @click="initStatus" ref="input_phone" type="tel" placeholder="请输入手机号" maxlength="11">
      </div>
      <a class="btn-get-captcha"><img class="icon-delete" v-show="phoneNumber != ''" @click="clearPhone" src="../../assets/images/input_delete.png"></a>
    </div>

    <div v-show="isCaptcha" class="split-line"></div>

    <div v-show="isCaptcha" class="login-row flex-row">
      <div class="flex-row">
        <img class="icon-header" src="../../assets/images/register_captcha.png">
        <input class="input" v-model="captcha" ref="input_captcha" type="tel" placeholder="请输入验证码" maxlength="4">
      </div>
      <a class="btn-get-captcha"><span :class="{ disable: !isClickSendCaptcha || !isPhone,'is-countdown': isCountdown }" @click="sendCaptcha">{{ textCaptcha }}</span></a>
    </div>
  </section>

  <a class="btn-login" v-show="!isCaptcha" @click="verifyPhoneNumber">下一步</a>
  <a class="btn-login" v-show="isCaptcha" :class="{ disable: !isSubmit }" @click="submit">登录</a>

  <p class="login-tip" v-show="!isCaptcha">点击下一步，即表示您同意<a class="link" href="https://copen.zhujiash.com/htm/yhfwxy.html">《{{ AppName }}用户协议》</a></p>

  <m-loading bg-style="0" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'm-login',
  data() {
    return {
      phoneNumber: '',
      lastPhoneNumber: '',
      captcha: '',
      isCountdown: false,
      sendCaptchaInterval: null,
      isClickSendCaptcha: true,
      isCaptcha: false,
      textCaptcha: '获取验证码',
      isLoading: false,
    }
  },
  props: ['title'],
  mounted() {
  },
  methods: {
    clearPhone() {
      this.phoneNumber = '';
      this.$refs.input_phone.focus();
    },
    verifyPhoneNumber() {
      if(this.isPhone && this.phoneNumber !== this.lastPhoneNumber) {
        this.sendCaptcha();
      } else if(this.isPhone && this.phoneNumber === this.lastPhoneNumber) {
        this.isCaptcha = true;
      } else if(!this.isPhone) {
        this.alert(this.ALERT_MSG.PHONE_ERROR);
      }
    },
    sendCaptcha() {
      this.isClickSendCaptcha = false;
      this.isLoading = true;
      axios.post(API.SendCaptcha, qs.stringify({
        Phone: this.phoneNumber,
        "Type": "4"
      })).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          this.lastPhoneNumber = this.phoneNumber;
          this.isCaptcha = true;
          this.alert(this.ALERT_MSG.SEND_CAPTCHA, () => {
            this.$refs.input_captcha.focus();
          });
          let count = 60;
          this.isCountdown = true;
          clearInterval(this.sendCaptchaInterval);
          this.sendCaptchaInterval = setInterval(() => {
            count--;
            this.textCaptcha = '(' + count + ')重新发送';
            if(count <= 0) {
              clearInterval(this.sendCaptchaInterval);
              this.isCountdown = false;
              this.textCaptcha = '重新发送';
              this.isClickSendCaptcha = true;
            }
          }, 1000);
        } else {
          this.isClickSendCaptcha = true;
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isClickSendCaptcha = true;
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    initStatus() {
      this.isCaptcha = false;
      if (this.lastPhoneNumber !== this.phoneNumber) {
        clearInterval(this.sendCaptchaInterval);
        this.isCountdown = false;
        this.captcha = '';
        this.textCaptcha = '获取验证码';
        this.isClickSendCaptcha = true;
      }
    },
    submit() {
      this.isLoading = true;
      axios.post(API.QuickLogin, qs.stringify({
        LoginName: this.phoneNumber,
        Captcha: this.captcha,
        RegisterSource: this.OrderFrom,
      })).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          window._vds.push(['setCS1', 'user_id', res.data.Body.UserId]);
          this.saveUserInfo(res.data.Body.Token);
          this.getAppDeviceId(res.data.Body.Token);
          this.$store.commit('SetToken', res.data.Body.Token);
          this.$store.commit('SetUserId', res.data.Body.UserId);
          this.$store.commit('SetIsLogin', '1');
          var login = document.getElementById('module_login');
          document.title = login.getAttribute('title');
          login.classList.remove('active');
          // 如果设置了登录回调，就执行回调，否则重新进入该页面
          if (this.LoginCallbackCfg.Callback && this.$route.name == this.LoginCallbackCfg.RouterName) {
            this.LoginCallbackCfg.Callback();
            this.$store.commit('SetLoginCallbackCfg', {
              callback: null,
              routerName: ''
            });
          } else {
            this.$router.go(0);
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    saveUserInfo(token) {
      axios.post(API.GetUserInfo, qs.stringify({
        Token: token
      })).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.$store.commit('SetUserInfo', res.data.Body.Info);
        }
      });
    },
    getAppDeviceId(token) {
      var that = this;
      if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
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
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('iosGetAppDeviceId',
            function(response) {
              axios.post(API.UpdatePushDeviceID, qs.stringify({
                PushDeviceId: response,
                DeviceType: that.OrderFrom,
                Token: token,
              })).then(res => {}).catch(err => {});
            }
          );
        });
      }
    },
  },
  computed: {
    ...mapState(['AppName', 'IsOpenLogin', 'OrderFrom', 'LoginCallbackCfg', 'ALERT_MSG']),
    isPhone() {
      return /^1[3|4|5|7|8][0-9]\d{8}$/.test(this.phoneNumber);
    },
    isSubmit() {
      if(this.isPhone && this.captcha.split('').length == 4) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    IsOpenLogin(newValue) {
      if(newValue === '1') {
        // 如果打开登录弹窗，取消获取验证码倒计时
        this.$store.commit('SetIsOpenLogin', '0');
        clearInterval(this.sendCaptchaInterval);
        this.isCountdown = false;
        this.isClickSendCaptcha = true;
        this.textCaptcha = '获取验证码';
        this.captcha = '';
        this.isLoading = false;
        setTimeout(() => {
          this.$refs.input_phone.focus();
        }, 400);
      }
    },
  }
}
</script>

<style scoped lang="scss">
$captcha_able: #f56165;
$captcha_disable: rgba(245,97,101,0.3);
$captcha_countdown: #b2b2b2;
$animate_duration: .5s;
.router-view
{
  overflow: auto;
  background-color: #fff;
}
.login
{
  margin: 1.2rem 0 0;
  border-radius: 4px;
  background: #fff;
  .icon-header
  {
    display: block;
    width: 0.586667rem;
    height: 0.586667rem;
    margin-right: 0.32rem;
  }
  .login-row
  {
    position: relative;
    height: 0.64rem;
    padding-left: 0.32rem;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    .input-prev
    {
      margin-right: 0.16rem;
      color: #333639;
      font-size: 20px;
    }
    .input
    {
      border: none;
      outline: none;
      color: #333639;
      font-size: 17px;
      &::-webkit-input-placeholder
      {
        color: #b2b2b2;
      }
    }
    .btn-get-captcha
    {
      position: absolute;
      top: 50%;
      right: 0.32rem;
      transform: translateY(-50%);
      display: block;
      border-radius: 4px;
      padding: 0.133333rem 0.266667rem;
      color: $captcha_able;
      font-size: 16px;
      transition: color $animate_duration;
      span.disable
      {
        color: $captcha_disable;
        pointer-events: none;
        transition: color $animate_duration;
      }
      span.is-countdown
      {
        color: $captcha_countdown;
        transition: color $animate_duration;
      }
    }
    .icon-delete
    {
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
    }
  }
  .split-line
  {
    height: 1px;
    margin: 0.28rem 0 0.28rem 1.173333rem;
    // margin-left: 1.173333rem;
    background-color: #ededed;
  }
}
.login-tip
{
  margin-top: 0.24rem;
  color: #333639;
  font-size: 12px;
  text-align: center;
  .link
  {
    color: rgb(87,107,149);
  }
}
.btn-login
{
  display: block;
  height: 1.146667rem;
  line-height: 1.146667rem;
  margin: 0.653333rem 0.373333rem 0;
  border-radius: 4px;
  background-color: #f56165;
  color: #fff;
  text-align: center;
  font-size: 14px;
  transition: background-color $animate_duration;
  &.disable
  {
    background-color: rgba(245,97,101,.3);
    transition: background-color $animate_duration;
    pointer-events: none;
  }
}
</style>