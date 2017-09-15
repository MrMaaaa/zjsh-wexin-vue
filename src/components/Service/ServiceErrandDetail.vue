<template>
<div>
  <div class="order-detail" v-if="orderDetail">
    <div class="order-status" v-if="orderStatusList && orderStatusList.length > 0">
      <ul class="status-list">
        <li class="status-item receive-address flex-row">
          <div class="datetime">
            <span class="time">00:00</span>
            <span class="date">0000-00-00</span>
          </div>
          <div class="step">
            <img class="icon-receive" src="../../assets/images/icon_receive.png">
          </div>
          <div class="info">【收件地址】{{ orderDetail.RevicerAddress.Address1 }} {{ orderDetail.RevicerAddress.Address2 }}</div>
        </li>
        <li class="status-item flex-row" v-for="(item,index) in orderStatusList">
          <div class="datetime">
            <span class="time">{{ item.Time }}</span>
            <span class="date">{{ item.Date }}</span>
          </div>
          <div class="step">
            <div class="point" :class="{ now: index == 0 }"></div>
          </div>
          <div class="info">{{ item.AcceptStation }}</div>
        </li>
      </ul>
    </div>

    <div class="section-split"></div>

    <div class="order-info">
      <header class="title">订单信息</header>
      <div class="info-split" v-if="orderDetail.CancelReason"></div>
      <div class="row flex-row" v-if="orderDetail.CancelReason">
        <div class="left">取消原因</div>
        <div class="right">{{ orderDetail.CancelReason }}</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">合作企业</div>
        <div class="right">{{ orderDetail.ShipperName }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">第三方订单号</div>
        <div class="right">{{ orderDetail.LogisticCode }}</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">发件地址</div>
        <div class="right txt-over-hide">{{ orderDetail.SenderAddress.Address1 }} {{ orderDetail.SenderAddress.Address2 }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">发件人</div>
        <div class="right txt-over-hide">{{ orderDetail.SenderAddress.Contact }}</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">收件地址</div>
        <div class="right txt-over-hide">{{ orderDetail.RevicerAddress.Address1 }} {{ orderDetail.RevicerAddress.Address2 }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">收件人</div>
        <div class="right txt-over-hide">{{ orderDetail.RevicerAddress.Contact }}</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">发货时间</div>
        <div class="right txt-over-hide">{{ orderDetail.ServiceTime | formatDate }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">备注</div>
        <div class="right txt-over-hide" v-if="!orderDetail.Note"></div>
        <div class="right txt-over-hide" v-else>{{ orderDetail.Note }}</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">物品名称</div>
        <div class="right txt-over-hide">{{ orderDetail.GoodsName }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">物品重量</div>
        <div class="right txt-over-hide">{{ orderDetail.GoodsWeight }}kg</div>
      </div>
      <div class="row price flex-row">
        <div class="left">费用</div>
        <div class="right txt-over-hide">{{ orderDetail.Price | formatAmount }}元</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">订单编号</div>
        <div class="right txt-over-hide">{{ orderDetail.OrderCode }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">下单时间</div>
        <div class="right txt-over-hide">{{ orderDetail.CreateTime | formatDate }}</div>
      </div>
      <div class="info-split"></div>
      <div class="operation-btns flex-row">
        <a class="btn" v-if="orderDetail.IsPayOff === '0' && orderDetail.State > 0" @click="DialogConfig.IsDialog='1'">取消订单</a>
        <a class="btn oppo" v-if="orderDetail.IsPayOff === '0' && orderDetail.State > 0" @click="orderPay(orderDetail)">支付</a>
        <a class="btn oppo" v-if="orderDetail.State > 1" href="tel:4008-262-056">联系客服</a>
      </div>
    </div>
  </div>

  <m-dialog :dialog-config="DialogConfig" @dialog-confirm="orderProcess" @dialog-cancel="dialogClose"></m-dialog>

  <m-loading :bg-style="loadingBgStyle" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'errand_order_detail',
  data() {
    return {
      orderDetail: null,
      orderStatusList: [],
      orderId: '',
      loadingBgStyle: '1',
      isLoading: true,
      DialogConfig: {
        IsDialog: '0', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
        DialogTitle: '取消订单', // 对话框标题
        DialogContent: '确定取消订单吗？', // 对话框内容
        DialogBtns: ['取消', '确定'], // 对话框按钮文本
      },
    }
  },
  activated() {
    this.orderStatusList.splice(0);
    this.orderId = this.$route.params.orderId;
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail: function() {
      this.isLoading = true;
      axios.post(API.GetExpressDetail, {
        Token: this.Token,
        OrderId: this.orderId,
      }).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          this.orderDetail = res.data.Body;
          if(this.orderDetail.LogisticCode) {
            this.getOrderStatus(this.orderDetail.LogisticCode, this.orderDetail.ShipperCode);
          } else {
            this.orderStatusList = this.orderStatusList.concat(this.orderDetail.Traces);
            this.orderStatusList.forEach((value, index) => {
              value.Date = value.AcceptTime.split(' ')[0];
              value.Time = value.AcceptTime.split(' ')[1];
            });
          }
          if (this.orderDetail.SenderAddress.Address2 == null) {
            this.orderDetail.SenderAddress.Address2 = '';
          }
          if (this.orderDetail.RevicerAddress.Address2 == null) {
            this.orderDetail.RevicerAddress.Address2 = '';
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message, 10000);
      });
    },
    getOrderStatus(LogisticCode, ShipperCode) {
      axios.post(API.GetKdTrackInfo, qs.stringify({
        LogisticCode: LogisticCode,
        ShipperCode: ShipperCode
      })).then(res => {
        if (res.data.Meta.ErrorCode == '0') {
          this.orderStatusList = res.data.Body.Traces;
          this.orderStatusList = this.orderStatusList.concat(this.orderDetail.Traces);
          this.orderStatusList.forEach((value, index) => {
            value.Date = value.AcceptTime.split(' ')[0];
            value.Time = value.AcceptTime.split(' ')[1];
          });
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message, 10000);
      });
    },
    getCouponMaxAmount(serviceId, originPrice, callback) {
      axios.post(API.GetCoupons, qs.stringify({
        Token: this.Token,
        ServiceId: serviceId,
        IsPay: '1',
      })).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          // 红包分类
          let maxDisCoupon = null;
          let maxDis = 0;
          res.data.Body.CouponList.forEach((value, index) => {
            if (maxDis <= value.CouponDetails[0].DiscountAmount && originPrice >= value.CouponDetails[0].Amount) {
              maxDisCoupon = value;
              maxDis = Number(value.CouponDetails[0].DiscountAmount);
            }
          });
          this.couponMax = maxDisCoupon;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
        callback && callback();
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    orderPay(orderInfo) {
      orderInfo.OrderId = this.orderId || orderInfo.OrderId;
      this.isLoading = true;
      this.loadingBgStyle = '2';
      this.txtLoading = '';
      let couponId = '';
      this.getCouponMaxAmount('137', orderInfo.Price, () => {
        let p = Number(orderInfo.Price);
        if (this.couponMax) {
          p -= this.couponMax.CouponDetails[0].DiscountAmount;
          couponId = this.couponMax.Id;
        }

        if (this.OpenId) {
          this.orderPayByWx(orderInfo.OrderId, p, couponId);
        } else {
          this.orderPayByAli(orderInfo.OrderId, p, couponId);
        }
      });
    },
    orderPayByWx(orderId, price, couponId) {
      this.isLoading = true;
      this.loadingBgStyle = '2';
      this.txtLoading = '';
      axios.post(API.GetWxpaySign, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        PayFrom: '0', // 0:微信公众号 1:app
        OpenId: this.OpenId,
        WxPay: price,
        BalancePay: '0',
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
                  that.$router.push({
                    name: 'order_pay_status',
                    params: {
                      orderId: orderId
                    }
                  });
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
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    orderPayByAli(orderId, price, couponId) {
      this.isLoading = true;
      this.bgLoading = '2';
      this.txtLoading = '';
      axios.post(API.GetAlipaySign, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        CouponId: couponId,
        Alipay: price,
        BalancePay: '0',
        SignType: 'web'
      })).then(res => {
        this.isLoading = false;
        const that = this;
        if (res.data.Meta.ErrorCode === '0') {
          if(browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
            window.location.href = res.data.Body.GATEWAY_NEW + res.data.Body.AlipaySign;
          } else if(browser.versions.android) {
            var WVJBIframe = document.createElement('iframe');
            document.title = '支付';
            WVJBIframe.setAttribute('id', 'alipay');
            WVJBIframe.setAttribute('frameborder', 'no');
            WVJBIframe.setAttribute('border', '0');
            WVJBIframe.setAttribute('width', '100%');
            WVJBIframe.setAttribute('height', '100%');
            WVJBIframe.id = 'alipay';
            WVJBIframe.frameborder = 'no';
            WVJBIframe.border = '0';
            WVJBIframe.width = '100%';
            WVJBIframe.height = '100%';
            WVJBIframe.style.position = 'fixed';
            WVJBIframe.style.top = '0';
            WVJBIframe.style.left = '0';
            WVJBIframe.style.backgroundColor = '#fff';
            // WVJBIframe.src = res.data.Body.GATEWAY_NEW + res.data.Body.AlipaySign;
            WVJBIframe.src = res.data.Body.GATEWAY_NEW + res.data.Body.AlipaySign;
            document.documentElement.appendChild(WVJBIframe);
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    orderCancel() {
      axios.post(API.CancelOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      })).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('取消成功');
          this.orderStatusList.splice(0);
          this.orderId = this.$route.params.orderId;
          this.getOrderDetail();
        } else {
          this.alert(res.data.Meta.ErrorMsg, 2000);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    orderProcess() {
      this.DialogConfig.IsDialog = '0';
      this.orderCancel();
    },
    dialogClose() {
      this.DialogConfig.IsDialog = '0';
    },
  },
  computed: {
    ...mapState(['Token', 'OpenId', 'ALERT_MSG']),
  },
  filters: {
    formatDate(millisecond) {
      var date = new Date(Number(millisecond + '000'));
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      var hour = date.getHours();
      hour = hour < 10 ? '0' + hour : hour;
      var minute = date.getMinutes();
      minute = minute < 10 ? '0' + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? '0' + second : second;
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    formatAmount(amount) {
      let a = amount.toString();
      if(a.indexOf('.') === -1) {
        return amount + '.00';
      } else {
        return a.split('.')[0] + '.' + (a.split('.')[1].length === 1 ? a.split('.')[1] + '0' : a.split('.')[1]);
      }
    }
  }
}
</script>

<style scoped>
input
{
  border: none !important;
  outline: none !important;
}
.section-split
{
  height: 0.266667rem;
  background-color: #eef2f5;
}
.order-status-title
{
  height: 2.24rem;
  line-height: 2.24rem;
  background-color: #fff;
  text-align: center;
}
.order-status-title .icon-status
{
  display: inline-block;
  width: 0.666667rem;
  height: 0.666667rem;
  vertical-align: middle;
}
.order-status-title .info
{
  display: inline-block;
  margin-left: 0.333333rem;
  vertical-align: middle;
}
.order-status-title .info .title
{
  display: block;
  line-height: 100%;
  color: #27b8f3;
  text-align: left;
  font-size: 16px;
}
.order-status-title .info .desc
{
  display: block;
  line-height: 100%;
  margin-top: 0.24rem;
  color: #666;
  text-align: left;
  font-size: 14px;
}
.order-status
{
  padding-bottom: 0.666667rem;
  background-color: #fff;
}
.order-status .top-split
{
  margin: 0 0.293333rem;
  padding-top: 0.866667rem;
  border-top: 1px dashed #ccc;
}
.status-list
{
  padding-left: 0.8rem;
  padding-right: 1.066667rem;
}
.status-list .status-item
{
  padding: 0.333333rem 0;
  color: #666;
  font-size: 14px;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
}
.status-list .status-item.receive-address .datetime
{
  visibility: hidden;
}
.status-list .status-item.receive-address .step
{
  padding-left: 1px;
}
.status-list .status-item.receive-address .step .icon-receive
{
  width: 0.586667rem;
}
.status-list .status-item .datetime
{
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
  line-height: 100%;
  font-size: 10px;
}
.status-list .status-item .datetime .time
{
  display: block;
  text-align: right;
  font-weight: 600;
}
.status-list .status-item .datetime .date
{
  display: block;
  margin-top: 0.106667rem;
  text-align: right;
}
.status-list .status-item .step
{
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
  box-sizing: border-box;
  width: 1.013333rem;
  padding-left: 0.2rem;
}
.status-list .status-item .step .point
{
  width: 0.266667rem;
  height: 0.266667rem;
  border-radius: 50%;
  background-color: #eef2f5;
}
.status-list .status-item .step .point.now
{
  background-color: #27b8f3;
}
.order-info
{
  padding-top: 0.4rem;
  padding-bottom: 0.6rem;
  background-color: #fff;
}
.order-info .title
{
  line-height: 100%;
  padding-left: 0.426667rem;
  color: #333;
  font-size: 16px;
}
.order-info .info-split
{
  height: 1px;
  margin-top: 0.426667rem;
  margin-bottom: 0.426667rem;
  margin-left: 0.306667rem;
  background-color: #eef2f5;
}
.order-info .express
{
  margin-top: 0.306667rem;
  padding-left: 0.426667rem;
  color: #333;
  font-size: 14px;
}
.order-info .express .icon-express
{
  display: inline-block;
  width: 0.746667rem;
  height: 0.746667rem;
  margin-right: 0.266667rem;
  vertical-align: middle;
}
.order-info .row
{
  padding: 0 0.426667rem;
  font-size: 14px;
}
.order-info .row:not(:first-child)
{
  margin-top: 0.4rem;
}
.order-info .row.price .left
{
  font-size: 14px;
}
.order-info .row.price .right
{
  color: #f93e24;
  font-size: 14px;
}
.order-info .row .left
{
  width: 2rem;
  color: #333639;
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
}
.order-info .row .right
{
  color: #666;
  text-align: right;
  flex-grow: 1;
  -webkit-flex-grow: 1;
}
.operation-btns
{
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
  text-align: right;
  padding: 0 0.426667rem;
}
.operation-btns .btn
{
  display: block;
  width: 2.0rem;
  height: 0.773333rem;
  line-height: 0.8rem;
  border: 1px solid #f56165;
  border-radius: 3px;
  color: #f56165;
  font-size: 13px;
  text-align: center;
}
.operation-btns .btn:not(:first-child)
{
  margin-left: 0.266667rem;
}
.operation-btns .btn.oppo
{
  background-color: #f56165;
  color: #fff;
}
</style>