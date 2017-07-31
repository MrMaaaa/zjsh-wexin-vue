<template>
<div class="wrapper">
  <div class="header-tab flex-row">
    <a class="tab-item" :class="{ active: tabIndex === '0' }" href="javascript: void(0)" @click="toggleCouponList(0)">未使用</a>
    <a class="tab-item" :class="{ active: tabIndex === '1' }" href="javascript: void(0)" @click="toggleCouponList(1)">已使用</a>
    <a class="tab-item" :class="{ active: tabIndex === '2' }" href="javascript: void(0)" @click="toggleCouponList(2)">已过期</a>
  </div>

  <ul class="coupon-list" id="coupont_list" v-if="couponListActived.length > 0">
    <coupon-item v-for="item in couponListActived" :coupon-item="item" :key="item.Id"></coupon-item>
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
      tabIndex: '0',
      couponListNoUsed: [],
      couponListUsed: [],
      couponListOverdued: [],
      couponListActived: [],
      isLoading: true,
    }
  },
  mounted() {
    this.getCouponList();
  },
  methods: {
    getCouponList() {
      axios.post(API.GetCoupons, qs.stringify({
        Token: this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          let couponList = [];
          res.data.Body.CouponList.map(value => {
            if (this.ThreeServiceIdFilterList.includes(' ' + value.ServiceItem.ServiceId + ' ')) {
              couponList.push(value);
            }
          });

          // 红包分类
          let date = new Date();
          couponList.map((value, index) => {
            // 只显示首页服务品类对应的id
            if (date.getTime() > value.EndTime + '000') {
              // 已过期红包
              value.couponTypeByVue = '2';
              this.couponListOverdued.push(value);
            } else {
              if (value.IsUsed === '1') {
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
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    toggleCouponList(index) {
      this.tabIndex = index.toString();
      if(this.tabIndex === '0') {
        this.couponListActived = this.couponListNoUsed;
      } else if(this.tabIndex === '1') {
        this.couponListActived = this.couponListUsed;
      } else if(this.tabIndex === '2') {
        this.couponListActived = this.couponListOverdued;
      }
    }
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
  background-color: #fff;
  .header-tab
  {
    padding: 0 0.533333rem;
    border-bottom: 1px solid #ccc;
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
        border-bottom: 2px solid #27b8f3;
        color: #27b8f3;
      }
    }
  }
  .coupon-list
  {
    overflow: hidden;
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