<template>
<div class="router-view">
  <header class="header-status flex-row">
    <img class="icon-header" src="../../../assets/images/order_pay_success.png">
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
    <a class="btn-operate" @touchend="returnRecharge">继续充值</a>
        <a class="btn-operate" v-show="isShowLinkBtn" @touchend="returnAPPIndex">去下单</a>
  </div>

  <div class="warn-info-wrapper" v-show="isShow" @click="isShow = false">
    <div class="warn-info">
      <span class="txt">{{ warnMsg }}</span>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'one_recharge_order',
  data () {
    return {
      Token: '',
      orderStatus: '支付成功',
      rechargeData: {
        RealPaidMoney: '0',
        DiscountMoney: '0',
        RechargedTime: '0',
        TradeNo: '0',
      },
      isShow: false,
      warnMsg: '',
      isShowLinkBtn: false,
      isShowLoading: false,
    }
  },
  mounted() {
    this.out_trade_no = this.$route.params.out_trade_no;
    this.getRechargeDetail();
  },
  methods: {
    getRechargeDetail() {
      this.isShowLoading = true;
      axios.post(API.GetRechargeInfoByRechargeCode, qs.stringify({
        "Token": this.Token,
        "RechargeCode": this.out_trade_no,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isShowLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          this.rechargeData = res.data.Body;
          // 计算折扣金额
          this.rechargeData.DiscountMoney = (this.rechargeData.TotalMoney * 100 - this.rechargeData.RealPaidMoney * 100) / 100;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isShowLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    returnRecharge() {
      this.$router.replace({
        name: 'index'
      });
    },
    returnAPPIndex() {
    },
    addZero(value) {
      return value < 10 ? '0' + value : value;
    }
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
  },
  filters: {
    formatDate(value) {
      if(!value || isNaN(value)) {
        return '';
      }
      var date = new Date(Number(value + '000'));
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
