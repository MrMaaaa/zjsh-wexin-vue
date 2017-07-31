<template>
  <!-- 暂时不需要进入支付页面 -->



<div class="wrapper">
  <section class="countdown" v-show="countdownTime > 0">
    <span class="countdown-title">支付剩余时间</span><span class="countdown-time">{{ countdownTime | payCountdown }}</span>
    <img class="countdown-icon" @click="countdownDialogOpen" src="../../assets/images/pay_alert.png">
  </section>

  <section class="order-status">
    <img class="status-icon" src="../../assets/images/pay_complete.png">
    <span class="status-title">订单已提交</span>
    <div class="status-split"></div>
    <div class="order-total-price flex-row">
      <div>订单总价</div>

      <span>￥{{ orderDetail.TotalPrice | amountFormat }}</span>
    </div>
  </section>

  <section class="order-info">
    <div class="info-discount flex-row" v-for="item in activityList">
      <div class="left">{{ item.Title }}</div>

      <div class="right">-￥{{ item.Minus | amountFormat }}</div>
    </div>

    <div class="pay-split"></div>

    <div class="info-coupon flex-row" @click="routeTo({ name: 'order_coupon_select' })">
      <div class="left">红包</div>

      <div class="right flex-row">
        <span class="txt-price" v-if="CouponSelected.CouponDetails">-￥{{ CouponSelected.CouponDetails[0].DiscountAmount | amountFormat }}</span>
        <span class="txt-price" v-else>不使用红包</span>
        <img class="right-icon" src="../../assets/images/link.png">
      </div>
    </div>

    <div class="pay-split"></div>

    <div class="info-pay flex-row">
      <div class="left">支付金额</div>

      <div class="right">￥{{ payAmount | amountFormat }}</div>
    </div>
  </section>

  <section class="order-pay-way">
    <header class="pay-way-title">选择支付方式</header>

    <div class="pay-split"></div>

    <div class="pay-way-select flex-row">
      <div class="left">
        <img class="pay-way-icon" src="../../assets/images/pay_wx.png"><span>微信支付</span>
      </div>

      <img class="pay-way-select-icon" src="../../assets/images/address_select.png">
    </div>
  </section>

  <section class="order-btn">
    <a class="btn-pay" href="javascript: void(0)" @click="orderPay">确认支付{{ payAmount | amountFormat }}元</a>
  </section>

  <m-dialog :dialog-config="DialogConfig" @dialog-cancel="countdownDialogClose"></m-dialog>

  <m-loading v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'index',
  data() {
    return {
      orderDetail: {},
      activityList: [],
      countdownTime: -1,
      countdownInterval: null,
      isLoading: false,
      DialogConfig: { //对话框配置信息
        IsDialog: '0', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
        DialogTitle: '温馨提示', // 对话框标题
        DialogContent: '由于资源紧张，本但需要立即付款以保证预约成功。请在下单后20分钟内完成支付，否则订单将被取消', // 对话框内容
        DialogBtns: ['我知道了'], // 对话框按钮文本
      },
    }
  },
  mounted() {
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail() {
      axios.post(API.GetOrderInfoEx, qs.stringify({
        Token: this.Token,
        OrderId: this.OrderIdForPay,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          if(res.data.Body.IsPayOff === '1') {
            this.$router.go(-1);
          } else {
            this.orderDetail = res.data.Body.Order;
            this.countdownTime = Number(this.orderDetail.ResidualTime || 0);

            if (this.countdownTime > 0) {
              // 设置定时器
              this.countdownInterval = setInterval(() => {
                this.countdownTime--;
                if (this.countdownTime === 0) {
                  // 支付倒计时结束
                }
              }, 1000);
            }
            this.getServiceActivity();
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    getServiceActivity() {
      this.activityList.splice(0);
      this.orderDetail.ActivityNgs.ServiceTypeRules.map(value => {
        value.Details.map(val => {
          let dis = 0,
            upp = 0;
          val.Rules.map(v => {
            // 计算当前优惠规则的最大折扣
            if (v.Upper >= upp && v.Upper <= this.orderDetail.PayAmount) {
              upp = Number(v.Upper);
              dis = Number(v.Minus);
            }

            // 对于每一个折扣数组，获取满足优惠最大折扣的信息
            this.activityList.push({
              Title: val.Title,
              Upper: Number(v.Upper),
              Minus: Number(v.Minus),
            });
          });
        });
      });
    },
    countdownDialogOpen() {
      this.DialogConfig.IsDialog = '1';
    },
    countdownDialogClose() {
      this.DialogConfig.IsDialog = '0';
    },
    orderPay() {
      this.isLoading = true;
      axios.post(API.GetWxpaySign, qs.stringify({
        Token: this.Token,
        OrderId: this.OrderIdForPay,
        PayFrom: '0', // 0: 微信公众号 1: app
        WxCode: this.Code,
        WxPay: this.orderDetail.TotalPrice,
        BalancePay: '0',
        CouponId: this.CouponSelected.Id || '',
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          function onBridgeReady() {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": res.data.Body.WxpaySign.appid,
                "timeStamp": res.data.Body.WxpaySign.timestamp,
                "nonceStr": res.data.Body.WxpaySign.noncestr,
                "package": res.data.Body.WxpaySign.package,
                "signType": "MD5",
                "paySign": res.data.Body.WxpaySign.sign
              },
              function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  alert('支付成功');
                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                  alert('支付失败');
                }
              }
            );
          }
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
          } else {
            onBridgeReady();
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    routeTo(option={name:''}, isReplace=false) {
      // 保存订单信息
      this.$store.commit('SetOrderInfo', this.OrderInfo);

      if (isReplace) {
        this.$router.replace(option);
      } else {
        this.$router.push(option);
      }
    },
  },
  computed: {
    ...mapState(['Token', 'Code', 'OrderInfo','OrderIdForPay','CouponSelected', 'ALERT_MSG']),
    payAmount() {
      let dis = 0;
      // 除了红包的所有折扣
      this.activityList.map(value => {
        dis += Number(value.Minus);
      });
      return this.orderDetail.TotalPrice - dis - (this.CouponSelected.CouponDetails ? this.CouponSelected.CouponDetails[0].DiscountAmount : 0);
    },
  },
  filters: {
    payCountdown(time) {
      if( time == 0) {
        return '';
      }
      let minute = Math.floor(time / 60);
      minute = minute < 10 ? '0' + minute : minute;
      let second = time % 60;
      second = second < 10 ? '0' + second : second;
      return minute + ':' + second;
    },
    amountFormat(amount) {
      if(amount === undefined || amount === null) {
        return '';
      }
      let a = amount.toString();
      if(a.indexOf('.') === -1) {
        return amount + '.00';
      } else {
        a.split('.')[0] + '.' + a.split('.')[1].length === 1 ? a.split('.')[1] + '0' : a.split('.')[1];
      }
    },
  },
}
</script>

<style scoped lang="scss">
@mixin m-row {
  padding: 0.4rem 0.293333rem;
  color: #333639;
  font-size: 14px;
}
.pay-split
{
  margin-left: 0.293333rem;
  height: 1px;
  background-color: #eef2f5;
}
.wrapper
{
  background-color: #eef2f5;
  overflow: auto;
  .countdown
  {
    position: relative;
    height: 1.066667rem;
    line-height: 1.066667rem;
    text-align: center;
    background-color: #fff5ba;
    font-size: 14px;
    .countdown-title
    {
      color: #7a4617;
    }
    .countdown-time
    {
      margin-left: 0.133333rem;
      color: #F56066;
    }
    .countdown-icon
    {
      position: absolute;
      right: 0.32rem;
      top: 50%;
      transform: translateY(-50%);
      width: 0.586667rem;
    }
  }
  .order-status
  {
    padding-top: 0.88rem;
    text-align: center;
    background-color: #fff;
    color: #333639;
    .status-icon
    {
      width: 0.666667rem;
      margin-right: 0.333333rem;
      vertical-align: middle;
    }
    .status-title
    {
      font-size: 16px;
      vertical-align: middle;
    }
    .status-split
    {
      height: 1px;
      margin-top: 0.88rem;
      background-color: #eef2f5;
    }
    .order-total-price
    {
      @include m-row;
    }
  }
  .order-info
  {
    margin-top: 0.266667rem;
    background-color: #fff;
    .info-discount,
    .info-coupon,
    .info-pay
    {
      @include m-row;
      .left
      {
        line-height: 100%;
        color: #000;
      }
      .right
      {
        line-height: 100%;
        color: #666;
      }
    }
    .info-coupon
    {
      .right
      {
        color: #fe552c;
        font-size: 12px;
        .right-title
        {
          vertical-align: middle;
        }
        .right-icon
        {
          width: 0.2rem;
          margin-left: 0.266667rem;
          vertical-align: middle;
        }
      }
    }
    .info-pay
    {
      .right
      {
        color: #ff522d;
      }
    }
  }
  .order-pay-way
  {
    margin-top: 0.266667rem;
    background-color: #fff;
    .pay-way-title
    {
      padding: 0.16rem 0.293333rem;
      color: #666;
    }
    .pay-way-select
    {
      padding: 0.266667rem 0.453333rem 0.266667rem 0.666667rem;
      color: #000;
      font-size: 14px;
      .pay-way-icon
      {
        width: 0.8rem;
        margin-right: 0.266667rem;
        vertical-align: middle;
      }
      .pay-way-select-icon
      {
        width: 0.533333rem;
      }
    }
  }
  .order-btn
  {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.333333rem;
    .btn-pay
    {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 1.333333rem;
      background-color: #51d862;
      color: #fff;
      text-align: center;
      font-size: 16px;
    }
  }
}
</style>