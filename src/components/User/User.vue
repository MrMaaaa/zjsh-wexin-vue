<template>
<div class="wrapper">
  <div class="user-group">
    <div class="user-section user-info flex-row" v-if="this.userInfo.phoneNumber">
      <img class="user-avatar" :src="userInfo.avatar">

      <div class="section-info user-info flex-row">
        <span class="user-name">{{ userInfo.nickName }}</span>
        <span class="user-phone">{{ userInfo.phoneNumber }}</span>
      </div>
    </div>

    <a @click="openLogin" class="user-section user-info login flex-row" v-else>
      <img class="user-avatar" src="../../assets/images/user_default.png">

      <div class="section-info">
        <span class="user-name">快速登录</span>
      </div>
    </a>
  </div>

  <div class="user-group">
    <div class="user-section flex-row">
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_balance.png">

        <span class="section-name">余额</span>
      </div>

      <span class="user-balance">￥{{ userInfo.balance }}</span>
    </div>

    <div class="section-split"></div>

    <router-link :to="{ name: 'user_coupon' }" class="user-section flex-row">
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_redPacket.png">

        <span class="section-name">红包</span>
      </div>

      <div class="flex-row">
        <span class="user-coupon-amount">{{ userInfo.couponCount }}个</span>

        <img class="section-icon-link" src="../../assets/images/link.png">
      </div>
    </router-link>
  </div>

  <div class="user-group">
    <router-link class="user-section flex-row" :to="{ name: 'user_about' }">
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_inRegardTo.png">

        <span class="section-name">关于{{ AppName }}</span>
      </div>

      <img class="section-icon-link" src="../../assets/images/link.png">
    </router-link>

    <div class="section-split"></div>

    <router-link class="user-section flex-row" :to="{ name: 'user_connect_us' }">
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_relation.png">

        <span class="section-name">联系我们</span>
      </div>

      <img class="section-icon-link" src="../../assets/images/link.png">
    </router-link>
  </div>

  <div class="user-group" v-if="this.userInfo.phoneNumber">
    <a class="user-section logout" @click="logout">退出登录</a>
  </div>
</div>
</template>

<script>
import DefaultAvatar from '../../assets/images/user_default.png';
import DefaultLoginAvatar from '../../assets/images/user_default_login.png';
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'user',
  data() {
    return {
      userInfo: {
        nickName: '',
        phoneNumber: '',
        avatar: DefaultAvatar,
        balance: '0',
        couponCount: 0,
      },
    }
  },
  mounted() {
    // 获取
    this.getUserInfo();

    // 获取用户微信头像与微信昵称
    if(this.OpenId) {
      // this.getWxUserInfo();
    }

    // 获取余额与红包
    this.getUserSettlement();
    this.getCouponAmount();
  },
  methods: {
    getUserInfo() {
      axios.post(API.GetUserInfo, qs.stringify({
        Token: this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.userInfo.nickName = res.data.Body.Info.NickName;
          this.userInfo.phoneNumber = res.data.Body.Info.PhoneNumber;
          if(res.data.Body.Info.HqPic) {
            this.userInfo.avatar = res.data.Body.Info.HqPic;
          } else {
            this.userInfo.avatar = DefaultLoginAvatar;
          }
        } else {
          res.data.Meta.ErrorCode != '2004' && this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    getWxUserInfo() {
      axios.post(API.GetWxUserInfo, qs.stringify({
        OpenId: this.OpenId,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.userInfo.nickName = res.data.Body.NickName;
          this.userInfo.avatar = res.data.Body.HeadImgUrl;
        } else {
          res.data.Meta.ErrorCode != '2004' && this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    getUserSettlement() {
      axios.post(API.MySettlement, qs.stringify({
        Token: this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.userInfo.balance = res.data.Body.SettlementBalance;
        } else {
          res.data.Meta.ErrorCode != '2004' && this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    getCouponAmount() {
      axios.post(API.GetCoupons, qs.stringify({
        Token: this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          let date = new Date();
          res.data.Body.CouponList.map(value => {
            if((value.ServiceItem == null || this.ThreeServiceIdFilterList.indexOf(' ' + value.ServiceItem.ServiceId + ' ') > -1) && date.getTime() <= value.EndTime + '000' && value.IsUsed === '0') {
              this.userInfo.couponCount++;
            }
          });
        } else {
          res.data.Meta.ErrorCode != '2004' && this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    logout() {
      window._vds.push(['setCS1', 'user_id', '']);
      this.$store.commit('SetToken', '');
      this.$store.commit('SetIsLogin', '0');
      this.$store.commit('SetThreeServiceId', '');
      this.$store.commit('SetThreeServiceName', '');
      this.$store.commit('SetUserId', '0');
      this.userInfo = {
        nickName: this.userInfo.nickName,
        phoneNumber: '',
        avatar: this.userInfo.avatar,
        balance: '0',
        couponCount: 0,
      };
    },
  },
  computed: {
    ...mapState(['Token', 'AppName', 'OpenId', 'ThreeServiceIdFilterList', 'ALERT_MSG']),
  },
  watch: {
    Token(newValue, oldValue) {
      if(newValue != '' && newValue !== oldValue) {
        this.getUserInfo();
        this.getUserSettlement();
        this.getCouponAmount();
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper
{
  overflow: auto;
  .user-group
  {
    margin-top: 0.373333rem;
    .user-section
    {
      padding: 0.226667rem 0.4rem 0.226667rem 0.426667rem;

      background-color: #fff;
      color: #333639;
      font-size: 17px;
      &.user-info
      {
        justify-content: flex-start;
        -webkit-justify-content: flex-start;
        padding-top: 0.426667rem;
        padding-bottom: 0.426667rem;
        .user-avatar
        {
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
        }
        .section-info.user-info
        {
          flex-direction: column;
          -webkit-flex-direction: column;
          justify-content: center;
          -webkit-justify-content: center;
          box-sizing: border-box;
          align-items: flex-start;
          -webkit-align-items: flex-start;
          height: 1.6rem;
          padding: 0.213333rem 0;
          margin-left: 0.32rem;
          .user-name
          {
            display: block;
            color: #333639;
          }
          .user-phone
          {
            display: block;
            color: #333639;
            font-size: 14px;
          }
        }
      }
      &.user-info.login
      {
        .section-info
        {
          margin-left: 0.32rem;
        }
      }
      .section-icon
      {
        display: block;
        width: 0.72rem;
        height: 0.72rem;
        margin-right: 0.32rem;
      }
      .section-icon-link
      {
        display: block;
        width: 0.213333rem;
        margin-left: 0.266667rem;
      }
      .section-name
      {
        display: block;
      }
      .user-balance
      {
        color: #f56165;
      }
      .user-coupon-amount
      {
        color: #888;
      }
    }
    .user-section.logout
    {
      display: block;
      padding: 0.226667rem 0.4rem;
      color: #000;
      text-align: center;
      font-size: 18px;
    }
    .section-split
    {
      transform-origin: 0 0;
      transform: scaleY(0.5);
      margin-left: 0.4rem;
      height: 1px;
      background-color: #e5e5e5;
    }
  }
}
</style>