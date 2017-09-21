<template>
<div class="app">
  <header class="first-recharge recharge-section flex-row" :class="{ active: activeIndex == -1 }" @touchend="selectRecharge(firstRecharge, -1)">
    <div class="title">
      <span class="title-span">首充<br>特惠</span>
    </div>

    <div class="content">
      <div class="row">
        <span class="money-recharge">充{{ firstRecharge.RechargeMoney | moneyFilter }}元</span>
        <span class="money-presented">赠送{{ firstRecharge.ReturnMoney | moneyFilter }}元</span>
      </div>
      <div class="row tip">每个账号限领一次</div>
    </div>
  </header>

  <div class="recharges flex-row">
    <section class="recharge-section" :class="{ active: activeIndex == index }" v-for="(item, index) in rechargeList" @touchend="selectRecharge(item, index)">
      <div class="content">
        <div class="money-recharge">充{{ item.RechargeMoney | moneyFilter }}元</div>
        <div class="money-presented" v-if="!!item.ReturnMoney">赠送{{ item.ReturnMoney | moneyFilter }}元</div>
      </div>
    </section>
  </div>

  <div class="recharge-amount flex-row">
    <div class="title">充值金额：</div>
    <div class="content">￥<span class="amount">{{ selectRechargeItem.RechargeMoney | moneyFilter }}</span></div>
  </div>

  <div class="recharge-info flex-row">
    <div class="title">额外赠送&nbsp;&nbsp;{{ selectRechargeItem.ReturnMoney | moneyFilter }}元</div>
    <div class="content">实际可得<span class="amount">￥{{ selectRechargeItem.TotalMoney | moneyFilter }}</span></div>
  </div>

  <div class="pay-way">
    <div class="title">支付方式</div>

    <div class="content flex-row" v-if="OpenId === ''" @click="payType = '0'">
      <div><img class="icon-pay" src="../../../assets/images/pay_zfb.png"><span class="pay-span">支付宝支付</span></div>

      <img class="icon-select" v-if="payType === '0'" src="../../../assets/images/orders_pitch_on.png">
      <img class="icon-select" v-else src="../../../assets/images/address_unselected.png">
    </div>

    <div class="content flex-row" v-if="OpenId !== ''"  @click="payType = '1'">
      <div><img class="icon-pay" src="../../../assets/images/pay_wx.png"><span class="pay-span">微信支付</span></div>

      <img class="icon-select" v-if="payType === '1'" src="../../../assets/images/orders_pitch_on.png">
      <img class="icon-select" v-else src="../../../assets/images/address_unselected.png">
    </div>
  </div>

  <div class="pay-submit">
    <a class="btn-submit" @touchend="submitRecharge">￥{{ selectRechargeItem.RechargeMoney | moneyFilter }}&nbsp;&nbsp;立即支付</a>
  </div>

  <m-loading bg-style="2" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'one_recharge_index',
  data() {
    return {
      activeIndex: -1,
      firstRecharge: {
      },
      selectRechargeItem: {
      },
      activityDesc: '',
      rechargeList: [],
      isLoading: false,
      payType: '0',
    }
  },
  mounted() {
    if(this.OpenId != '') {
      this.payType = '1';
    }
    this.getRechargeList();
  },
  methods: {
    getRechargeList() {
      this.isLoading = true;
      axios.post(API.GetReChargeListResponse).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          let count = 0;
          let tempArr = [];
          let list = res.data.Body.List;
          this.rechargeList = list;
          this.activityDesc = res.data.Body.RechargeDescription;
          this.firstRecharge = list[0];
          this.selectRecharge(this.firstRecharge, '-1');
          this.rechargeList.splice(0, 1);
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    selectRecharge(item, index) {
      this.activeIndex = index;
      this.selectRechargeItem = item;
    },
    submitRecharge() {
      if(this.IsLogin == '1') {
        if(this.selectRechargeItem.RechargeMoney == '1' && this.activeIndex == -1) {
          // 1元充值
          this.isLoading = true;
          axios.post(API.IsFirstRecharge, qs.stringify({
            Token: this.Token,
          })).then(res => {
            if (res.data.Body) {
              this.recharges();
            } else {
              this.isLoading = false;
              this.alert('您已经参加过充值活动了，看看其它优惠吧', 2000);
            }
          }).catch(err => {
            this.isLoading = false;
            this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
          });
        } else {
          // 非1元首充充值
          this.recharges();
        }
      } else {
        this.openLogin();
      }
    },
    recharges() {
      this.isLoading = true;
      if(this.payType === '0') {
        this.rechargeByZfb(Number(this.selectRechargeItem.RechargeMoney), Number(this.selectRechargeItem.TotalMoney), this.selectRechargeItem.ActivityId, this.selectRechargeItem.Activity);
      } else if(this.payType === '1') {
        this.rechargeByWx(Number(this.selectRechargeItem.RechargeMoney), Number(this.selectRechargeItem.TotalMoney), this.selectRechargeItem.ActivityId, this.selectRechargeItem.Activity);
      }
    },
    rechargeByZfb(rechargeMoney, totalMoney, activityId, activity) {
      axios.post(API.GetAlipaySignForWeb, qs.stringify({
        Token: this.Token,
        NeedPay: rechargeMoney,
        TotalMoney: totalMoney,
        ActivityId: activityId,
        Activity: activity,
      })).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          window.location.href = res.data.Body.GATEWAY_NEW + res.data.Body.AlipaySign;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    rechargeByWx(rechargeMoney, totalMoney, activityId, activity) {
      axios.post(API.GetWxpaySignForWeb, qs.stringify({
        Token: this.Token,
        NeedPay: rechargeMoney,
        TotalMoney: totalMoney,
        ActivityId: activityId,
        Activity: activity,
        TradeType: this.OpenId === '' ? 'MWEB' : 'JSAPI',
        OpenId: this.OpenId,
      })).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          if(this.OpenId != '') {
            // 公众号支付
            const that = this;
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
                function(wx_res) {
                  if (wx_res.err_msg == "get_brand_wcpay_request:ok") {
                    that.$router.push({
                      name: 'one_recharge_order',
                      params: {
                        out_trade_no: res.data.Body.out_trade_no
                      }
                    });
                  } else if (wx_res.err_msg == "get_brand_wcpay_request:cancel" || wx_res.err_msg == "get_brand_wcpay_request:fail") {
                    // that.alert(that.$store.state.IS_DEBUG === '0' ? that.ALERT_MSG.PAY_ERROR : wx_res.err_desc);
                    that.alert(that.ALERT_MSG.PAY_ERROR);
                  } else {
                    that.alert(wx_res.err_desc);
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
            // 微信h5支付
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    }
  },
  computed: {
    ...mapState(['Token', 'IsLogin', 'OpenId', 'ALERT_MSG']),
  },
  filters: {
    moneyFilter(value) {
      if(!value || isNaN(value)) {
        return 0;
      }
      return Number(value);
    }
  }
}
</script>

<style scoped>
.recharge-section
{
  position: relative;
  box-sizing: border-box;
  width: 2.826667rem;
  height: 2.133333rem;
  border-radius: 4px;
  border: 2px solid transparent;
  overflow: auto;
}
.recharge-section.active
{
  border: 2px solid #f56165;
}
.recharge-section.first-recharge.active
{
  border: 2px solid #f56165;
}
.recharge-section.active::after
{
  position: absolute;
  bottom: -1px;
  right: -1px;
  content: '';
  display: block;
  width: 0.88rem;
  height: 0.68rem;
  background-image: url(../../../assets/images/selected-1.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.recharge-section.first-recharge
{
  width: auto;
  border: 2px solid transparent;
  margin: 0.6rem 0.426667rem;
}
.recharge-section .title
{
  flex-shrink: 0;
  position: relative;
  box-sizing: border-box;
  width: 2.093333rem;
  height: 100%;
  background-color: #f56165;
  color: #fff;
  font-size: 20px;
  text-align: center;
  vertical-align: middle;
}
.recharge-section .title .title-span
{
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: block;
  width: 100%;
  text-align: center;
}
.recharge-section .content
{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 0.546667rem;
  padding-bottom: 0.546667rem;
  background-color: #fff;
  text-align: center;
}
.recharge-section.first-recharge .content
{
  padding-left: 0.8rem;
  text-align: left;
}
.recharge-section .content .money-recharge
{
  line-height: 100%;
  font-size: 18px;
  color: #333639;
}
.recharge-section .content .money-presented
{
  line-height: 100%;
  margin-top: 0.186667rem;
  font-size: 14px;
  color: #f56165;
}
.recharge-section.first-recharge .content .money-presented
{
  margin-top: 0;
  margin-left: 0.32rem;
}
.recharge-section .content .tip
{
  line-height: 100%;
  margin-top: 0.186667rem;
  color: #999;
  font-size: 14px;
}
.recharges
{
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  margin: 0.333333rem 0.426667rem 0;
}
.recharges .recharge-section:nth-child(n+4)
{
  margin-top: 0.333333rem;
}
.recharges .content
{
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: space-around;
}
.recharge-amount
{
  height: 1.466667rem;
  margin: 0.68rem 0.426667rem 0;
  padding-left: 0.346667rem;
  padding-right: 0.453333rem;
  background-color: #fff;
}
.recharge-amount .title
{
  color: #333;
  font-size: 16px;
}
.recharge-amount .content
{
  color: #999;
  font-size: 18px;
}
.recharge-amount .content .amount
{
  color: #333639;
  font-size: 25px;
}
.recharge-info
{
  line-height: 100%;
  margin: 0.373333rem 0.426667rem 0;
}
.recharge-info .title
{
  color: #999;
  font-size: 13px;
}
.recharge-info .content
{
  color: #999;
  font-size: 13px;
}
.recharge-info .content .amount
{
  margin-left: 0.16rem;
  color: #f56165;
  font-size: 14px;
}
.pay-way
{
  margin: 0.786667rem 0.426667rem 0;
}
.pay-way .title
{
  color: #666;
  font-size: 14px;
}
.pay-way .content
{
  margin-top: 0.426667rem;
}
.pay-way .content .icon-pay
{
  width: 0.8rem;
  height: 0.8rem;
  vertical-align: middle;
}
.pay-way .content .pay-span
{
  margin-left: 0.32rem;
  color: 333639;
  font-size: 15px;
  vertical-align: middle;
}
.pay-way .content .icon-select
{
  width: 0.586667rem;
  height: 0.586667rem;
}
.pay-submit
{
  position: fixed;
  bottom: 0;
  left: 0;
  transform: translateZ(0);
  width: 100%;
  height: 1.946667rem;
  background-color: #fff;
}
.pay-submit .btn-submit
{
  display: block;
  height: 1.146667rem;
  line-height: 1.146667rem;
  margin: 0.4rem 0.666667rem;
  border-radius: 4px;
  background-color: #f56165;
  color: #fff;
  font-size: 16px;
  text-align: center;
}
</style>