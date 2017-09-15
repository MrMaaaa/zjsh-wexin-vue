<template>
<div class="wrapper">
  <section class="countdown" v-show="orderDetail && orderDetail.OrderId && countdownTime > 0">
    <span class="countdown-title">支付剩余时间</span><span class="countdown-time">{{ countdownTime | payCountdown }}</span>
    <img class="countdown-icon" @click="countdownDialogOpen" src="../../assets/images/pay_alert.png">
  </section>

  <section class="order-status flex-row">
    <img class="status-img" src="../../assets/images/order_pay_icon.png">

    <div class="status-info">
      <div class="info-amount" v-if="orderDetail && orderDetail.DepositInfo && orderDetail.DepositInfo.DepositIsPayOff == '0'">￥{{ orderDetail.DepositInfo.DepositAmount | formatAmount }}</div>
      <div class="info-amount" v-else-if="orderDetail">￥{{ orderDetail.TotalPrice | formatAmount }}</div>
      <div class="info-name" v-if="orderDetail && orderDetail.DepositInfo && orderDetail.DepositInfo.DepositIsPayOff == '0'">订金</div>
      <div class="info-name" v-else-if="orderDetail && orderDetail.Service">{{ orderDetail.Service.ServiceName }}</div>
    </div>
  </section>

  <section class="order-info" v-if="orderDetail && orderDetail.OrderId && (orderDetail.DepositInfo && orderDetail.DepositInfo.DepositIsPayOff == '1' || !orderDetail.DepositInfo)">
    <div class="info-deposit flex-row" v-if="orderDetail.DepositInfo && orderDetail.DepositInfo.DepositIsPayOff == '1'">
      <div class="left">已付定金</div>
      <div class="right">-￥{{ orderDetail.DepositInfo.DepositAmount }}</div>
    </div>

    <div class="info-discount flex-row" v-for="item in activityList">
      <div class="left">{{ item.Title }}</div>

      <div class="right">-￥{{ item.Minus | formatAmount }}</div>
    </div>

    <div class="pay-split" v-if="activityList.length > 0"></div>

    <div class="info-coupon flex-row" @click="routeTo({ name: 'order_coupon_select', query: { totalPrice: orderDetail.TotalPrice || orderDetail.PayAmount, serviceId: orderDetail.Service.ServiceId, isPay: '1' } })">
      <div class="left">红包</div>

      <div class="right flex-row">
        <span class="txt-price" v-if="CouponSelected && CouponSelected.CouponDetails">-￥{{ CouponSelected.CouponDetails[0].DiscountAmount | formatAmount }}</span>
        <span class="txt-price" v-else>不使用红包</span>
        <img class="right-icon" src="../../assets/images/link.png">
      </div>
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

  <section class="order-btn" v-show="orderDetail && orderDetail.OrderId">
    <a class="btn-pay" @click="orderPay">确认支付￥{{ payAmount | formatAmount }}</a>
  </section>

  <m-dialog :dialog-config="DialogConfig" @dialog-cancel="countdownDialogClose"></m-dialog>

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
      discountAmount: 0, // 活动折扣金额
      orderDetail: null,
      isBalancePay: '0',
      isWxPay: '0',
      isZfbPay: '0',
      activityList: [],
      couponList: [],
      countdownTime: -1,
      interval: null,
      isLoading: false,
      bgLoading: '1',
      DialogConfig: { //对话框配置信息
        IsDialog: '0', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
        DialogTitle: '温馨提示', // 对话框标题
        DialogContent: '由于资源紧张，本单需要立即付款以保证预约成功。请在下单后20分钟内完成支付，否则订单将被取消', // 对话框内容
        DialogBtns: ['我知道了'], // 对话框按钮文本
      },
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
      // 需要先设置红包为不可用，避免上一次的红包带来的错误
      this.$store.commit('SetCouponSelected', {
        NoUse: '1',
      });

      this.getOrderDetail();
      this.getUserSettlement();
      this.isBalancePay = '0';
      this.isWxPay = '0';
      this.isZfbPay = '0';
    }
  },
  methods: {
    getOrderDetail() {
      axios.post(API.GetOrderInfoEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      })).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          if(res.data.Body.Order.OrderBtnInfo.IsDisplayGotoPayBtn == '0') {
            // 如果订单处于不可支付的状态（已取消），跳转到支付结果页
            this.routeTo({
              name: 'order_detail',
              params: {
                orderId: this.orderId
              }
            }, true);
          } else {
            this.orderDetail = res.data.Body.Order;
            this.countdownTime = Math.ceil(this.orderDetail.ResidualTime || 0);
            var originTime = Number(new Date().getTime() + this.countdownTime * 1000);

            if (this.countdownTime > 0) {
              // 设置定时器
              // 开始定时器的时间与秒数
              clearInterval(this.interval);
              this.interval = setInterval(() => {
                if (this.countdownTime <= 1) {
                  // 支付倒计时结束
                  clearInterval(this.interval);
                  this.orderCancel();
                } else {
                  this.countdownTime = Math.round((originTime - new Date().getTime()) / 1000);
                  // this.countdownTime -= 1;
                }
              }, 1000);
            }

            // 订金不参与活动与红包
            if(!this.orderDetail.DepositInfo || this.orderDetail.DepositInfo.DepositIsPayOff == '1') {
              this.getServiceActivity(this.orderDetail.TotalPrice);
              this.getCouponList(this.orderDetail.Service.ServiceId);
            }
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    getServiceActivity(originPrice) {
      this.activityList.splice(0);
      this.orderDetail.ActivityNgs.ServiceTypeRules.map(value => {
        value.Details.map(val => {
          let dis = 0,
            upp = 0;
          val.Rules.map(v => {
            // 计算当前优惠规则的最大折扣
            if (Number(v.Upper) >= upp && Number(v.Upper) <= Number(originPrice)) {
              upp = Number(v.Upper);
              dis = Number(v.Minus);
            }

            // 对于每一个折扣数组，获取满足优惠最大折扣的信息
            this.activityList.push({
              Title: val.Title,
              Upper: upp,
              Minus: dis,
            });
          });

          this.discountAmount += dis;
        });
      });
    },
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
    getCouponList(id) {
      axios.post(API.GetCoupons, qs.stringify({
        Token: this.Token,
        ServiceId: id,
        IsPay: '1',
      })).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          // 红包分类
          let date = new Date();
          this.couponList.splice(0);
          res.data.Body.CouponList.forEach((value, index) => {
            this.couponList.push(value);
          });
          this.getCouponMaxAmount(Number(this.orderDetail.TotalPrice || Number(this.orderDetail.PayAmount)));
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    getCouponMaxAmount(originPrice) {
      let maxDisCoupon = null;
      let maxDis = 0;
      this.couponList.map(value => {
        if (Number(maxDis) <= Number(value.CouponDetails[0].DiscountAmount) && originPrice >= Number(value.CouponDetails[0].Amount)) {
          maxDisCoupon = value;
          maxDis = Number(value.CouponDetails[0].DiscountAmount);
        }
      });

      // 选择最大红包
      if (maxDisCoupon) {
        maxDisCoupon.NoUse = '0';
        this.$store.commit('SetCouponSelected', maxDisCoupon);
      } else {
        this.$store.commit('SetCouponSelected', {
          NoUse: '1',
        });
      }
    },
    countdownDialogOpen() {
      this.DialogConfig.IsDialog = '1';
    },
    countdownDialogClose() {
      this.DialogConfig.IsDialog = '0';
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
    orderCancel() {
      this.isLoading = true;
      this.bgLoading = '1';
      axios.post(API.CancelOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      })).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('订单已取消', () => {
            this.routeTo({
              name: 'order_detail',
              params: {
                orderId: this.orderId
              }
            }, true);
          });
        } else {
          this.alert(res.data.Meta.ErrorMsg, 2000);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    orderPay() {
      var couponId = this.CouponSelected.NoUse == '1' ? '' : this.CouponSelected.Id;
      if (this.isBalancePay == '1' && this.isWxPay == '0' && this.isZfbPay == '0') {
        // 只选择了余额支付
        this.payByBalance(this.orderId, this.balanceAmount, couponId);
      } else if (this.isWxPay == '1') {
        this.payByWx(this.orderId, this.cashAmount, this.balanceAmount, couponId);
      } else if (this.isZfbPay == '1') {
        this.payByZfb(this.orderId, this.cashAmount, this.balanceAmount, couponId);
      }
    },
    payByBalance(orderId, balance, couponId) {
      this.isLoading = true;
      this.bgLoading = '2';
      axios.post(API.BalancePay, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        CouponId: couponId || '',
        BalancePay: balance,
      })).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('支付成功', () => {
            this.routeTo({
              name: 'order_pay_status',
              query: {
                orderId: this.orderDetail.OrderId,
                type: this.payType,
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
    payByWx(orderId, price, balance, couponId) {
      this.isLoading = true;
      this.bgLoading = '2';
      axios.post(API.GetWxpaySign, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        PayFrom: '0', // 0:微信公众号 1:app
        OpenId: this.OpenId,
        WxPay: price,
        BalancePay: balance,
        CouponId: couponId || '',
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
                      orderId: that.orderDetail.OrderId,
                      type: that.payType,
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
    payByZfb(orderId, price, balance, couponId) {
      this.isLoading = true;
      this.bgLoading = '2';
      axios.post(API.GetAlipaySign, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        CouponId: couponId,
        Alipay: price,
        BalancePay: balance,
        SignType: 'web'
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
    ...mapState(['Token', 'OpenId', 'CouponSelected', 'ALERT_MSG']),
    payWayStatus() {
      if(this.balance == 0) {
        return {
          isMultiple: '0',
          isBalancePay: '0',
        }
      } else {
        if(Number(this.balance) < Number(this.orderDetail ? this.orderDetail.PayAmount : 0)) {
          return {
            isMultiple: '1',
            isBalancePay: '1',
          }
        } else {
          return {
            isMultiple: '0',
            isBalancePay: '1',
          }
        }
      }
    },
    payType() {
      if(this.orderDetail.DepositInfo && this.orderDetail.DepositInfo.DepositIsPayOff == '0') {
        return '0';
      } else {
        return '1';
      }
    },
    // 需要支付的总价（减去红包与折扣）
    payAmount() {
      if(this.orderDetail) {
        if (this.orderDetail.DepositInfo && this.orderDetail.DepositInfo.DepositIsPayOff == '0') {
          return this.orderDetail.DepositInfo.DepositAmount;
        } else {
          if (this.CouponSelected.NoUse == '1') {
            return Number(Number(this.orderDetail.TotalPrice) * 100 - this.discountAmount * 100) / 100;
          } else {
            var coupon = this.CouponSelected.CouponDetails ? this.CouponSelected.CouponDetails[0].DiscountAmount : 0;
            return (Number(this.orderDetail.TotalPrice) * 100 - Number(coupon) * 100 - this.discountAmount * 100) / 100;
          }
        }
      }
    },
    // 需要支付的总价（不包含折扣，但是包含红包，用来只使用微信或支付宝支付时传的参数，不能用来展示）
    totalPayAmount() {
      if (this.orderDetail) {
        if (this.orderDetail.DepositInfo && this.orderDetail.DepositInfo.DepositIsPayOff == '0') {
          return this.orderDetail.DepositInfo.DepositAmount;
        } else {
          if (this.CouponSelected.NoUse == '1') {
            return Number(this.orderDetail.TotalPrice);
          } else {
            var coupon = this.CouponSelected.CouponDetails ? this.CouponSelected.CouponDetails[0].DiscountAmount : 0;
            return (Number(this.orderDetail.TotalPrice) * 100 - Number(coupon) * 100) / 100;
          }
        }
      }
    },
    // 余额不够的情况下剩余需要支付的部分，这部分价格是原价
    // 这个字段只在且只能在调用支付接口时使用
    cashAmount() {
      if (this.isBalancePay == '1' && this.isZfbPay == '0' && this.isWxPay == '0') {
        // 只用余额
        return 0;
      } else if(this.isBalancePay == '0' && (this.isZfbPay == '1' || this.isWxPay == '1')) {
        // 不用余额
        return this.totalPayAmount - this.balanceAmount;
        // if (this.CouponSelected.NoUse == '1') {
        //   return this.totalPayAmount - this.balanceAmount;
        // } else {
        //   var coupon = this.CouponSelected.CouponDetails ? Number(this.CouponSelected.CouponDetails[0].DiscountAmount) : 0;
        //   return (this.totalPayAmount * 100 - coupon * 100 - this.balanceAmount * 100) / 100;
        // }
      } else {
        // 混合支付
        return Number((this.totalPayAmount - this.balanceAmount).toFixed(2));
      }
    },
    balanceAmount() {
      if(this.isBalancePay == '1' && this.isZfbPay == '0' && this.isWxPay == '0') {
        // 只用余额
        return this.totalPayAmount;
      } else if(this.isBalancePay == '0' && (this.isZfbPay == '1' || this.isWxPay == '1')) {
        // 不用余额
        return 0;
      } else {
        // 混合支付
        return this.balance;
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
      if(isNaN(amount)) {
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
    -webkit-justify-content: initial;
    justify-content: initial;
    padding: 0.333333rem 0.426667rem;
    background-image: url(../../../assets/static/images/order_pay_bg.png);
    background-repeat: no-repeat;
    background-size: 100%;
    color: #333639;
    .status-img
    {
      width: 1.6rem;
      height: 1.6rem;
    }
    .status-info
    {
      margin-left: 0.32rem;
      .info-amount
      {
        line-height: 100%;
        color: #333639;
        font-size: 18px;
      }
      .info-name
      {
        line-height: 100%;
        margin-top: 0.213333rem;
        color: #333639;
        font-size: 14px;
      }
    }
  }
  .order-info
  {
    margin-top: 0.266667rem;
    background-color: #fff;
    .info-deposit,
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