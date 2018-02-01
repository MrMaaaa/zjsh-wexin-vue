<template>
<div class="wrapper">
  <section class="countdown" v-if="orderDetail && orderDetail.OrderId && countdownTime > 0">
    <span class="countdown-title">支付剩余时间</span><span class="countdown-time">{{ countdownTime | formatCountdown }}</span>
  </section>

  <section class="order-status flex-row" v-if="orderDetail && orderDetail.OrderId">
    <img class="status-img" :src="orderDetail.Service.ServiceIcon">

    <div class="status-info">
      <div class="info-amount" v-if="orderDetail && orderDetail.DepositInfo && orderDetail.DepositInfo.DepositIsPayOff == '0'">￥{{ orderDetail.DepositInfo.DepositAmount | formatAmount }}</div>
      <div class="info-amount" v-else>￥{{ payAmount | formatAmount }}</div>
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

    <div class="info-coupon flex-row" @click="couponSelect">
      <div class="left">红包</div>

      <div class="right flex-row">
        <span class="txt-price" v-if="CouponSelected.NoUse === '0'">-￥{{ CouponSelected.CouponDetails[0].DiscountAmount | formatAmount }}</span>
        <span class="txt-price" v-else-if="CouponSelected.NoUse === '1' && couponList.length > 0">不使用红包</span>
        <span class="txt-price" v-else>暂无可用红包</span>
        <img class="right-icon" src="../../assets/images/link.png">
      </div>
    </div>
  </section>

  <section class="order-pay-way">
    <div class="pay-way-select flex-row" @click="selectPayWay(0)">
      <div class="left">
        <img class="pay-way-icon" src="../../assets/images/pay_ye.png"><span>账户余额支付<span class="user-balance">余额{{ balance | formatAmount }}元</span></span>
      </div>

      <img class="pay-way-select-icon" v-show="balance > 0 && isBalancePay == '1'" src="../../assets/images/orders_pitch_on.png">
      <img class="pay-way-select-icon" v-show="balance > 0 && isBalancePay == '0' && payWayStatus.isMultiple == '0'" src="../../assets/images/address_unselected.png">
      <img class="pay-way-select-icon" v-show="balance > 0 && isBalancePay == '0' && payWayStatus.isMultiple == '1'" src="../../assets/images/orders_choose.png">
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

  <section class="tips">
    <header class="tips-title">温馨提示：</header>

    <div class="tips-content">
      <p>1.在线支付才能享受特价满减等优惠活动。</p>
      <p>2.余额不足时可用支付宝或微信支付剩余部分。</p>
    </div>
  </section>

  <section class="order-btn" v-show="orderDetail && orderDetail.OrderId">
    <a class="btn-pay" @click="orderPayConfirm">确认支付￥{{ payAmount | formatAmount }}</a>
  </section>

  <m-dialog :title="dialogCfg.title" :msg="dialogCfg.msg" :btns="dialogCfg.btns" v-if="dialogCfg.show">
    <span slot="message" v-if="dialogCfg.slots.message">还差一步了，确定要退出吗？<span style="color: #f56165">{{ countdownTime | formatCountdown }}</span>内还可以从订单列表继续支付</span>
    <div slot="message" v-else-if="dialogCfg.slots.order">
      <p style="margin-top: 0.4rem;" v-if="isBalancePay === '1'">
        <span style="display: inline-block; width: 2.4rem;">余额支付：</span>
        <span style="color: #333639">{{ balanceAmount | formatAmount }}元</span>
      </p>
      <p style="margin-top: 0.666667rem;" v-if="isZfbPay === '1' || isWxPay === '1'">
        <span style="display: inline-block; width: 2.4rem;" v-if="isZfbPay === '1'">支付宝支付：</span>
        <span style="display: inline-block; width: 2.4rem;" v-if="isWxPay === '1'">微信支付：</span>
        <span style="color: #ffa046">{{ cashAmount | formatAmount }}元</span></p>
    </div>
  </m-dialog>
</div>
</template>

<script>
import { mapState } from 'vuex';
const MDialog  = () => import('../../components/common/Dialog/Dialog.vue');

export default {
  name: 'order_pay',
  data() {
    return {
      orderId: '',
      isSameOrderId: false, // 是否为同一个id，true：自动选择红包，false：不自动选择
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
      isExit: false,
      dialogCfg: {
        show: false,
        title: '',
        msg: '',
        btns: [],
        slots: {
          message: false,
          order: false
        }
      }
    }
  },
  components: {
    MDialog
  },
  beforeRouteLeave(to, form, next) {
    if (this.isExit) {
      next();
    } else {
      next(false);
      this.dialogCfg.show = true;
      this.dialogCfg.title = '温馨提示';
      this.dialogCfg.slots.message = true;
      this.dialogCfg.slots.order = false;
      this.dialogCfg.btns = [{
        text: '取消',
        callback: () => {
          this.dialogCfg.show = false;
        }
      }, {
        text: '确定',
        callback: () => {
          this.$store.commit('SetSpots', {
            Order: true
          });
          this.dialogCfg.show = false;
          this.isExit = true;
          this.$router.back();
        }
      }];
    }
  },
  activated() {
    // 需要先设置红包为不可用，避免上一次的红包带来的错误
    if (this.orderId !== this.$route.params.orderId) {
      this.isSameOrderId = false;
      this.$store.commit('SetCouponSelected', {
        NoUse: '1',
      });
    } else {
      this.isSameOrderId = true;
    }

    this.orderId = this.$route.params.orderId;

    window.clearInterval(this.interval);
    this.isBalancePay = '0';
    this.isWxPay = '0';
    this.isZfbPay = '0';
    this.isExit = false;
    this.dialogCfg = {
      show: false,
      title: '',
      msg: '',
      btns: [],
      slots: {
        message: false
      }
    };

    // 先获取余额，再获取订单信息
    this.getUserSettlement();
  },
  methods: {
    getOrderDetail() {
      this.$loading.open();
      this.$store.dispatch('GetOrderInfoEx', {
          OrderId: this.orderId
        })
        .then(res => {
          this.$loading.close();
          if (res.Order.OrderBtnInfo.IsDisplayGotoPayBtn == '0') {
            // 如果订单处于不可支付的状态（已取消），跳转到支付结果页
            this.isExit = true;
            this.routeTo({
              name: 'order_detail',
              params: {
                orderId: this.orderId
              }
            }, true);
          } else {
            this.orderDetail = res.Order;
            this.countdownTime = Number(this.orderDetail.ResidualTime || 0);

            if (this.countdownTime > 0) {
              // 设置定时器
              // 开始定时器的时间与秒数
              window.clearInterval(this.interval);
              this.interval = window.setInterval(() => {
                if (this.countdownTime <= 1) {
                  // 支付倒计时结束
                  window.clearInterval(this.interval);
                  this.isExit = true;
                  this.routeTo({
                    name: 'order_detail',
                    params: {
                      orderId: this.orderId
                    }
                  }, true);
                } else {
                  this.countdownTime -= 1;
                }
              }, 1000);
            } else {
              this.isExit = true;
            }

            // 订金不参与活动与红包
            if (!this.orderDetail.DepositInfo || this.orderDetail.DepositInfo.DepositIsPayOff == '1') {
              this.getServiceActivity(this.orderDetail.TotalPrice);
              if (!this.isSameOrderId) {
                this.getCouponList(this.orderDetail.Service.ServiceId);
              }
            }
          }
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
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
      this.$store.dispatch('MySettlement')
        .then(res => {
          this.balance = Number(res.SettlementBalance);
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

          this.getOrderDetail();
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    getCouponList(id) {
      this.$store.dispatch('GetCoupons', {
          ServiceId: id,
          IsPay: '1'
        })
        .then(res => {
          let date = new Date();
          this.couponList.splice(0);
          res.CouponList.forEach((value, index) => {
            this.couponList.push(value);
          });
          this.getCouponMaxAmount(Number(this.orderDetail.TotalPrice || Number(this.orderDetail.PayAmount)));
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
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
    couponSelect() {
      this.isExit = true;
      this.routeTo({
        name: 'order_coupon_select',
        query: {
          totalPrice: this.orderDetail.TotalPrice || this.orderDetail.PayAmount,
          serviceId: this.orderDetail.Service.ServiceId,
          isPay: '1'
        }
      });
    },
    selectPayWay(type) {
      // type: 0余额 1支付宝 2微信
      if(type == '0') {
        // if(this.payWayStatus.isBalancePay == '1') {
        //   this.isBalancePay = '1';
        // } else {
        //   this.isBalancePay = '0';
        // }
        if(this.payWayStatus.isBalancePay == '1' && this.payWayStatus.isMultiple == '0') {
          this.isWxPay = '0';
          this.isZfbPay = '0';
          this.isBalancePay = '1';
        } else {
          this.isBalancePay = this.isBalancePay === '1' ? '0' : '1';
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
    orderPayConfirm() {
      if (this.payWayStatus.isMultiple === '1' && this.isBalancePay === '1') {
        this.dialogCfg.show = true;
        this.dialogCfg.title = '付款详情';
        this.dialogCfg.slots.message = false;
        this.dialogCfg.slots.order = true;
        this.dialogCfg.btns = [{
          text: '取消',
          callback: () => {
            this.dialogCfg.show = false;
          }
        }, {
          text: '确定',
          callback: () => {
            this.dialogCfg.show = false;
            this.isExit = true;
            this.orderPay();
          }
        }];
      } else {
        this.dialogCfg.show = false;
        this.isExit = true;
        this.orderPay();
      }
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
      this.$loading.open(2);
      this.$store.dispatch('BalancePay', {
          OrderId: orderId,
          CouponId: couponId || '',
          BalancePay: balance
        })
        .then(res => {
          this.$loading.close();
          this.$alert(this.ALERT_MSG.PAY_SUCCESS);
          this.isExit = true;
          this.routeTo({
            name: 'order_pay_status',
            query: {
              orderId,
              type: this.payType,
              money: balance
            }
          }, true);
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    payByWx(orderId, price, balance, couponId) {
      this.$loading.open(2);
      this.$store.dispatch('GetWxpaySign', {
          OrderId: orderId,
          WxPay: price,
          BalancePay: balance,
          CouponId: couponId || ''
        })
        .then(res => {
          this.$loading.close();
          const that = this;
          function onBridgeReady() {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": res.WxpaySign.appid,
                "timeStamp": res.WxpaySign.timestamp,
                "nonceStr": res.WxpaySign.noncestr,
                "package": res.WxpaySign.package,
                "signType": "MD5",
                "paySign": res.WxpaySign.sign
              },
              function(wx_res) {
                if (wx_res.err_msg == "get_brand_wcpay_request:ok") {
                  that.$alert(that.ALERT_MSG.PAY_SUCCESS);
                  that.isExit = true;
                  that.routeTo({
                    name: 'order_pay_status',
                    query: {
                      id: orderId,
                      type: '1',
                      money: Number(price) + Number(balance),
                    }
                  }, true);
                } else if (wx_res.err_msg == "get_brand_wcpay_request:cancel" || wx_res.err_msg == "get_brand_wcpay_request:fail") {
                  that.$alert(that.ALERT_MSG.PAY_ERROR);
                } else {
                  that.$alert(wx_res.err_desc);
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
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    payByZfb(orderId, price, balance, couponId) {
      this.$loading.open(2);
      this.$store.dispatch('GetAlipaySign', {
          OrderId: orderId,
          CouponId: couponId,
          Alipay: price,
          BalancePay: balance
        })
        .then(res => {
          this.$loading.close();
          this.isExit = true;
          window.location.href = res.GATEWAY_NEW + res.AlipaySign;
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
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
    ...mapState(['OpenId', 'CouponSelected', 'ALERT_MSG']),
    payWayStatus() {
      if(this.balance == 0) {
        return {
          isMultiple: '0',
          isBalancePay: '0',
        }
      } else {
        if(this.balance < this.payAmount) {
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
          // 如果是面议类的支付，需要减去之前的订金金额
          var depositAmount = this.orderDetail.DepositInfo ? Number(this.orderDetail.DepositInfo.DepositAmount) : 0;
          if (this.CouponSelected.NoUse == '1') {
            return Number(Number(this.orderDetail.TotalPrice) * 100 - this.discountAmount * 100 - depositAmount * 100) / 100;
          } else {
            var coupon = this.CouponSelected.CouponDetails ? this.CouponSelected.CouponDetails[0].DiscountAmount : 0;
            return (Number(this.orderDetail.TotalPrice) * 100 - Number(coupon) * 100 - this.discountAmount * 100 - depositAmount * 100) / 100;
          }
        }
      } else {
        return '';
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
    // 支付需要的余额
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
    formatCountdown(time) {
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
$color_base_bg: #f7f7ff;
$color_base_red: #f56165;
$color_text_normal: #333639;
$color_text_light: #666;

@mixin m-row {
  padding: 0.453333rem 0.426667rem;
  color: $color_text_normal;
  font-size: 14px;
}

.pay-split
{
  margin-left: 0.293333rem;
  height: 1px;
  background-color: #f7f7ff;
}
.wrapper
{
  background-color: #f7f7ff;
  overflow: auto;
  .countdown
  {
    position: relative;
    height: 1.066667rem;
    line-height: 1.066667rem;
    text-align: center;
    background-color: #fef7da;
    font-size: 14px;
    .countdown-title
    {
      color: #f0a954;
    }
    .countdown-time
    {
      margin-left: 0.133333rem;
      color: $color_base_red;
    }
  }
  .order-status
  {
    -webkit-justify-content: initial;
    justify-content: initial;
    padding: 0.333333rem 0.426667rem;
    background: url(../../../assets/static/images/order_pay_bg.png) no-repeat;
    background-size: 100% 100%;
    color: $color_text_normal;
    .status-img
    {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 0.8rem;
    }
    .status-info
    {
      margin-left: 0.32rem;
      .info-amount
      {
        line-height: 100%;
        color: $color_text_normal;
        font-size: 18px;
      }
      .info-name
      {
        line-height: 100%;
        margin-top: 0.213333rem;
        color: $color_text_normal;
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
        color: $color_text_light;
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
      color: $color_text_normal;
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
  .tips
  {
    margin-top: 0.266667rem;
    padding: 0.453333rem 0.426667rem;
    color: $color_text_light;
    .tips-content
    {
      margin-top: 0.133333rem;
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
    border-top: 1px solid #f7f7ff;
    background-color: #fff;
    .btn-pay
    {
      display: block;
      height: 1.146667rem;
      line-height: 1.146667rem;
      margin: 0.4rem 0.426667rem;
      border-radius: 4px;
      background-color: $color_base_red;
      color: #fff;
      text-align: center;
      font-size: 16px;
    }
  }
}
</style>