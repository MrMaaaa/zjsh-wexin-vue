<template>
<div class="wrapper" id="user_coupon">
  <div class="header-tab flex-row">
    <a class="tab-item" :class="{ active: tabIndex === 0 }" href="javascript: void(0)" @click="toggleCouponList(0)">未使用</a>
    <a class="tab-item" :class="{ active: tabIndex === 1 }" href="javascript: void(0)" @click="toggleCouponList(1)">已使用</a>
    <a class="tab-item" :class="{ active: tabIndex === 2 }" href="javascript: void(0)" @click="toggleCouponList(2)">已过期</a>

    <i class="tab-line" :class="{ 'move-1': tabIndex === 1,'move-2': tabIndex === 2 }"></i>
  </div>

  <ul class="coupon-list" id="coupont_list" v-if="couponListActived.length > 0">
    <coupon-item v-for="item in couponListActived" @click.native="useCoupon(item)" :coupon-item="item" :key="item.Id"></coupon-item>
  </ul>

  <div class="coupon-empty" v-else>
    <img class="empty-img" src="../../assets/images/coupon_empty.png">
    <span class="empty-title">您当前没有红包哦~</span>
  </div>

  <m-loading bg-style="1" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import CouponItem from '../Plugs/coupon-item';
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'user_coupon',
  data() {
    return {
      tabIndex: 0,
      couponListNoUsed: [],
      couponListUsed: [],
      couponListOverdued: [],
      couponListActived: [],
      isLoading: true,
      touchStartX: 0,
      touchStartY: 0,
      touchEndX: 0,
      touchEndY: 0,
    }
  },
  mounted() {
    document.getElementById('user_coupon').addEventListener('touchstart', event => {
      this.touchStartX = event.changedTouches[0].clientX;
      this.touchStartY = event.changedTouches[0].clientY;
    });
    document.getElementById('user_coupon').addEventListener('touchmove', event => {
      if(Math.abs(event.changedTouches[0].clientY - this.touchStartY) <= 20) {
        event.preventDefault();
      }
    });
    const slideThreshold = 50;
    document.getElementById('user_coupon').addEventListener('touchend', event => {
      this.touchEndX = event.changedTouches[0].clientX;
      if(this.touchEndX - this.touchStartX >= slideThreshold && this.tabIndex > 0) {
        this.tabIndex -= 1;
        this.toggleCouponList(this.tabIndex);
      } else if(this.touchStartX - this.touchEndX >= slideThreshold && this.tabIndex < 2) {
        this.tabIndex += 1;
        this.toggleCouponList(this.tabIndex);
      }
    });
  },
  activated() {
    this.isLoading = false;
    this.couponListNoUsed = [];
    this.couponListUsed = [];
    this.couponListOverdued = [];
    this.couponListActived = [];
    this.getCouponList();
    this.toggleCouponList(0);
  },
  methods: {
    getCouponList() {
      axios.post(API.GetCoupons, qs.stringify({
        Token: this.Token
      })).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          // 红包分类
          let date = new Date();
          res.data.Body.CouponList.map((value, index) => {
            // 只显示首页服务品类对应的id
            if (date.getTime() > Number(value.EndTime + '000')) {
              // 已过期红包
              value.couponTypeByVue = '2';
              this.couponListOverdued.push(value);
            } else {
              if (value.IsUsed == '1') {
                // 已使用红包
                value.couponTypeByVue = '1';
                this.couponListUsed.push(value);
              } else {
                // 未使用红包
                value.couponTypeByVue = '0';
                this.couponListNoUsed.push(value);
              }
            }
          });
          // 默认显示未使用红包
          this.couponListActived = this.couponListNoUsed;
        } else {
          if(res.data.Meta.ErrorCode === '2004') {
            this.alert(this.ALERT_MSG.USER_COUPON_NO_LOGIN);
          } else {
            this.alert(res.data.Meta.ErrorMsg);
          }
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    toggleCouponList(index) {
      this.tabIndex = Number(index);
      if(this.tabIndex === 0) {
        this.couponListActived = this.couponListNoUsed;
      } else if(this.tabIndex === 1) {
        this.couponListActived = this.couponListUsed;
      } else if(this.tabIndex === 2) {
        this.couponListActived = this.couponListOverdued;
      }
    },
    useCoupon(item) {
      if(item.couponTypeByVue == '0') {
        if(item.ServiceItem) {
          this.$router.push({
            name: 'service_detail',
            query: {
              id: item.ServiceItem.ServiceId
            },
            params: {
              url: item.ServiceItem.DetailUrl,
              img: item.ServiceItem.LogoUrl ? item.ServiceItem.LogoUrl[0] : '',
            }
          });
        } else {
          this.$router.push({
            name: 'index'
          });
        }
      }
    },
  },
  computed: {
    ...mapState(['Token', 'ThreeServiceIdFilterList', 'ALERT_MSG']),
  },
  components: {
    CouponItem
  }
}
</script>

<style scoped lang="scss">
.wrapper
{
  position: relative;
  background-color: #fff;
  .header-tab
  {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 0.533333rem;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    .tab-item
    {
      box-sizing: border-box;
      display: block;
      width: 2.266667rem;
      height: 1.066667rem;
      line-height: 1.066667rem;
      color: #999;
      font-size: 15px;
      text-align: center;
      &.active
      {
        color: #27b8f3;
      }
    }
    .tab-line
    {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 33.3333333%;
      height: 2px;
      background-color: #27b8f3;
      transition: all .3s;
      &.move-1
      {
        transform: translateX(100%);
        transition: all .3s;
      }
      &.move-2
      {
        transform: translateX(200%);
        transition: all .3s;
      }
    }
  }
  .coupon-list
  {
    overflow: hidden;
    padding: 1.0rem 0;
  }
  .coupon-empty
  {
    .empty-img
    {
      display: block;
      width: 3.706667rem;
      margin: 2.88rem auto 0.453333rem;
    }
    .empty-title
    {
      display: block;
      color: #999;
      text-align: center;
      font-size: 15px;
    }
  }
}
</style>