<template>
<div class="wrapper">
  <div class="coupon-no-use flex-row" @click="couponNoUse">
    <span>不使用红包</span>

    <img v-if="OrderInfo.CouponSelected.NoUse === '1'" src="../../assets/images/pay_complete.png">
    <img v-else src="../../assets/images/orders_choose.png">
  </div>

  <ul class="coupon-list" v-if="couponListNoUsed.length > 0">
    <coupon-item v-for="item in couponListNoUsed" @click.native="couponSelect(item)" :coupon-item="item" :key="item.Id"></coupon-item>
  </ul>

  <div class="coupon-empty" v-else>
    <img class="empty-img" src="../../assets/images/coupon_empty.png">
    <span class="empty-title">您当前没有可用的红包哦~</span>
  </div>
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
      totalPrice: 0,
    }
  },
  activated() {
    this.couponListNoUsed.splice(0);
    this.getCouponList();
    this.totalPrice = this.$route.params.totalPrice;
  },
  methods: {
    alert(msg, timeout = 1000) {
      this.isWarn = true;
      this.warnMsg = msg;
      this.timeout = timeout;
      setTimeout(() => {
        this.isWarn = false;
      }, timeout);
    },
    getCouponList() {
      axios.post(API.GetCoupons, qs.stringify({
        Token: this.Token,
        ServiceId: this.OrderInfo.FourServiceId,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          let d = new Date().getTime();
          res.data.Body.CouponList.map(value => {
            // 红包分类
            if (value.CouponDetails[0].Amount <= this.totalPrice) {
              this.couponListNoUsed.push(value);
            }
          });
          this.$store.commit('SetCouponList', this.CouponList);
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    couponNoUse() {
      this.OrderInfo.CouponSelected = {
        NoUse: '1',
      };
      this.$store.commit('SetOrderInfo', this.OrderInfo);
      this.$router.go(-1);
    },
    couponSelect(item) {
      item.NoUse = '0';
      this.OrderInfo.CouponSelected = item;
      this.$store.commit('SetOrderInfo', this.OrderInfo);
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG', 'OrderInfo', 'ThreeServiceId']),
  },
  components: {
    CouponItem,
  },
}
</script>

<style scoped lang="scss">
.wrapper
{
  background-color: #eef2f5;
  .coupon-no-use
  {
    padding: 0.32rem;
    color: #333639;
    font-size: 14px;

    background-color: #fff;
    img
    {
      width: 0.586667rem;
    }
  }
  .coupon-list
  {
    margin-top: 0.32rem;
    background-color: #fff;
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