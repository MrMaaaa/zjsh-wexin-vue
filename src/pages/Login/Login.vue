<template>
<div>
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

    <div v-show="isCaptcha" class="split-line"></div>
  </section>

  <a class="btn-login" v-show="!isCaptcha" @click="verifyPhoneNumber">下一步</a>
  <a class="btn-login" v-show="isCaptcha" :class="{ disable: !isSubmit }" @click="submit">登录</a>

  <p class="login-tip" v-show="!isCaptcha">点击下一步，即表示您同意<a class="link" href="https://copen.zhujiash.com/htm/yhfwxy.html">《{{ AppName }}用户协议》</a></p>
</div>
</template>

<script>
import { mapState } from 'vuex';

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
    }
  },
  activated() {
    this.captcha = '';

  },
  methods: {
    clearPhone() {
      this.phoneNumber = '';
      this.$refs.input_phone.focus();
    },
    verifyPhoneNumber() {
      if (this.isPhone && this.phoneNumber !== this.lastPhoneNumber) {
        this.sendCaptcha();
      } else if (this.isPhone && this.phoneNumber === this.lastPhoneNumber) {
        this.isCaptcha = true;
      } else if (!this.isPhone) {
        this.$alert(this.ALERT_MSG.PHONE_ERROR);
      }
    },
    sendCaptcha() {
      this.isClickSendCaptcha = false;
      this.$loading.open();
      this.$store.dispatch('SendCaptcha', {
          Phone: this.phoneNumber,
          Type: '4'
        })
        .then(res => {
          this.$loading.close();
          this.lastPhoneNumber = this.phoneNumber;
          this.isCaptcha = true;
          this.$alert({
            msg: this.ALERT_MSG.SEND_CAPTCHA,
            callback: () => {
              this.$refs.input_captcha.focus();
            }
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
        })
        .catch(err => {
          this.isClickSendCaptcha = true;
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    initStatus() {
      this.isCaptcha = false;
      // 测试环境下无需点击获取验证码
      if (window.location.host.indexOf(':3001') > -1) {
        this.isCaptcha = true;
      }
      if (this.lastPhoneNumber !== this.phoneNumber) {
        clearInterval(this.sendCaptchaInterval);
        this.isCountdown = false;
        this.captcha = '';
        this.textCaptcha = '获取验证码';
        this.isClickSendCaptcha = true;
      }
    },
    submit() {
      this.$loading.open();
      this.$store.dispatch('QuickLogin', {
          LoginName: this.phoneNumber,
          Captcha: this.captcha
        })
        .then(res => {
          this.$loading.close();
          this.$router.back();
          this.$route.params.callback && this.$route.params.callback();
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
  },
  computed: {
    ...mapState(['AppName', 'IsIos', 'ALERT_MSG']),
    isPhone() {
      return /^1[3|4|5|7|8][0-9]\d{8}$/.test(this.phoneNumber);
    },
    isSubmit() {
      if(this.isPhone && this.captcha && this.captcha.length == 4) {
        return true;
      } else {
        return false;
      }
    }
  },
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
  margin: 0.666667rem 0.373333rem 0;
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