<template>
<div>
  <div class="wrapper">
    <img class="bg-main" src="../../../../assets/static/images/activity/qnz_bg.png">

    <div class="click" @click="checkPhoneNumber"></div>
  </div>

  <m-loading :bg-style="2" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'qianneizhu',
  data() {
    return {
      isLoading: false,
    }
  },
  mounted() {
  },
  methods: {
    checkPhoneNumber() {
      if(this.IsLogin == '0') {
        this.openLogin();
      } else if(this.UserInfo.PhoneNumber) {
        this.linkToQNZ(this.UserInfo.PhoneNumber);
      } else {
        this.getUserInfo();
      }
    },
    getUserInfo() {
      this.isLoading = true;
      axios.post(API.GetUserInfo, qs.stringify({
        Token: this.Token
      })).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          this.$store.commit('SetUserInfo', res.data.Body.Info);
          this.linkToQNZ(res.data.Body.Info.PhoneNumber);
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });;
    },
    linkToQNZ(phone) {
      window.location.href = 'http://www.qianneizhu.com/promotion/index.html?code=zhujia&phone=' + phone;
    }
  },
  computed: {
    ...mapState(['Token', 'IsLogin', 'UserInfo', 'ALERT_MSG'])
  }
}
</script>

<style scoped lang="scss">
.wrapper
{
  position: relative;
  .bg-main
  {
    display: block;
    width: 100%;
  }
  .click
  {
    position: absolute;
    top: 7.733333rem;
    left: 0;
    width: 100%;
    height: 8.0rem;
  }
}
</style>