<template>
<div>
  <header class="header" :class="{ disable: phoneNumber !== '' }">欢迎体验助家生活的服务<br>请先验证手机号</header>

  <section class="login">
    <div class="login-row flex-row">
      <img class="icon-header" src="../../assets/images/register_phone.png">
      <input v-model="phoneNumber" type="tel" autofocus="autofocus" placeholder="请输入手机号" maxlength="11">
      <a class="btn-get-captcha"><img class="icon-delete" v-show="phoneNumber != ''" @click="clearPhone" src="../../assets/images/input_delete.png"><span :class="{ disable: !isClickSendCaptcha || !isPhone,'is-countdown': isCountdown }" @click="sendCaptcha">{{ textCaptcha }}</span></a>
    </div>

    <div class="split-line"></div>

    <div class="login-row flex-row">
      <img class="icon-header" src="../../assets/images/register_captcha.png">
      <input v-model="captcha" id="captcha" type="number" placeholder="请输入验证码" maxlength="4">
    </div>
  </section>

  <a class="btn-login" :class="{ disable: !isSubmit }" @click="submit">下一步</a>

    <p class="login-tip">点击登录，即表示您同意<a class="link" href="https://copen.zhujiash.com/htm/yhfwxy.html">《助家生活用户协议》</a></p>

  <m-loading v-show="isLoading"></m-loading>
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
      captcha: '',
      isCountdown: false,
      isClickSendCaptcha: true,
      textCaptcha: '获取验证码',
      isLoading: false,
    }
  },
  mounted() {
  },
  methods: {
    clearPhone() {
      this.phoneNumber = '';
    },
    sendCaptcha() {
      const that = this;
      axios.post(API.SendCaptcha, qs.stringify({
        Phone: this.phoneNumber,
        "Type": "4"
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        if (res.data.Meta.ErrorCode === '0') {
          document.getElementById('captcha').focus();
          this.alert(this.ALERT_MSG.SEND_CAPTCHA);
          this.isClickSendCaptcha = false;
          let count = 60;
          that.isCountdown = true;
          var sendCaptchaInterval = setInterval(function() {
            count--;
            that.textCaptcha = '重新发送(' + count + ')';
            if(count == 1) {
              clearInterval(sendCaptchaInterval);
              that.isCountdown = false;
              that.textCaptcha = '重新发送';
              that.isClickSendCaptcha = true;
            }
          }, 1000);
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch((error) => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    submit() {
      this.isLoading = true;
      axios.post(API.QuickLogin, qs.stringify({
        "LoginName": this.phoneNumber,
        "Captcha": this.captcha,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res)=> {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode == '0') {
          window._vds.push(['setCS1', 'user_id', res.data.Body.UserId]);
          this.$store.commit('SetToken', res.data.Body.Token);
          this.$store.commit('SetUserId', res.data.Body.UserId);
          this.$router.go(0);
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch((error)=> {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    }
  },
  computed: {
    ...mapState(['ALERT_MSG']),
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
  }
}
</script>

<style scoped lang="scss">
$captcha_able: #56c9ff;
$captcha_disable: rgba(86,201,255,0.3);
$captcha_countdown: #b2b2b2;
$animate_duration: .5s;
.router-view
{
  overflow: auto;
  background-color: #fff;
}
.header
{
  margin-top: 1.386667rem;
  padding-left: 0.586667rem;
  font-size: 24px;
  transition: color $animate_duration;
  &.disable
  {
    color: rgba(4,13,20,.2);
    transition: color $animate_duration;
  }
}
.login
{
  margin: 0.533333rem 0 0;
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
    height: 1.533333rem;
    padding-left: 0.32rem;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    input
    {
      border: none;
      outline: none;
      font-size: 14px;
    }
    .btn-get-captcha
    {
      position: absolute;
      top: 50%;
      right: 0.32rem;
      transform: translateY(-50%);
      display: block;
      border-left: 1px solid #eef2f5;
      border-radius: 4px;
      padding: 0.133333rem 0.266667rem;
      color: $captcha_able;
      font-size: 14px;
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
      position: absolute;
      left: -0.92rem;
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
    }
  }
  .split-line
  {
    height: 1px;
    margin-left: 1.173333rem;
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
  margin: 1.6rem 0.373333rem 0;
  border-radius: 4px;
  background-color: #27b8f3;
  color: #fff;
  text-align: center;
  font-size: 14px;
  transition: background-color $animate_duration;
  &.disable
  {
    background-color: rgba(86,201,255,.3);
    transition: background-color $animate_duration;
    pointer-events: none;
  }
}
</style>