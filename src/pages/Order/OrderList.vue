<template>
<div class="wrapper">
  <header class="order-header flex-row">
    <a class="header-title" :class="{ active: tabIndex == '0' }" @click="switchTab('0')">当前订单</a>
    <a class="header-title" :class="{ active: tabIndex == '1' }" @click="switchTab('1')">历史订单</a>
    <i class="header-index trans" :class="{ toggle: tabIndex == '1' }" ref="tabIndex">
      <span class="index-line"></span>
    </i>
  </header>

  <div class="order-content" ref="sliderContainer">
    <div class="now-list trans" ref="nowList" :class="{ toggle: tabIndex == '1' }">
      <div class="list-placeholder"></div>

      <div class="order-list-able">
        <ul class="order-list">
          <order-item :order-item="item" :key="item.OrderId" @order-cancel="orderCancel" @order-delete="orderDelete" @order-confirm="orderConfirm" @order-evaluate="orderEvaluate" @order-add-pay="orderAddPay" @order-pay="orderPay" v-for="item in orderNowList"></order-item>
        </ul>
        <infinite-loading @infinite="getNowOrderList" ref="infiniteLoading1">
          <span class="no-result" slot="no-more">没有更多订单了</span>
          <div class="order-list-empty" slot="no-results">
            <img class="empty-icon" src="../../assets/images/order_empty.png">
            <span class="empty-title">您还没有相关订单</span>
          </div>
        </infinite-loading>
      </div>
    </div>

    <div class="history-list trans" ref="historyList" :class="{ toggle: tabIndex == '1' }">
      <div class="order-list-able">
        <ul class="order-list">
          <order-item :order-item="item" :key="item.OrderId" @order-cancel="orderCancel" @order-delete="orderDelete" @order-confirm="orderConfirm" @order-evaluate="orderEvaluate" @order-add-pay="orderAddPay" @order-pay="orderPay" v-for="item in orderHistoryList"></order-item>
        </ul>
        <infinite-loading @infinite="getHistoryOrderList" ref="infiniteLoading2">
          <span class="no-result" slot="no-more">没有更多订单了</span>
          <div class="order-list-empty" slot="no-results">
            <img class="empty-icon" src="../../assets/images/order_empty.png">
            <span class="empty-title">您还没有相关订单</span>
          </div>
        </infinite-loading>
      </div>
    </div>
  </div>

  <order-evaluate v-if="popOptions.PopType === '2'" :options.sync="popOptions" @complete="updateOrderFromList"></order-evaluate>

  <order-confirm v-if="popOptions.PopType === '1'" :options.sync="popOptions" @complete="updateOrderFromList"></order-confirm>
</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import OrderItem from '../../components/order-item';
const OrderEvaluate = () => import('../../components/m-dialog-evaluate');
const OrderConfirm = () => import('../../components/m-dialog-confirm');
import { mapState } from 'vuex';
import Utils from '../../config/utils.js';

export default {
  name: 'order_list',
  data() {
    return {
      tabIndex: '0',
      orderNowList: [],
      orderHistoryList: [],
      orderNowPageIndex: 1,
      orderHistoryPageIndex: 1,
      isEvaluate: false,
      isConfirm: false,
      isMounted: true,
      popOptions: {
        PopType: '', // 1:确认 2:评价
        OrderId: '',
        OrderCode: '',
        PopTitle: '',
        PopDescription: '',
        ServiceTypeId: ''
      },
      touchStartX: 0,
      touchStartY: 0,
    }
  },
  components: {
    InfiniteLoading,
    OrderItem,
    OrderEvaluate,
    OrderConfirm,
  },
  mounted() {
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
          // 如果是横向滑动，记录当前的touch位置
          this.touchStartX = event.targetTouches[0].pageX;
          this.touchStartY = event.targetTouches[0].pageY;
          isAcross = true;
        }
      }

      if (isAcross) {
        event.preventDefault();
        var nowTime = new Date().getTime(); // 当前毫秒
        if (nowTime - lastTime > responseTime) {
          lastTime = nowTime;
          if (this.tabIndex === '0' && event.targetTouches[0].pageX - this.touchStartX < 0) {
            // 向左滑动
            var transDis = Math.abs(event.targetTouches[0].pageX - this.touchStartX); // 计算滑动距离
            if (transDis > screen.availWidth) {
              transDis = screen.availWidth;
            }
            this.$refs.tabIndex.style.transform = 'translate3d(' + transDis / 2 + 'px, 0px, 0px)';
            this.$refs.nowList.style.transform = 'translate3d(-' + transDis + 'px, 0px, 0px)';
            this.$refs.historyList.style.transform = 'translate3d(-' + transDis + 'px, 0px, 0px)';
          } else if (this.tabIndex === '1' && event.targetTouches[0].pageX - this.touchStartX > 0) {
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
        if (this.tabIndex === '0' && event.changedTouches[0].clientX < this.touchStartX - 50) {
          this.tabIndex = '1';
        } else if (this.tabIndex === '1' && event.changedTouches[0].clientX > this.touchStartX + 50) {
          this.tabIndex = '0';
        }
      }
      // 每一次touch结束后初始化
      isAcross = false;
      isCheck = false;
    });
  },
  activated() {
    if (this.isMounted) {
      this.isMounted = false;
    } else if (!this.isMounted) {
      // 每次都重新获取订单
      if (this.tabIndex === '0') {
        this.orderNowPageIndex = 1;
        this.getNowOrderList();
      } else if (this.tabIndex === '1') {
        this.orderHistoryPageIndex = 1;
        this.getHistoryOrderList();
      }
    }
  },
  methods: {
    switchTab(index) {
      this.tabIndex = index;
    },
    isTouchAcross(x, y) {
      x = Math.abs(x);
      y = Math.abs(y);
      var angle = Math.atan2(y, x) * 180 / Math.PI; // 与y轴的夹角
      var touchCritical = 30;
      if(angle >= touchCritical) {
        return true;
      } else {
        return false;
      }
    },
    getNowOrderList($state) {
      this.$store.dispatch('GetOrderListEx', {
          PageIndex: this.orderNowPageIndex,
          Type: '6', // 6 当前订单 7 历史订单
        })
        .then(res => {
          this.$store.commit('SetSpots', {
            Order: false
          });
          if (this.orderNowPageIndex === 1) {
            this.orderNowList.splice(0);
          }
          this.orderNowPageIndex += 1;
          if (res.OrderList.length > 0) {
            res.OrderList.map(value => {
              // 判断是否显示底部按钮组
              value.OrderBtnInfo.IsShowBtnInfo = this.isShowOperationBtns(value);
              this.orderNowList.push(value);
            });
            // $state.loaded();
            this.$refs.infiniteLoading1.stateChanger.loaded();

            if(this.orderNowPageIndex === 2) {
              // 首次加载弹出对应弹窗
              this.getOrderListPop();
            }
          } else {
            // $state.complete();
            this.$refs.infiniteLoading1.stateChanger.complete();
          }
        })
        .catch(err => {
          this.$refs.infiniteLoading1.stateChanger.complete();
          if(err.ErrorCode !== '2004') {
            this.$alert(err.message || err.ErrorMsg);
          }
        });
    },
    getHistoryOrderList($state) {
      this.$store.dispatch('GetOrderListEx', {
          PageIndex: this.orderHistoryPageIndex,
          Type: '7', // 6 当前订单 7 历史订单
        })
        .then(res => {
          if (this.orderHistoryPageIndex == 1) {
            this.orderHistoryList.splice(0);
          }
          this.orderHistoryPageIndex += 1;
          if (res.OrderList.length > 0) {
            res.OrderList.map(value => {
              // 判断是否显示底部按钮组
              value.OrderBtnInfo.IsShowBtnInfo = this.isShowOperationBtns(value);
              this.orderHistoryList.push(value);
            });
            // $state.loaded();
            this.$refs.infiniteLoading2.stateChanger.loaded();
          } else {
            // $state.complete();
            this.$refs.infiniteLoading2.stateChanger.complete();
          }
        })
        .catch(err => {
          this.$refs.infiniteLoading2.stateChanger.complete();
          if(err.ErrorCode !== '2004') {
            this.$alert(err.message || err.ErrorMsg);
          }
        });
    },
    formatTitleDate(date) {
      let now = new Date(Number(date));
      let hour = now.getHours();
      let minute = now.getMinutes();
      let tomorrow = new Date(Number(date) + 24 * 60 * 60 * 1000);
      let yesterday = new Date(Number(date) - 24 * 60 * 60 * 1000);

      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;

      if (now.getMonth() + 1 === new Date().getMonth() + 1 && now.getDate() === new Date().getDate()) {
        return '今天 ' + hour + ':' + minute;
      } else if (yesterday.getMonth() + 1 === new Date().getMonth() + 1 && yesterday.getDate() === new Date().getDate()) {
        return '明天 ' + hour + ':' + minute;
      } else if (tomorrow.getMonth() + 1 === new Date().getMonth() + 1 && tomorrow.getDate() === new Date().getDate()) {
        return '昨天 ' + hour + ':' + minute;
      } else {
        return (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + hour + ':' + minute;
      }
    },
    getOrderListPop() {
      this.$store.dispatch('GetOrderListPop')
        .then(res => {
          if (res.OrderId) {
            this.orderNowList.forEach(value => {
              // 修改弹窗的标题
              if (value.OrderId === res.OrderId) {
                res.PopTitle = this.formatTitleDate(value.Service.ServiceStartTime + '000') + '的' + value.Service.ServiceName + '服务';
              }
            });
            this.popOptions = res;
          }
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    orderCancel(orderId) {
      this.$router.push({
        name: 'order_cancel_reason',
        params: {
          orderId: orderId
        }
      });
    },
    orderDelete(orderId) {
      this.$dialog({
        title: '删除订单',
        msg: '确定删除订单吗？',
        btns: [{
          text: '取消'
        }, {
          text: '确定',
          callback: () => {
            this.$loading.open(2);
            this.$store.dispatch('RemoveOrderEx', {
                OrderId: orderId
              })
              .then(res => {
                this.$loading.close();
                this.$alert('删除成功');
                this.deleteOrderFromList(orderId);
              })
              .catch(err => {
                this.$loading.close();
                this.$alert(err.message || err.ErrorMsg);
              });
          }
        }]
      });
    },
    orderEvaluate(orderCode, serviceTypeId, title) {
      this.popOptions = {
        PopType: '2', // 1:确认 2:评价
        OrderId: '',
        OrderCode: orderCode,
        PopTitle: title,
        PopDescription: '',
        ServiceTypeId: serviceTypeId
      };
    },
    orderConfirm(orderId, title) {
      this.popOptions = {
        PopType: '1', // 1:确认 2:评价
        OrderId: orderId,
        OrderCode: '',
        PopTitle: title,
        PopDescription: '',
        ServiceTypeId: ''
      };
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
      //   OrderId: ,
      // })).then(res => {
      //   if (res.data.Meta.ErrorCode === '0') {
      //     // 定位到需要修改状态的订单
      //     if(this.tabIndex === '0') {
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
      //     } else if(this.tabIndex === '1') {
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
    deleteOrderFromList(orderId) {
      for(let i = 0; i < this.orderHistoryList.length; i++) {
        if(this.orderHistoryList[i].OrderId === orderId) {
          this.orderHistoryList.splice(i, 1);
          break;
        }
      }
      if(this.orderHistoryList.length <= 1) {
        this.getHistoryOrderList();
      }
    },
    isShowOperationBtns(order) {
      let o = order.OrderBtnInfo;
      // o.IsDisplayCancelOrderBtn === '0' 取消按钮不再在订单列表显示
      if (order.IsKdEOrder !== '1') {
        // 普通订单
        if ((!order.RefundStatus || order.RefundStatus === '') && o.IsDisplayClientConfirmBtn === '0' && o.IsDisplayDeleteOrderBtn === '0' && o.IsDisplayGotoEvaluateBtn === '0' && o.IsDisplayGotoPayBtn === '0') {
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
    clearStr(str = '') {
      return str;
    },
  },
  watch: {
    tabIndex(newValue) {
      if (newValue === '0') {
        this.orderNowPageIndex = 1;
        this.getNowOrderList();
      } else if (newValue === '1') {
        this.orderHistoryPageIndex = 1;
        this.getHistoryOrderList();
      }
    }
  }
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