<template>
<div class="wrapper">
  <section class="user-group">
    <router-link class="user-section user-info flex-row" :to="{ name: 'user_info_edit' }" v-if="IsLogin == '1' && UserInfo.PhoneNumber">
      <div class="flex-row user-wrapper">
        <img class="user-avatar" :src="UserInfo.HqPic">

        <div class="section-info user-info">
          <span class="user-name">{{ UserInfo.NickName }}</span>
          <span class="user-phone">{{ UserInfo.PhoneNumber }}</span>
        </div>
      </div>

      <img class="section-icon-link" src="../../assets/images/link.png">
    </router-link>

    <router-link :to="{ name: 'login' }" class="user-section user-info login flex-row" v-else>
      <img class="user-avatar" src="../../assets/images/user_default.png">

      <div class="section-info">
        <span class="user-name">快速登录</span>
      </div>
    </router-link>
  </section>

  <section class="user-group">
    <a class="user-section flex-row" @click="routeTo('user_balance')">
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_balance.png">

        <span class="section-name">余额</span>
      </div>

      <div class="flex-row">
        <span class="user-balance">￥{{ balance }}</span>

        <img class="section-icon-link" src="../../assets/images/link.png">
      </div>
    </a>

    <div class="section-split"></div>

    <a class="user-section flex-row" @click="routeTo('user_coupon')">
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_coupon.png">

        <span class="section-name">红包</span>
      </div>

      <div class="flex-row">
        <span class="user-coupon-amount">{{ couponCount }}个</span>

        <img class="section-icon-link" src="../../assets/images/link.png">
      </div>
    </a>

    <div class="section-split"></div>

    <a class="user-section flex-row" @click="routeTo('user_message')">
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_message.png">

        <span class="section-name">消息</span>
      </div>

      <div class="flex-row">
        <img class="section-icon-link" v-if="unreadMessageCount === 0" src="../../assets/images/link.png">
        <i class="section-icon-link spot" v-else></i>
      </div>
    </a>
  </section>

  <section class="user-group">
    <router-link class="user-section flex-row" :to="{ name: 'user_about' }">
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_about.png">

        <span class="section-name">一分钟了解{{ AppName }}</span>
      </div>

      <img class="section-icon-link" src="../../assets/images/link.png">
    </router-link>
  </section>

  <section class="user-group">
    <a class="user-section flex-row" onclick='easemobim.bind({configId: "e88edf52-a792-46ce-9af4-a737d4e9bd43"})'>
      <div class="flex-row">
        <img class="section-icon" src="../../assets/images/user_relation.png">

        <span class="section-name">联系客服</span>
      </div>

      <img class="section-icon-link" src="../../assets/images/link.png">
    </a>
  </section>

  <section class="customer-service">
    <p class="row">服务热线：<a class="tel" href="tel:4008262056">4008-262-056</a></p>
    <p class="row">工作时间：8:00 - 21:00</p>
  </section>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'user',
  data() {
    return {
      balance: '0',
      couponCount: 0,
      unreadMessageCount: 0,
    }
  },
  mounted() {
    window.easemobim = window.easemobim || {};
    window.easemobim.config = {
      configId: 'e88edf52-a792-46ce-9af4-a737d4e9bd43',
      hideKeyboard: true,
      visitor: {
        trueName: '',
        qq: '',
        phone: this.$store.state.UserInfo.PhoneNumber,
        companyName: '',
        userNickname: this.$store.state.UserInfo.NickName,
        description: '',
        email: ''
      },
      onready: function() {
      },
    };
  },
  activated() {
    // 获取余额与红包
    if(this.IsLogin === '1') {
      this.getUserInfo();
      this.getUserSettlement();
      this.getCouponAmount();
      this.getUserUnreadMessage();
    }
  },
  methods: {
    getUserInfo() {
      this.$store.dispatch('GetUserInfo')
        .then(res => {})
        .catch(err => {});
    },
    getWxUserInfo() {
      this.$store.dispatch('GetWxUserInfo')
        .then(res => {})
        .catch(err => {});
    },
    getUserSettlement() {
      this.$store.dispatch('MySettlement')
        .then(res => {
          this.balance = res.SettlementBalance;
        })
        .catch(err => {});
    },
    getCouponAmount() {
      this.$store.dispatch('GetCoupons', {})
        .then(res => {
          this.couponCount = 0;
          let date = new Date();
          res.CouponList.map(value => {
            if (date.getTime() <= value.EndTime + '000' && value.IsUsed === '0') {
              this.couponCount++;
            }
          });
        });
    },
    getUserUnreadMessage() {
      this.$store.dispatch('GetUnreadMessage')
        .then(res => {
          this.unreadMessageCount = window.parseInt(res.UnreadTotal);
        })
        .catch(err => {});
    },
    routeTo(name) {
      if(this.IsLogin === '1') {
        this.$router.push({
          name
        });
      } else {
        this.$router.push({
          name: 'login'
        });
      }
    }
  },
  computed: {
    ...mapState(['AppName', 'UserInfo', 'OpenId', 'IsLogin', 'ALERT_MSG']),
  },
  watch: {
    IsLogin(newValue) {
      if (newValue === '1') {
        this.getUserInfo();
        this.getUserSettlement();
        this.getCouponAmount();
      } else if (newValue === '0') {
        this.balance = '0';
        this.couponCount = 0;
        this.unreadMessageCount = 0;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper
{
  height: 100%;
  overflow: auto;
  .user-group
  {
    margin-top: 0.373333rem;
    background-color: #fff;
    &.logout
    {
      margin-top: 0.746667rem;
    }
    .user-section
    {
      padding: 0.226667rem 0.4rem 0.226667rem 0.426667rem;
      color: #333639;
      font-size: 17px;
      &.user-info
      {
        position: relative;
        padding-top: 0.426667rem;
        padding-bottom: 0.426667rem;
        .user-wrapper
        {
          -webkit-justify-content: initial;
          justify-content: initial;
        }
        .user-avatar
        {
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
        }
        .section-info.user-info
        {
          box-sizing: border-box;
          height: 1.6rem;
          padding: 0.213333rem 0;
          margin-left: 0.32rem;
          .user-name
          {
            display: block;
            line-height: 100%;
            color: #333639;
          }
          .user-phone
          {
            display: block;
            line-height: 100%;
            margin-top: 0.2rem;
            color: #333639;
            font-size: 14px;
          }
        }
      }
      &.user-info.login
      {
        -webkit-justify-content: initial;
        justify-content: initial;
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
      .section-tips
      {
        color: #ccc;
        font-size: 15px;
      }
      .section-icon-link
      {
        display: inline-block;
        width: 0.213333rem;
        margin-left: 0.266667rem;
        &.spot
        {
          width: 0.213333rem;
          height:  0.213333rem;
          border-radius: 0.106667rem;
          background: #f56165;
        }
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
      margin-left: 0.426667rem;
      height: 1px;
      background-color: #e5e5e5;
    }
  }
  .customer-service
  {
    position: absolute;
    bottom: 1.5rem;
    left: 0;
    width: 100%;
    color: #333639;
    .row
    {
      padding: 0.133333rem 0;
      text-align: center;
      .tel
      {
        color: #27b8f3;
      }
    }
  }
}
</style>