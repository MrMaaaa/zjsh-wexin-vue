<template>
<div class="wrapper">
  <header class="order-header flex-row">
    <a class="header-title" :class="{ active: tabIndex == '0' }" @click="switchTab(0)">当前订单</a>
    <a class="header-title" :class="{ active: tabIndex == '1' }" @click="switchTab(1)">历史订单</a>
    <i class="header-index trans" :class="{ toggle: tabIndex == '1' }" ref="tabIndex">
      <span class="index-line"></span>
    </i>
  </header>

  <div class="order-content" ref="sliderContainer">
    <div class="now-list trans" ref="nowList" :class="{ toggle: tabIndex == '1' }">
      <div class="list-placeholder"></div>

      <div class="order-list-able" v-show="orderNowList.length > 0">
        <ul class="order-list">
          <order-item :order-item="item" :key="item.OrderId" @order-cancel-dialog="orderCancelDialog" @order-delete-dialog="orderDeleteDialog" @order-confirm-dialog="orderConfirmDialog" @order-evaluate-dialog="orderEvaluateDialog" @order-add-pay="orderAddPay" @order-pay="orderPay" v-for="item in orderNowList"></order-item>
        </ul>
        <infinite-loading :on-infinite="getNowOrderList"  ref="infiniteLoading1">
          <span class="no-result" slot="no-more">没有更多订单了</span>
        </infinite-loading>
      </div>

      <div class="order-list-empty" v-show="orderNowList.length === 0">
        <img class="empty-icon" src="../../assets/images/order_empty.png">
        <span class="empty-title">您还没有相关订单</span>
      </div>
    </div>

    <div class="history-list trans" ref="historyList" :class="{ toggle: tabIndex == '1' }">
      <div class="order-list-able" v-show="orderHistoryList.length > 0">
        <ul class="order-list">
          <order-item :order-item="item" :key="item.OrderId" @order-cancel-dialog="orderCancelDialog" @order-delete-dialog="orderDeleteDialog" @order-confirm-dialog="orderConfirmDialog"@order-evaluate-dialog="orderEvaluateDialog" @order-add-pay="orderAddPay" @order-pay="orderPay" v-for="item in orderHistoryList"></order-item>
        </ul>
        <infinite-loading :on-infinite="getHistoryOrderList"  ref="infiniteLoading2">
          <span class="no-result" slot="no-more">没有更多订单了</span>
        </infinite-loading>
      </div>

      <div class="order-list-empty" v-show="orderHistoryList.length === 0">
        <img class="empty-icon" src="../../assets/images/order_empty.png">
        <span class="empty-title">您还没有相关订单</span>
      </div>
    </div>
  </div>

  <m-dialog :dialog-config="DialogConfig" @dialog-cancel="dialogClose" @dialog-confirm="orderProcess"></m-dialog>

  <order-evaluate :show-evaluate="isEvaluate" :order-code="orderCodeForEvaluate" :service-type-id="serviceTypeIdForEvaluate" @evaluate-finish="evaluateFinish"></order-evaluate>

  <order-confirm :show-confirm="isConfirm" :order-id="orderIdProcess" :order-title="orderTitleForConfirm" @confirm-finish="confirmFinish"></order-confirm>

  <m-loading :bg-style="loadingBgStyle" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import OrderItem from '../Plugs/order-item';
import OrderEvaluate from '../Plugs/m-dialog-evaluate';
import OrderConfirm from '../Plugs/m-dialog-confirm';
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'order_list',
  data() {
    return {
      tabIndex: '0',
      orderNowList: [],
      orderHistoryList: [],
      couponMax: null,
      orderNowPageIndex: 1,
      orderHistoryPageIndex: 1,
      DialogConfig: { //对话框配置信息
        IsDialog: '0', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
        DialogTitle: '取消订单', // 对话框标题
        DialogContent: '确定取消订单吗？', // 对话框内容
        DialogBtns: ['取消', '确定'], // 对话框按钮文本
      },
      dialogType: '0', // 对话框类型 0:取消订单 1:删除订单 2:确认订单
      orderIdProcess: '', // 要处理的订单id
      orderCodeForEvaluate: '', // 要评价的订单code
      serviceTypeIdForEvaluate: '', // 要评价的订单service id
      orderTitleForConfirm: '', // 要评价的订单title
      isEvaluate: '0',
      isConfirm: '0',
      isLoading: false,
      loadingBgStyle: '1',
      // 弹出支付页面时禁止滚动，待实现
      noScroll: function(event) {
        event.preventDefault();
        return false;
      }
    }
  },
  mounted() {
    this.isLoading = true;
    var responseTime = 15; // 修改translate距离的时间差
    var lastTime = new Date().getTime(); // 上一次修改的毫秒数
    var isAcross = false; // 是否横向滑动
    var isCheck = false; // 是否判断过是否为横向滑动
    this.$refs.sliderContainer.addEventListener('touchstart', event => {
      this.touchStartX = event.targetTouches[0].pageX;
      this.touchStartY = event.targetTouches[0].pageY;
      this.$refs.tabIndex.classList.remove('trans');
      this.$refs.nowList.classList.remove('trans');
      this.$refs.historyList.classList.remove('trans');
    });
    this.$refs.sliderContainer.addEventListener('touchmove', event => {
      if(!isCheck && (Math.abs(event.targetTouches[0].pageY - this.touchStartY) > 10 || Math.abs(event.targetTouches[0].pageX - this.touchStartX) > 10)) {
        isCheck = true;
        if(this.isTouchAcross(Math.abs(event.targetTouches[0].pageY - this.touchStartY), Math.abs(event.targetTouches[0].pageX - this.touchStartX))) {
          isAcross = true;
        }
      }

      if (isAcross) {
        event.preventDefault();
        var nowTime = new Date().getTime(); // 当前毫秒
        if (nowTime - lastTime > responseTime) {
          lastTime = nowTime;
          if (this.tabIndex == '0' && event.targetTouches[0].pageX - this.touchStartX < 0) {
            // 向左滑动
            var transDis = Math.abs(event.targetTouches[0].pageX - this.touchStartX); // 计算滑动距离
            if (transDis > screen.availWidth) {
              transDis = screen.availWidth;
            }
            this.$refs.tabIndex.style.transform = 'translate3d(' + transDis / 2 + 'px, 0px, 0px)';
            this.$refs.nowList.style.transform = 'translate3d(-' + transDis + 'px, 0px, 0px)';
            this.$refs.historyList.style.transform = 'translate3d(-' + transDis + 'px, 0px, 0px)';
          } else if (this.tabIndex == '1' && event.targetTouches[0].pageX - this.touchStartX > 0) {
            // 向右滑动
            event.preventDefault();
            var transDis = Math.abs(event.targetTouches[0].pageX - this.touchStartX);
            if (transDis > screen.availWidth) {
              transDis = screen.availWidth;
            }
            this.$refs.tabIndex.style.transform = 'translate3d(' + (screen.availWidth - transDis) / 2 + 'px, 0px, 0px)';
            this.$refs.nowList.style.transform = 'translate3d(-' + (screen.availWidth - transDis) + 'px, 0px, 0px)';
            this.$refs.historyList.style.transform = 'translate3d(-' + (screen.availWidth - transDis) + 'px, 0px, 0px)';
          }
        }
      }
    });
    this.$refs.sliderContainer.addEventListener('touchend', event => {
      if(isAcross) {
        this.$refs.tabIndex.removeAttribute('style');
        this.$refs.nowList.removeAttribute('style');
        this.$refs.historyList.removeAttribute('style');
        this.$refs.tabIndex.classList.add('trans');
        this.$refs.nowList.classList.add('trans');
        this.$refs.historyList.classList.add('trans');
        if (this.tabIndex == '0' && event.changedTouches[0].clientX < this.touchStartX) {
          this.tabIndex = '1';
        } else if (this.tabIndex == '1' && event.changedTouches[0].clientX > this.touchStartX) {
          this.tabIndex = '0';
        }
      }
      // 每一次touch结束后初始化
      isAcross = false;
      isCheck = false;
    });
  },
  activated() {
    if (this.Token === '') {
      this.orderNowList.splice(0);
      this.orderHistoryList.splice(0);
      this.openLogin();
    } else {
      if (this.orderNowList.length > 0) {
        this.orderNowPageIndex = 1;
        this.getNowOrderList(); // 会自动获取订单列表，无需二次调用
      }
      if (this.orderHistoryList.length > 0) {
        this.orderHistoryPageIndex = 1;
        this.getHistoryOrderList(); // 会自动获取订单列表，无需二次调用
      }
      if (this.orderNowList.length == 0 && this.tabIndex == '0') {
        this.$refs.infiniteLoading1.$emit('$InfiniteLoading:loaded');
      }
      if (this.orderHistoryList.length == 0 && this.tabIndex == '1') {
        this.$refs.infiniteLoading2.$emit('$InfiniteLoading:loaded');
      }
    }
  },
  methods: {
    switchTab(index) {
      this.tabIndex = index + '';
    },
    isTouchAcross(x, y) {
      x = Math.abs(x);
      y = Math.abs(y);
      var angle = Math.atan2(y, x) * 180 / Math.PI;
      var touchCritical = 30;
      if(angle <= touchCritical) {
        return true;
      } else {
        return false;
      }
    },
    async getNowOrderList() {
      await axios.post(API.GetOrderListEx, qs.stringify({
        Token: this.Token,
        PageIndex: this.orderNowPageIndex,
        PageSize: '10',
        Type: '6', // 6 当前订单 7 历史订单
      })).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          if(this.orderNowPageIndex == 1) {
            this.getOrderListPop();
            this.orderNowList.splice(0);
          }
          this.orderNowPageIndex += 1;
          this.isLoading = false;
          if(res.data.Body.OrderList.length > 0) {
            // 只显示定价类订单
            res.data.Body.OrderList.map(value => {
              // 判断是否显示底部按钮组
              value.OrderBtnInfo.IsShowBtnInfo = this.isShowOperationBtns(value.OrderBtnInfo);
              this.orderNowList.push(value);
            });
            this.$refs.infiniteLoading1.$emit('$InfiniteLoading:loaded');
          } else {
            this.$refs.infiniteLoading1.$emit('$InfiniteLoading:complete');
          }
        } else {
          this.isLoading = false;
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    async getHistoryOrderList() {
      await axios.post(API.GetOrderListEx, qs.stringify({
        Token: this.Token,
        PageIndex: this.orderHistoryPageIndex,
        PageSize: '10',
        Type: '7', // 6 当前订单 7 历史订单
      })).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          if(this.orderHistoryPageIndex == 1) {
            this.orderHistoryList.splice(0);
          }
          this.orderHistoryPageIndex += 1;
          this.isLoading = false;
          if(res.data.Body.OrderList.length > 0) {
            // 只显示定价类订单
            res.data.Body.OrderList.map(value => {
              // 判断是否显示底部按钮组
              value.OrderBtnInfo.IsShowBtnInfo = this.isShowOperationBtns(value.OrderBtnInfo);
              this.orderHistoryList.push(value);
            });
            this.$refs.infiniteLoading2.$emit('$InfiniteLoading:loaded');
          } else {
            this.$refs.infiniteLoading2.$emit('$InfiniteLoading:complete');
          }
        } else {
          this.isLoading = false;
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    getOrderListPop() {
      axios.post(API.GetOrderListPop, qs.stringify({
        Token: this.Token,
      })).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          if(res.data.Body.PopType == '1') {
            // 订单确认
            this.orderConfirmDialog(res.data.Body.OrderId, res.data.Body.PopDescription);
          } else {
            // 订单评价
            this.orderNowList.map(value => {
              if(value.OrderId == res.data.Body.OrderId) {
                this.orderIdProcess = res.data.Body.OrderId;
                this.orderEvaluateDialog(value.OrderCode, value.Service.ServiceId);
              }
            });
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
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
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    orderCancelDialog(orderId) {
      this.$router.push({
        name: 'order_cancel_reason',
        params: {
          orderId: orderId
        }
      });
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
    orderEvaluateDialog(orderCode, serviceTypeId) {
      this.orderCodeForEvaluate = orderCode;
      this.serviceTypeIdForEvaluate = serviceTypeId;
      this.isEvaluate = '1';
    },
    evaluateFinish(status) {
      this.isEvaluate = '0';
      if(status) {
        if (status.ErrorCode == '0') {
          this.alert('评价成功');
          this.orderPageIndex = 1;
          this.orderPageIndex = 1;
          this.updateOrderFromList();
        } else {
          this.alert(status.ErrorMsg);
        }
      }
    },
    orderConfirmDialog(orderId, title) {
      this.isConfirm = '1';
      this.orderIdProcess = orderId;
      this.orderTitleForConfirm = title;
    },
    confirmFinish(status) {
      this.isConfirm = '0';
      if(status) {
        if (status.ErrorCode == '0') {
          this.alert('确认成功');
          this.updateOrderFromList();
        } else {
          this.alert(status.ErrorMsg);
        }
      }
    },
    orderProcess() {
      this.DialogConfig.IsDialog = '0';
      if(this.dialogType == '0') {
        this.orderCancel();
      } else if(this.dialogType == '1') {
        this.orderDelete();
      }
    },
    dialogClose() {
      this.DialogConfig.IsDialog = '0';
    },
    orderCancel() {
      axios.post(API.CancelOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderIdProcess,
      })).then(res => {
        if(res.data.Meta.ErrorCode == '0') {
          this.alert('取消成功');
          this.updateOrderFromList();
        } else {
          this.alert(res.data.Meta.ErrorMsg, 2000);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    orderDelete() {
      axios.post(API.RemoveOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderIdProcess,
      })).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('删除成功');
          this.deleteOrderFromList();
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    orderAddPay(orderInfo) {
      this.$router.push({
        name: 'order_add_pay',
        params: {
          orderId: orderInfo.OrderId
        }
      });
    },
    orderPay(orderInfo) {
      this.$router.push({
        name: 'order_pay',
        params: {
          orderId: orderInfo.OrderId
        }
      });
    },
    updateOrderFromList() {
      // 在点击取消、删除等按钮时更新订单信息
      this.orderNowPageIndex = 1;
      this.orderHistoryPageIndex = 1;
      this.getNowOrderList();
      this.getHistoryOrderList();
      // axios.post(API.GetOrderInfoEx, qs.stringify({
      //   Token: this.Token,
      //   OrderId: this.orderIdProcess,
      // })).then(res => {
      //   if (res.data.Meta.ErrorCode === '0') {
      //     // 定位到需要修改状态的订单
      //     if(this.tabIndex == '0') {
      //       this.orderNowList.map(value => {
      //         if (value.OrderId === res.data.Body.Order.OrderId) {
      //           // 刷新订单信息
      //           for (var i in value) {
      //             value[i] = res.data.Body.Order[i];
      //           }
      //           // 刷新订单按钮
      //           value.OrderBtnInfo.IsShowBtnInfo = this.isShowOperationBtns(value.OrderBtnInfo);
      //         }
      //       });
      //     } else if(this.tabIndex == '1') {
      //       this.orderHistoryList.map(value => {
      //         if (value.OrderId === res.data.Body.Order.OrderId) {
      //           // 刷新订单信息
      //           for (var i in value) {
      //             value[i] = res.data.Body.Order[i];
      //           }
      //           // 刷新订单按钮
      //           value.OrderBtnInfo.IsShowBtnInfo = this.isShowOperationBtns(value.OrderBtnInfo);
      //         }
      //       });
      //     }
      //   } else {
      //     this.alert(res.data.Meta.ErrorMsg);
      //   }
      // }).catch(err => {
      //   this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      // });
    },
    deleteOrderFromList() {
      for(let i = 0; i < this.orderHistoryList.length; i++) {
        if(this.orderHistoryList[i].OrderId === this.orderIdProcess) {
          this.orderHistoryList.splice(i, 1);
          break;
        }
      }
      if(this.orderHistoryList.length <= 1) {
        this.getOrderList();
      }
    },
    isShowOperationBtns(OrderBtnInfo) {
      let o = OrderBtnInfo;
      // o.IsDisplayCancelOrderBtn === '0' 取消按钮不再在订单列表显示
      if (o.IsKdEOrder !== '1') {
        // 普通订单
        if (o.IsDisplayClientConfirmBtn === '0' && o.IsDisplayDeleteOrderBtn === '0' && o.IsDisplayGotoEvaluateBtn === '0' && o.IsDisplayGotoPayBtn === '0') {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    addZero(str, digit = 2) {
      return Number(str) < 10 ? '0' + Number : str;
    },
  },
  computed: {
    ...mapState(['Token', 'IsLogin', 'OpenId', 'ALERT_MSG', 'FourServiceIdFilterList'])
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
  },
  watch: {
    Token(newValue, oldValue) {
      if(newValue != '' && newValue !== oldValue) {
        this.orderNowList.splice(0);
        this.orderHistoryList.splice(0);
        this.getNowOrderList();
        this.getHistoryOrderList();
      }
    },
  },
  components: {
    InfiniteLoading,
    OrderItem,
    OrderEvaluate,
    OrderConfirm,
  },
}
</script>

<style scoped lang="scss">
$text-warn: #f56165;
.wrapper
{
  height: 100%;
  background-color: #eef2f5;
  .order-header
  {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    transform: translateZ(0);
    width: 100%;
    // height: 1.066667rem;
    height: 1.5rem;
    background-color: #fff;
    box-shadow: 0 5px 16px #ebebeb;
    overflow: hidden;
    .header-title
    {
      display: block;
      width: 50%;
      height: 0.933333rem;
      line-height: 0.933333rem;
      font-size: 15px;
      text-align: center;
      &.active
      {
        color: $text-warn;
      }
    }
    .header-index
    {
      position: absolute;
      bottom: 0.146667rem;
      left: 0;
      width: 50%;
      height: 4px;
      &.trans
      {
        transition: all .3s;
      }
      &.toggle
      {
        transform: translateX(100%);
      }
      .index-line
      {
        display: block;
        margin: 0 auto;
        width: 40%;
        height: 100%;
        background-color: $text-warn;
      }
    }
  }
  .order-content
  {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    // min-height: 100%;
    // margin-top: 1.333333rem;
    overflow: hidden;
    .now-list,
    .history-list
    {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      &.toggle
      {
        transform: translateX(-100%);
      }
      &.trans
      {
        transition: all .3s;
      }
      .order-list-able
      {
        box-sizing: border-box;
        padding-bottom: 1.6rem;
      }
    }
    .history-list
    {
      left: 100%;
    }
  }
  .order-list-able
  {
    padding-top: 1.8rem;
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