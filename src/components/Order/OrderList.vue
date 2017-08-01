<template>
<div class="wrapper">
  <div class="order-list-able" v-show="orderList.length > 0">
    <ul class="order-list">
      <order-item :order-item="item" :key="item.OrderId" @order-cancel-dialog="orderCancelDialog" @order-delete-dialog="orderDeleteDialog" @order-confirm-dialog="orderConfirmDialog" @order-pay="orderPay" v-for="item in orderList"></order-item>
    </ul>

    <infinite-loading :on-infinite="getOrderList"  ref="infiniteLoading">
      <span class="no-result" slot="no-more">没有更多订单了</span>
    </infinite-loading>
  </div>

  <div class="order-list-empty" v-show="orderList.length === 0">
    <img class="empty-icon" src="../../assets/images/order_empty.png">
    <span class="empty-title">您还没有相关订单</span>
  </div>

  <m-dialog :dialog-config="DialogConfig" @dialog-confirm="orderProcess" @dialog-cancel="dialogClose"></m-dialog>

  <m-loading :bg-style="loadingBgStyle" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import OrderItem from '../Plugs/order-item';
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'order_list',
  data() {
    return {
      orderList: [],
      couponList: [],
      orderPageIndex: 1,
      DialogConfig: { //对话框配置信息
        IsDialog: '0', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
        DialogTitle: '取消订单', // 对话框标题
        DialogContent: '确定取消订单吗？', // 对话框内容
        DialogBtns: ['取消', '确定'], // 对话框按钮文本
      },
      dialogType: '0', // 对话框类型 0:取消订单 1:删除订单
      orderIdProcess: '', // 要处理的订单id
      isLoading: true,
      loadingBgStyle: '1',
    }
  },
  mounted() {
    this.getCouponList();
    // this.getOrderList();
  },
  methods: {
    async getOrderList() {
      await axios.post(API.GetOrderListEx, qs.stringify({
        Token: this.Token,
        PageIndex: this.orderPageIndex,
        PageSize: '20',
        Type: '0',
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        if (res.data.Meta.ErrorCode === '0') {
          this.orderPageIndex++;
          if(res.data.Body.OrderList.length > 0) {
            // 只显示定价类订单
            res.data.Body.OrderList.map(value => {
              // 只显示首页服务中的订单
              if(this.FourServiceIdFilterList.includes(' ' + value.Service.ServiceId + ' ')) {
                // 判断是否显示底部按钮组
                value.OrderBtnInfo.IsShowBtnInfo = this.isShowOperationBtns(value.OrderBtnInfo);

                // 设置支付倒计时
                // if(value.ResidualTime) {
                //   value.payCountdownInterval = setInterval(() => {
                //     value.ResidualTime--;
                //     if(value.ResidualTime == 0) {
                //       clearInterval(value.payCountdownInterval);
                //     }
                //   }, 1000);
                // }
                // 只有当存在符合条件的订单时关闭loading
                this.orderList.push(value);
                if (this.orderList.length > 1) {
                  this.isLoading = false;
                }
              }
            });
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          } else {
            this.isLoading = false;
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
        } else {
          this.isLoading = false;
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch((error) => {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    getCouponList() {
      axios.post(API.GetCoupons, qs.stringify({
        Token: this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          // 红包分类
          let date = new Date();
          res.data.Body.CouponList.forEach((value, index) => {
            // 未使用红包
            if (date.getTime() < Number(value.EndTime + '000') && value.IsUsed === '0') {
              this.couponList.push(value);
            }
          });
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    getCouponMaxAmount(serviceId) {
      let maxDisCoupon = null;
      let maxDis = 0;
      this.couponList.map(value => {
        let isIdEqual = false;
        for (let i = 0; i < value.ServiceTypes.length; i++) {
          if (value.ServiceTypes[i].ServiceId === serviceId) {
            isIdEqual = true;
            break;
          }
        }
        if(isIdEqual) {
          maxDisCoupon = value;
          maxDis = value.CouponDetails[0].DiscountAmount;
        }
      });

      return maxDisCoupon;
    },
    orderCancelDialog(orderId) {
      this.orderIdProcess = orderId;
      this.dialogType = '0';
      this.DialogConfig = {
        IsDialog: '1',
        DialogTitle: '取消订单',
        DialogContent: '确定取消订单吗？',
        DialogBtns: ['取消', '确定'],
      };
    },
    orderDeleteDialog(orderId) {
      this.orderIdProcess = orderId;
      this.dialogType = '1';
      this.DialogConfig = {
        IsDialog: '1',
        DialogTitle: '删除订单',
        DialogContent: '确定删除订单吗？',
        DialogBtns: ['取消', '确定'],
      };
    },
    orderConfirmDialog(orderId) {
      this.orderIdProcess = orderId;
      this.dialogType = '2';
      this.DialogConfig = {
        IsDialog: '1',
        DialogTitle: '确认订单',
        DialogContent: '确定确认订单吗？',
        DialogBtns: ['取消', '确定'],
      };
    },
    orderProcess() {
      this.DialogConfig.IsDialog = '0';
      if(this.dialogType === '0') {
        this.orderCancel();
      } else if(this.dialogType === '1') {
        this.orderDelete();
      } else if(this.dialogType === '2') {
        this.orderConfirm();
      }
    },
    dialogClose() {
      this.DialogConfig.IsDialog = '0';
    },
    orderCancel() {
      axios.post(API.CancelOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderIdProcess,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('取消成功');
          this.updateOrderFromList();
        } else {
          this.alert(res.data.Meta.ErrorMsg, 2000);
        }
      }).catch(error => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    orderDelete() {
      axios.post(API.RemoveOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderIdProcess,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('删除成功');
          this.deleteOrderFromList();
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    orderConfirm() {
      axios.post(API.CompleteOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderIdProcess,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('确认成功');
          this.deleteOrderFromList();
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    orderPay(orderInfo) {
      this.isLoading = true;
      this.loadingBgStyle = '2';
      this.txtLoading = '';
      this.orderIdProcess = orderInfo.OrderId;
      let couponId = '';
      let couponMax = this.getCouponMaxAmount(orderInfo.Service.ServiceId);
      let p = orderInfo.Total * orderInfo.Price;
      if(couponMax) {
        p -= couponMax.CouponDetails[0].DiscountAmount;
        couponId = couponMax.Id;
      }
      axios.post(API.GetWxpaySign, qs.stringify({
        Token: this.Token,
        OrderId: orderInfo.OrderId,
        PayFrom: '0', // 0: 微信公众号 1: app
        OpenId: this.OpenId,
        WxPay: p,
        BalancePay: '0',
        CouponId: couponId || '',
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
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
      }).catch(error => {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
      // this.$router.push({
      //   name: 'order_pay'
      // })
    },
    updateOrderFromList() {
      // 在点击取消、删除等按钮时更新订单信息
      axios.post(API.GetOrderInfoEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderIdProcess,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          // 定位到需要修改状态的订单
          this.orderList.map(value => {
            if(value.OrderId === res.data.Body.Order.OrderId) {
              // 目前需要修改订单列表的状态按钮显示、支付状态
              value.OrderBtnInfo = res.data.Body.Order.OrderBtnInfo;
              value.OrderBtnInfo.IsShowBtnInfo = this.isShowOperationBtns(value.OrderBtnInfo);
              value.PayStatus = res.data.Body.Order.PayStatus;
            }
          });
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    deleteOrderFromList() {
      for(let i = 0; i < this.orderList.length; i++) {
        if(this.orderList[i].OrderId === this.orderIdProcess) {
          this.orderList.splice(i, 1);
          break;
        }
      }
      if(this.orderList.length <= 1) {
        this.getOrderList();
      }
    },
    isShowOperationBtns(OrderBtnInfo) {
      let o = OrderBtnInfo;
      if (o.IsDisplayCancelOrderBtn === '0' && o.IsDisplayClientConfirmBtn === '0' && o.IsDisplayDeleteOrderBtn === '0' && o.IsDisplayGotoEvaluateBtn === '0' && o.IsDisplayGotoPayBtn === '0') {
        return false;
      } else {
        return true;
      }
    },
    addZero(str, digit = 2) {
      if(''.padStart) {
        return str.toString().padStart(digit, '0');
      } else {
        return Number(str) < 10 ? '0' + Number : str;
      }
    },
    // routerToPay(item) {
    //   this.$store.commit('SetOrderIdForPay', item.OrderId);
    //   this.$router.push({
    //     name: 'order_pay',
    //   });
    // }
  },
  computed: {
    ...mapState(['Token', 'OpenId', 'ALERT_MSG', 'FourServiceIdFilterList'])
  },
  filters: {
    formatDate(val) {
      val = parseInt(val + '000');
      var date = new Date(val);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      // month = month.toString().padStart(2, '0');
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      // day = day.toString().padStart(2, '0');
      var hour = date.getHours();
      hour = hour < 10 ? '0' + hour : hour;
      // hour = hour < 10 ? '0' + hour : hour;
      var minute = date.getMinutes();
      minute = minute < 10 ? '0' + minute : minute;
      // minute = minute.toString().padStart(2, '0');
      var second = date.getSeconds();
      second = second < 10 ? '0' + second : second;
      // second = second.toString().padStart(2, '0');
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    clearStr(str) {
      return (str == null || str == undefined) ? '' : str;
    },
    payCountdown(time) {
      if( time == 0) {
        return '';
      }
      let minute = Math.floor(time / 60);
      let second = time % 60;
      return minute.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0');
    },
  },
  components: {
    InfiniteLoading,
    OrderItem,
  },
}
</script>

<style scoped lang="scss">
.wrapper
{
  padding-top: 0.4rem;
  background-color: #eef2f5;
  .order-list-able
  {
    box-sizing: border-box;
    padding-bottom: 1.333333rem;
    background-color: #eef2f5;
  }
  .order-list-empty
  {
    margin: 0 auto;
    padding-top: 3.5rem;
    .empty-icon
    {
      display: block;
      width: 2.4rem;
      margin: 0 auto;
    }
    .empty-title
    {
      display: block;
      line-height: 100%;
      margin: 0.266667rem auto 0;
      color: #666;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>