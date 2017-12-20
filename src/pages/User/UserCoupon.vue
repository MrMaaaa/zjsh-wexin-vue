<template>
<div class="wrapper" id="user_coupon">
  <div class="header-tab flex-row">
    <a class="tab-item" :class="{ active: tabIndex === 0 }" href="javascript: void(0)" @click="toggleCouponList(0)">未使用</a>
    <a class="tab-item" :class="{ active: tabIndex === 1 }" href="javascript: void(0)" @click="toggleCouponList(1)">已使用</a>
    <a class="tab-item" :class="{ active: tabIndex === 2 }" href="javascript: void(0)" @click="toggleCouponList(2)">已过期</a>

    <i class="tab-line" :class="{ 'move-1': tabIndex === 1,'move-2': tabIndex === 2 }"></i>
  </div>

  <ul class="coupon-list" v-if="couponListActived.length > 0">
    <coupon-item v-for="item in couponListActived" @click.native="useCoupon(item)" :coupon-item="item" :key="item.Id"></coupon-item>
  </ul>

  <div class="coupon-empty" v-else>
    <img class="empty-img" src="../../assets/images/coupon_empty.png">
    <span class="empty-title">您当前没有红包哦~</span>
  </div>
</div>
</template>

<script>
import CouponItem from '../../components/coupon-item';
import { mapState } from 'vuex';

export default {
  name: 'user_coupon',
  data() {
    return {
      tabIndex: 0,
      couponListNoUsed: [],
      couponListUsed: [],
      couponListOverdued: [],
      couponListActived: [],
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
    this.getCouponList();
  },
  methods: {
    getCouponList() {
      this.$loading.open(1);
      this.$store.dispatch('GetCoupons', {})
        .then(res => {
          this.$loading.close();
          this.couponListNoUsed = [];
          this.couponListUsed = [];
          this.couponListOverdued = [];
          this.couponListActived = [];
          // 红包分类
          let date = new Date();
          res.CouponList.map((value, index) => {
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

          this.toggleCouponList(0);
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
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
              id: item.ServiceItem.ServiceId,
            },
            params: {
              id: item.ServiceItem.ServiceId,
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
    ...mapState(['ALERT_MSG']),
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
  overflow: auto;
  .header-tab
  {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
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
    box-sizing: border-box;
    height: 100%;
    padding-top: 1.0rem;
    padding-bottom: 0.32em;
    overflow: scroll;
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