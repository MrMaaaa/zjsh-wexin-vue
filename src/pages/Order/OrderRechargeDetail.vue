<template>
<div class="router-view">
  <header class="header-status flex-row">
    <img class="icon-header" src="../../assets/images/order_pay_success.png">
    <div>
      <p class="order-status">{{ orderStatus }}</p>
      <p class="order-pay" v-if="orderStatus === '支付成功'">实付&nbsp;&nbsp;<span class="price">￥{{ rechargeData.RealPaidMoney }}</span></p>
      <p class="order-pay" v-else>实付&nbsp;&nbsp;<span class="price">￥{{ rechargeData.RealPaidMoney }}</span></p>
    </div>
  </header>

  <div class="split-row" v-if="orderStatus === '支付成功'"></div>

  <div class="order-info" v-if="orderStatus === '支付成功'">
    <div class="row">
      <span class="info-name">充值金额：</span><span class="info-value">{{ rechargeData.TotalMoney }}元</span>
    </div>
    <div class="row">
      <span class="info-name">充值优惠：</span><span class="info-value">满{{ rechargeData.RealPaidMoney }}送{{ rechargeData.DiscountMoney }}元</span>
    </div>
    <div class="row">
      <span class="info-name">充值时间：</span><span class="info-value">{{ rechargeData.RechargedTime | formatDate }}</span>
    </div>
    <div class="row">
      <span class="info-name">充值单号：</span><span class="info-value">{{ rechargeData.TradeNo }}</span>
    </div>
  </div>

  <div class="split-row"></div>

  <div class="operation flex-row">
    <a class="btn-operate" @click="returnRecharge">继续充值</a>
    <router-link class="btn-operate" :to="{ name: 'index' }">回到首页</router-link>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'recharge_detail',
  data () {
    return {
      orderStatus: '支付成功',
      rechargeData: {
        RealPaidMoney: '0',
        DiscountMoney: '0',
        RechargedTime: '',
        TradeNo: '0',
      },
    }
  },
  mounted() {
    this.out_trade_no = this.$route.params.out_trade_no;
    this.getRechargeDetail();
  },
  activated() {
    this.rechargeData = {
      RealPaidMoney: '0',
      DiscountMoney: '0',
      RechargedTime: '',
      TradeNo: '0',
    };
  },
  methods: {
    getRechargeDetail() {
      this.$loading.open(1);
      this.$store.dispatch('GetRechargeInfoByRechargeCode', {
        RechargeCode: this.out_trade_no
        })
        .then(res => {
          this.$loading.close();
          this.rechargeData = res;
          // 计算折扣金额
          this.rechargeData.DiscountMoney = (this.rechargeData.TotalMoney * 100 - this.rechargeData.RealPaidMoney * 100) / 100;
        })
        .catch(err => {
          this.$loading.close();
          this.$router.back();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    returnRecharge() {
      this.$router.back();
    },
    addZero(value) {
      return value < 10 ? '0' + value : value;
    }
  },
  computed: {
    ...mapState(['ALERT_MSG']),
  },
  filters: {
    formatDate(value) {
      if(!value || isNaN(value)) {
        return '';
      }
      var date = new Date(window.parseInt(value + '000'));
      var year = this.addZero(date.getFullYear()),
          month = this.addZero(date.getMonth() + 1),
          day = this.addZero(date.getDate()),
          hour = this.addZero(date.getHours()),
          minute = this.addZero(date.getMinutes()),
          second = this.addZero(date.getSeconds());
      return year + '-' + month + '-' + date.getDate() + ' ' + hour + ':' + minute + ':' + second;
    }
  }
}
</script>

<style scoped>
.router-view
{
  height: 100%;
  background-color: #fff;
}
.header-status
{
  padding: 0.666667rem 3rem 0.666667rem 2.0rem;
}
.header-status .icon-header
{
  width: 1.6rem;
}
.header-status .order-status
{
  font-size: 20px;
}
.header-status .order-pay
{
  font-size: 18px;
}
.header-status .order-pay .price
{
  color: #fd542b;
}
.split-row
{
  border-top: 1px dashed #ccc;
}
.order-info
{
  padding: 0.466667rem 0.4rem;
  color: #333;
  font-size: 14px;
  overflow: hidden;
}
.order-info .info-name
{
  display: inline-block;
  margin-top: 0.24rem;
}
.order-info .info-value
{
  display: inline-block;
  max-width: 100%;
  margin-top: 0.24rem;
  margin-left: 0.2rem;
  color: #656565;
  word-wrap: break-word;
}
.operation
{
  justify-content: flex-end;
  padding: 0.466667rem 0.4rem;
}
.operation .btn-operate
{
  display: block;
  width: 2.0rem;
  line-height: 100%;
  padding: 0.266667rem 0.4rem;
  border: 1px solid #29b9f3;
  border-radius: 4px;
  color: #29b8f3;
  font-size: 15px;
  text-align: center;
}
.operation .btn-operate:not(:first-child)
{
  margin-left: 0.4rem;
}
</style>
