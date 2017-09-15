<template>
<div class="wrapper">
  <section class="order-add-mount flex-row">
    <div class="left">输入补拍金额（元）</div>

    <div class="right">
      <input type="text" v-model="payAmount" placeholder="与工人沟通后输入">
    </div>
  </section>

  <section class="order-pay-way">
    <div class="pay-way-select flex-row" @click="selectPayWay(0)">
      <div class="left">
        <img class="pay-way-icon" src="../../assets/images/pay_ye.png"><span>账户余额支付<span class="user-balance">余额{{ balance | formatAmount }}元</span></span>
      </div>

      <img class="pay-way-select-icon" v-show="isBalancePay == '1'" src="../../assets/images/orders_pitch_on.png">
      <img class="pay-way-select-icon" v-show="isBalancePay == '0' && payWayStatus.isMultiple == '0'" src="../../assets/images/address_unselected.png">
      <img class="pay-way-select-icon" v-show="isBalancePay == '0' && payWayStatus.isMultiple == '1'" src="../../assets/images/orders_choose.png">
    </div>

    <div class="pay-way-select flex-row" @click="selectPayWay(1)" v-if="!OpenId">
      <div class="left">
        <img class="pay-way-icon" src="../../assets/images/pay_zfb.png"><span>支付宝支付</span>
      </div>

      <img class="pay-way-select-icon" v-show="isZfbPay == '1'" src="../../assets/images/orders_pitch_on.png">
      <img class="pay-way-select-icon" v-show="isZfbPay == '0' && payWayStatus.isMultiple == '0'" src="../../assets/images/address_unselected.png">
      <img class="pay-way-select-icon" v-show="isZfbPay == '0' && payWayStatus.isMultiple == '1'" src="../../assets/images/orders_choose.png">
    </div>

    <div class="pay-way-select flex-row" @click="selectPayWay(2)" v-if="OpenId">
      <div class="left">
        <img class="pay-way-icon" src="../../assets/images/pay_wx.png"><span>微信支付</span>
      </div>

      <img class="pay-way-select-icon" v-show="isWxPay == '1'" src="../../assets/images/orders_pitch_on.png">
      <img class="pay-way-select-icon" v-show="isWxPay == '0' && payWayStatus.isMultiple == '0'" src="../../assets/images/address_unselected.png">
      <img class="pay-way-select-icon" v-show="isWxPay == '0' && payWayStatus.isMultiple == '1'" src="../../assets/images/orders_choose.png">
    </div>
  </section>

  <section class="order-btn">
    <a class="btn-pay" @click="orderPay">确认支付￥{{ payAmount | formatAmount }}</a>
  </section>

  <m-loading :bg-style="bgLoading" v-show="isLoading"></m-loading>
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
      orderId: '',
      balance: '0', // 余额
      isBalancePay: '0',
      isWxPay: '0',
      isZfbPay: '0',
      isLoading: false,
      bgLoading: '1',
      payAmount: '',
    }
  },
  mounted() {
    let that = this;
    window.getPayStatusFromFrame = function(status) {
      let payIFrame = document.getElementById('alipay');
      document.documentElement.removeChild(payIFrame);
      if(status == '1') {
        that.routeTo({
          name: 'order_pay_status',
          params: {
            orderId: that.orderId
          }
        }, true);
      } else {
        that.alert(that.ALERT_MSG.PAY_ERROR);
      }
    }
  },
  activated() {
    let oldId = this.orderId;
    this.orderId = this.$route.params.orderId;
    if(oldId !== this.orderId) {
      this.getUserSettlement();
      this.isBalancePay = '0';
      this.isWxPay = '0';
      this.isZfbPay = '0';
    }
  },
  methods: {
    getUserSettlement() {
      axios.post(API.MySettlement, qs.stringify({
        Token: this.Token
      })).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.balance = Number(res.data.Body.SettlementBalance);
          if (this.payWayStatus.isBalancePay == '0') {
            if (this.OpenId) {
              this.isWxPay = '1';
            } else {
              this.isZfbPay = '1';
            }
          } else {
            this.isBalancePay = '1';
            if (this.payWayStatus.isMultiple == '1' && this.OpenId) {
              this.isWxPay = '1';
            } else if (this.payWayStatus.isMultiple == '1') {
              if (this.OpenId) {
                this.isWxPay = '1';
              } else {
                this.isZfbPay = '1';
              }
            }
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    selectPayWay(type) {
      // type: 0余额 1支付宝 2微信
      if(type == '0') {
        if(this.payWayStatus.isBalancePay == '1') {
          this.isBalancePay = '1';
        } else {
          this.isBalancePay = '0';
        }
        if(this.payWayStatus.isBalancePay == '1' && this.payWayStatus.isMultiple == '0') {
          this.isWxPay = '0';
          this.isZfbPay = '0';
        }
      } else if(type == '1') {
        this.isZfbPay = '1';
        if(this.payWayStatus.isMultiple == '0') {
          this.isBalancePay = '0';
          this.isWxPay = '0';
        } else {
          this.isWxPay = '0';
        }
      } else if(type == '2') {
        this.isWxPay = '1';
        if(this.payWayStatus.isMultiple == '0') {
          this.isBalancePay = '0';
          this.isZfbPay = '0';
        } else {
          this.isZfbPay = '0';
        }
      }
    },
    orderPay() {
      if(isNaN(this.payAmount) || this.payAmount == '') {
        this.alert(this.ALERT_MSG.AMOUNT_ERROR);
        this.payAmount = '';
      } else {
        if (this.isBalancePay == '1' && this.isWxPay == '0' && this.isZfbPay == '0') {
          // 只选择了余额支付
          this.payByBalance(this.orderId, this.balanceAmount);
        } else if (this.isWxPay == '1') {
          this.payByWx(this.orderId, this.cashAmount, this.balanceAmount);
        } else if (this.isZfbPay == '1') {
          this.payByZfb(this.orderId, this.cashAmount, this.balanceAmount);
        }
      }
    },
    payByBalance(orderId, balance) {
      this.isLoading = true;
      this.bgLoading = '2';
      axios.post(API.IodOfBalancePay, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        BalancePay: balance,
      })).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('支付成功', () => {
            this.routeTo({
              name: 'order_pay_status',
              query: {
                orderId: orderId,
                type: '2',
                money: balance
              }
            }, true);
          });
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    payByZfb(orderId, price, balance) {
      this.isLoading = true;
      this.bgLoading = '2';
      axios.post(API.GetAlipaySign, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        Alipay: price,
        BalancePay: balance,
        SignType: '2' // 2:增项支付
      })).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          window.location.href = res.data.Body.GATEWAY_NEW + res.data.Body.AlipaySign;
          // if(browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
          //   window.location.href = res.data.Body.GATEWAY_NEW + res.data.Body.AlipaySign;
          // } else if(browser.versions.android) {
          //   var WVJBIframe = document.createElement('iframe');
          //   document.title = '支付';
          //   WVJBIframe.setAttribute('id', 'alipay');
          //   WVJBIframe.setAttribute('frameborder', 'no');
          //   WVJBIframe.setAttribute('border', '0');
          //   WVJBIframe.setAttribute('width', '100%');
          //   WVJBIframe.setAttribute('height', '100%');
          //   WVJBIframe.id = 'alipay';
          //   WVJBIframe.frameborder = 'no';
          //   WVJBIframe.border = '0';
          //   WVJBIframe.width = '100%';
          //   WVJBIframe.height = '100%';
          //   WVJBIframe.style.position = 'fixed';
          //   WVJBIframe.style.top = '0';
          //   WVJBIframe.style.left = '0';
          //   WVJBIframe.style.backgroundColor = '#fff';
          //   WVJBIframe.src = res.data.Body.GATEWAY_NEW + res.data.Body.AlipaySign;
          //   document.documentElement.appendChild(WVJBIframe);
          // }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    payByWx(orderId, price, balance) {
      this.isLoading = true;
      this.bgLoading = '2';
      axios.post(API.GetWxpaySign, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        PayFrom: '0', // 0:微信公众号 1:app
        OpenId: this.OpenId,
        WxPay: price,
        BalancePay: balance,
      })).then(res => {
        this.isLoading = false;
        const that = this;
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
                  this.routeTo({
                    name: 'order_pay_status',
                    query: {
                      orderId: orderId,
                      type: '2',
                      money: price + balance
                    }
                  }, true);
                } else if (res.err_msg == "get_brand_wcpay_request:cancel" || res.err_msg == "get_brand_wcpay_request:fail") {
                  that.alert(that.ALERT_MSG.PAY_ERROR);
                } else {
                  that.alert(res.err_msg);
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
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    routeTo(option={name:''}, isReplace=false) {
      // 保存订单信息
      if (isReplace) {
        this.$router.replace(option);
      } else {
        this.$router.push(option);
      }
    },
  },
  computed: {
    ...mapState(['Token', 'OpenId', 'ALERT_MSG']),
    payWayStatus() {
      if(this.balance == 0) {
        return {
          isMultiple: '0',
          isBalancePay: '0',
        }
      } else {
        if(Number(this.balance) < Number(this.payAmount)) {
          return {
            isMultiple: '1',
            isBalancePay: '1',
          }
        } else {
          this.isZfbPay = '0';
          this.isWxPay = '0';
          return {
            isMultiple: '0',
            isBalancePay: '1',
          }
        }
      }
    },
    // 余额不够的情况下剩余需要支付的部分，这部分价格是原价
    // 这个字段只在且只能在调用支付接口时使用
    cashAmount() {
      if(isNaN(this.payAmount) || this.payAmount == '') {
        return '';
      } else if (this.isBalancePay == '1' && this.isZfbPay == '0' && this.isWxPay == '0') {
        return 0;
      } else {
         return Number(this.payAmount) - Number(this.balanceAmount);
      }
    },
    balanceAmount() {
      if(isNaN(this.payAmount) || this.payAmount == '') {
        return '';
      } else if(this.isBalancePay == '1' && this.isZfbPay == '0' && this.isWxPay == '0') {
        return Number(this.payAmount);
      } else if(this.isBalancePay == '1' && (this.isZfbPay == '1' || this.isWxPay == '1')) {
        return Number(this.balance);
      } else if(this.isBalancePay == '0' && (this.isZfbPay == '1' || this.isWxPay == '1')) {
        return 0;
      } else {
        return 0;
      }
    }
  },
  filters: {
    payCountdown(time) {
      if(isNaN(time) || time <= 0) {
        return '';
      }
      let minute = Math.floor(time / 60);
      minute = minute < 10 ? '0' + minute : minute;
      let second = time % 60;
      second = second < 10 ? '0' + second : second;
      return minute + ':' + second;
    },
    formatAmount(amount) {
      if(isNaN(amount) || amount == '') {
        return '';
      }
      let a = amount.toString();
      if(a.indexOf('.') === -1) {
        return amount + '.00';
      } else {
        return a.split('.')[0] + '.' + (a.split('.')[1].length === 1 ? a.split('.')[1] + '0' : a.split('.')[1]);
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
.wrapper
{
  background-color: #eef2f5;
  overflow: auto;
  .order-add-mount
  {
    margin-top: 0.266667rem;
    padding: 0 0.426667rem;
    background-color: #fff;
    color: #333639;
    font-size: 16px;
    .right
    {
      input
      {
        padding: 0.453333rem 0;
        font-size: 16px;
        text-align: right;
      }
    }
  }
  .order-pay-way
  {
    margin-top: 0.266667rem;
    background-color: #fff;
    .pay-way-select
    {
      padding: 0.453333rem 0.426667rem;
      color: #333639;
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
      .user-balance
      {
        margin-left: 0.2rem;
        color: #999;
      }
    }
  }
  .order-btn
  {
    position: fixed;
    bottom: 0;
    left: 0;
    -webkit-overflow-scroll: touch;
    width: 100%;
    height: 1.946667rem;
    border-top: 1px solid #eef2f5;
    background-color: #fff;
    .btn-pay
    {
      display: block;
      height: 1.146667rem;
      line-height: 1.146667rem;
      margin: 0.4rem 0.426667rem;
      border-radius: 4px;
      background-color: #f56165;
      color: #fff;
      text-align: center;
      font-size: 16px;
    }
  }
}
</style>