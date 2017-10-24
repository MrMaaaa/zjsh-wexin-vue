<template>
<div>
  <header class="order-header flex-row">
    <a class="header-title" :class="{ active: tabIndex == '0' }" @click="switchTab(0)">订单状态</a>
    <a class="header-title" :class="{ active: tabIndex == '1' }" @click="switchTab(1)">订单信息</a>
    <i class="header-index trans" :class="{ toggle: tabIndex == '1' }" ref="tabIndex">
      <span class="index-line"></span>
    </i>

    <img class="header-more" @click="isMoreOperate='1'" src="../../assets/images/more.png">
  </header>

  <div class="order-content" ref="sliderContainer">
    <div class="order-status trans" :class="{ toggle: tabIndex == '1' }" ref="orderStatus">
      <div v-if="orderStatus && orderStatus.DateStatus.length > 0">
        <section class="status-group"  v-for="item in orderStatus.DateStatus">
          <header class="group-title flex-row">
            <div class="title-time">{{ item.Date }}</div>
            <img class="icon-order-step-down title-icon" src="../../assets/images/order-detail-down.png">
          </header>

          <section class="group-step" v-for="step in item.Status">
            <div class="header flex-row">
              <div class="step-time">{{ step.Time }}</div>
              <i class="step-icon"></i>
              <div class="desc-status">{{ step.Status }}</div>
            </div>
            <div class="content flex-row">
              <div class="step-time"></div>
              <i class="step-icon"></i>
              <div class="desc-content" v-if="step.Description1">{{ step.Description1 }}<a class="tel" :href="'tel:' + step.OrderProviderInfo.PhoneNumber">{{ step.OrderProviderInfo.PhoneNumber }}</a> {{ step.Description2 }}</div>
              <div class="desc-content" v-else>{{ step.Description }}</div>
            </div>
          </section>

          <section class="next-step" v-if="orderStatus.NextStatus.Status">
            <div class="header flex-row">
              <div class="step-time" :class="{ hide: !countdownTime || countdownTime <= 0 }">{{ countdownTime | formatCountDown }}</div>
              <i class="step-icon flex-row" :class="{ countdown: countdownTime && countdownTime > 0 }"><i class="step-inner-icon"></i></i>
              <div class="desc-status">{{ orderStatus.NextStatus.Status }}</div>
            </div>

            <div class="content flex-row">
              <div class="step-time"></div>
              <div class="step-icon"></div>
              <div class="desc-content" v-if="orderStatus.NextStatus.Description1">{{ orderStatus.NextStatus.Description1 }}<a class="tel" :href="'tel:' + orderStatus.NextStatus.OrderProviderInfo.PhoneNumber">{{ orderStatus.NextStatus.OrderProviderInfo.PhoneNumber }}</a> {{ orderStatus.NextStatus.Description2 }}</div>
              <div class="desc-content" v-else>{{ orderStatus.NextStatus.Description }}</div>
            </div>
          </section>
          <i class="group-line"></i>
        </section>
      </div>
    </div>

    <div class="order-info trans" :class="{ toggle: tabIndex == '1' }" ref="orderInfo">
      <div v-if="orderDetail">
        <div class="info-row flex-row">
          <div class="row-left">服务类型</div>
          <div class="row-right txt-over-hide">{{ orderDetail.Service.ServiceName }}</div>
        </div>
        <div class="info-row flex-row">
          <div class="row-left">服务时间</div>
          <div class="row-right txt-over-hide">{{ orderDetail.Service.ServiceStartTime | formatDate }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.DepositInfo">
          <div class="row-left">订金</div>
          <div class="row-right txt-over-hide">{{ orderDetail.DepositInfo.DepositAmount | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.Price">
          <div class="row-left">服务价格</div>
          <div class="row-right txt-over-hide">{{ orderDetail.Price | formatAmount }} × {{ orderDetail.Total }}{{ orderDetail.UnitName }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.ClaimsInfo">
          <div class="row-left">一元保险</div>
          <div class="row-right txt-over-hide">{{ orderDetail.ClaimsInfo.ClaimsAmount | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.TotalPrice">
          <div class="row-left">订单总价</div>
          <div class="row-right txt-over-hide">{{ orderDetail.TotalPrice | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.DiscountAmount && orderDetail.DiscountAmount > 0">
          <div class="row-left">{{ orderDetail.DiscountInfo }}</div>
          <div class="row-right txt-over-hide">-{{ orderDetail.DiscountAmount | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-for="dis in orderDetail.ActivityNgs.ServiceTypeRules" v-if="orderDetail.ActivityNgs && orderDetail.ActivityNgs.ServiceTypeRules.length > 0">
          <div class="row-left">{{ dis.Details[0].Title }}</div>
          <div class="row-right txt-over-hide">-{{ dis.Details[0].Rules[0].Minus | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.IsPayOff === '1'">
          <div class="row-left">实付</div>
          <div class="row-right txt-over-hide">{{ orderDetail.PayAmount | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-else>
          <div class="row-left">待支付</div>
          <div class="row-right txt-over-hide">{{ orderDetail.PayAmount | formatAmount }}</div>
        </div>
        <div class="info-line"></div>
        <div class="info-row flex-row">
          <div class="row-left">备注</div>
          <div class="row-right txt-over-hide">{{ orderDetail.Service.Content && orderDetail.Service.Content.join('；') }}</div>
        </div>
        <div class="info-line" v-if="orderDetail.Refunds.length > 0"></div>
        <div class="info-row flex-row" v-if="orderDetail.Refunds.length > 0">
          <div class="row-left">退款记录</div>
          <div class="row-right txt-over-hide"></div>
        </div>
        <div class="info-row flex-row" v-for="item in orderDetail.Refunds">
          <div>{{ item.RefundTime | formatDate }}</div>
          <div class="row-center">{{ item.RefundStatus }}</div>
          <div>{{ item.RefundAmount | formatAmount }}</div>
        </div>
        <div class="info-line"></div>
        <div class="info-row contact flex-row">
          <div class="row-left">联系人</div>
          <div class="row-right txt-over-hide">{{ orderDetail.Service.AddressInfo.Contact }}</div>
        </div>
        <div class="info-row contact flex-row">
          <div class="row-left">联系电话</div>
          <div class="row-right txt-over-hide">{{ orderDetail.Service.AddressInfo.PhoneNumber }}</div>
        </div>
        <div class="info-row contact flex-row">
          <div class="row-left">服务地址</div>
          <div class="row-right txt-over-hide">{{ orderDetail.Service.AddressInfo.Address1 }} {{ orderDetail.Service.AddressInfo.Address2 }}</div>
        </div>
        <div class="info-line"></div>
        <div class="info-row contact flex-row">
          <div class="row-left">订单编号</div>
          <div class="row-right">{{ orderDetail.OrderCode }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="order-operation flex-row" v-if="orderDetail && showBtnPanel">
    <a class="btn oppo" @click="orderConfirmDialog" v-if="orderDetail.IsKdEOrder !== '1' && orderDetail.OrderBtnInfo.IsDisplayClientConfirmBtn === '1'">确认订单</a>
    <a class="btn" @click="orderStatusAlter(3)" v-if="orderDetail.IsKdEOrder !== '1' && orderDetail.OrderBtnInfo.IsDisplayDeleteOrderBtn === '1'">删除订单</a>
    <a class="btn" @click="isEvaluate = '1'" v-if="orderDetail.IsKdEOrder !== '1' && orderDetail.OrderBtnInfo.IsDisplayGotoEvaluateBtn === '1'">评价订单</a>
    <a class="btn oppo" v-if="orderDetail.IsKdEOrder !== '1' && orderDetail.OrderBtnInfo.IsDisplayAddServiceBtn === '1'" @click="orderAddPay">￥增加服务</a>
    <a class="btn oppo" @click="orderPay" v-if="orderDetail.IsKdEOrder !== '1' && orderDetail.OrderBtnInfo.IsDisplayGotoPayBtn === '1'">立即支付</a>
  </div>

  <div class="order-more" v-show="isMoreOperate=='1'">
    <div class="more-wrapper" @click="isMoreOperate='0'"></div>

    <div class="more-content">
      <a class="content-btn" onclick='easemobim.bind({configId: "e88edf52-a792-46ce-9af4-a737d4e9bd43"})'>联系客服</a>
      <a class="content-btn" v-if="orderDetail && orderDetail.IsKdEOrder !== '1' && orderDetail.OrderBtnInfo.IsDisplayCancelOrderBtn === '1'" @click="orderCancel">取消订单</a>
      <a class="content-btn" v-if="orderDetail && orderDetail.IsKdEOrder !== '1' && orderDetail.OrderBtnInfo.IsDisplayComplaintsBtn === '1'" @click="orderComplaint">投诉</a>
    </div>
  </div>

  <m-dialog :dialog-config="DialogConfig" @dialog-cancel="dialogClose" @dialog-confirm="orderProcess"></m-dialog>

  <order-evaluate :show-evaluate="isEvaluate" :order-code="orderCodeForEvaluate" :service-type-id="serviceTypeIdForEvaluate" @evaluate-finish="evaluateFinish"></order-evaluate>

  <order-confirm :show-confirm="isConfirm" :order-id="orderId" :order-title="orderTitleForConfirm" @confirm-finish="confirmFinish"></order-confirm>

  <m-loading :bg-style="loadingBgStyle" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import OrderEvaluate from '../Plugs/m-dialog-evaluate';
import OrderConfirm from '../Plugs/m-dialog-confirm';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'order_detail',
  data() {
    return {
      tabIndex: '0', // 0: 订单状态 1: 订单信息
      orderId: '',
      orderStatus: null,
      orderDetail: null,
      touchStartX: 0,
      touchStartY: 0,
      loadingBgStyle: '1',
      isLoading: true,
      dialogType: 0,
      countdownTime: 0,
      interval: null, // 计时器
      DialogConfig: { // 对话框配置信息
        IsDialog: '0', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
        DialogTitle: '取消订单', // 对话框标题
        DialogContent: '确定取消订单吗？', // 对话框内容
        DialogBtns: ['取消', '确定'], // 对话框按钮文本
      },
      isConfirm: '0',
      orderTitleForConfirm: '',
      isMoreOperate: '0',
      orderCodeForEvaluate: '',
      serviceTypeIdForEvaluate: '',
      isEvaluate: '0',
      touchStartX: 0,
      touchStartY: 0,
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
      this.$refs.orderStatus.classList.remove('trans');
      this.$refs.orderInfo.classList.remove('trans');
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
            this.$refs.orderStatus.style.transform = 'translate3d(-' + transDis + 'px, 0px, 0px)';
            this.$refs.orderInfo.style.transform = 'translate3d(-' + transDis + 'px, 0px, 0px)';
          } else if (this.tabIndex == '1' && event.targetTouches[0].pageX - this.touchStartX > 0) {
            // 向右滑动
            event.preventDefault();
            var transDis = Math.abs(event.targetTouches[0].pageX - this.touchStartX);
            if (transDis > screen.availWidth) {
              transDis = screen.availWidth;
            }
            this.$refs.tabIndex.style.transform = 'translate3d(' + (screen.availWidth - transDis) / 2 + 'px, 0px, 0px)';
            this.$refs.orderStatus.style.transform = 'translate3d(-' + (screen.availWidth - transDis) + 'px, 0px, 0px)';
            this.$refs.orderInfo.style.transform = 'translate3d(-' + (screen.availWidth - transDis) + 'px, 0px, 0px)';
          }
        }
      }
    });
    this.$refs.sliderContainer.addEventListener('touchend', event => {
      if(isAcross) {
        this.$refs.tabIndex.removeAttribute('style');
        this.$refs.orderStatus.removeAttribute('style');
        this.$refs.orderInfo.removeAttribute('style');
        this.$refs.tabIndex.classList.add('trans');
        this.$refs.orderStatus.classList.add('trans');
        this.$refs.orderInfo.classList.add('trans');
        if (this.tabIndex == '0' && event.changedTouches[0].clientX < this.touchStartX - 50) {
          this.tabIndex = '1';
        } else if (this.tabIndex == '1' && event.changedTouches[0].clientX > this.touchStartX + 50) {
          this.tabIndex = '0';
        }
      }
      // 每一次touch结束后初始化
      isAcross = false;
      isCheck = false;
    });
  },
  activated() {
    this.orderId = this.$route.params.orderId || this.orderId;
    this.tabIndex = '0';
    this.getOrderStatus();
    clearInterval(this.interval);
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
      if(angle >= touchCritical) {
        return true;
      } else {
        return false;
      }
    },
    getOrderStatus(callback) {
      this.isLoading = true;
      axios.post(API.TrackOrderStatus, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      })).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          this.orderStatus = res.data.Body;

          var reg = /1[3|4|5|7|8][0-9]\d{8}/ig;
          this.orderStatus.DateStatus.forEach(value => {
            value.Status.forEach(val => {
              if (reg.test(val.Description)) {
                var phone = val.Description.match(reg);
                val.Description1 = val.Description.split(phone)[0];
                val.Description2 = val.Description.split(phone)[1];
              }
            });
          });
          if(this.orderStatus.NextStatus.Description && reg.test(this.orderStatus.NextStatus.Description)) {
            var phone = this.orderStatus.NextStatus.Description.match(reg);
            this.orderStatus.NextStatus.Description1 = this.orderStatus.NextStatus.Description.split(phone)[0];
            this.orderStatus.NextStatus.Description2 = this.orderStatus.NextStatus.Description.split(phone)[1];
          }

          this.countdownTime = Math.ceil(this.orderStatus.NextStatus.CountDown || 0);
          var originTime = Number(new Date().getTime() + this.countdownTime * 1000);
          if(this.countdownTime > 0) {
            clearInterval(this.interval);
            this.interval = setInterval(() => {
              if(this.countdownTime <= 0) {
                this.getOrderStatus();
                clearInterval(this.interval);
              } else {
                this.countdownTime = Math.round((originTime - new Date().getTime()) / 1000);
              }
            }, 1000);
          }
          callback && callback();
          this.getOrderDetail();
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    getOrderDetail() {
      axios.post(API.GetOrderInfoEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      })).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.orderDetail = res.data.Body.Order;
          this.orderCodeForEvaluate = this.orderDetail.OrderCode;
          this.serviceTypeIdForEvaluate = this.orderDetail.Service.ServiceId;

          // 环信，发送订单数据
          let that = this;
          window.easemobim = window.easemobim || {};
          window.easemobim.config = {
            configId: 'e88edf52-a792-46ce-9af4-a737d4e9bd43',
            hideKeyboard: true,
            visitor: {
              trueName: '',
              qq: '',
              phone: this.$store.state.UserInfo.PhoneNumber,
              companyName: '',
              userNickname: this.$store.state.UserInfo.NickName,
              description: '',
              email: ''
            },
            onready: function() {
              window.easemobim.sendExt({
                ext: {
                  "imageName": "",
                  //custom代表自定义消息，无需修改
                  "type": "custom",
                  "msgtype": {
                    "order": {
                      "img_url": "",
                      "title": "服务：" + that.orderDetail.Service.ServiceName,
                      "desc": "服务：" + that.orderDetail.Service.ServiceName,
                      "order_title": "订单号：" + that.orderDetail.OrderCode,
                      "price": "总价：￥" + that.orderDetail.TotalPrice,
                      "item_url": ""
                    }
                  }
                }
              });
            },
          };
        } else {
          this.alert(res.data.Meta.ErrorMsg);
          // 环信，发送订单数据
          let that = this;
          window.easemobim = window.easemobim || {};
          window.easemobim.config = {
            configId: 'e88edf52-a792-46ce-9af4-a737d4e9bd43',
            hideKeyboard: true,
            visitor: {
              trueName: '',
              qq: '',
              phone: this.$store.state.UserInfo.PhoneNumber,
              companyName: '',
              userNickname: this.$store.state.UserInfo.NickName,
              description: '',
              email: ''
            },
            onready: function() {
              window.easemobim.sendExt({
                ext: {
                  "imageName": "",
                  //custom代表自定义消息，无需修改
                  "type": "custom",
                  "msgtype": {
                    "order": {
                      "img_url": "",
                      "title": "无法获取到用户订单信息，原因：" + res.data.Meta.ErrorMsg,
                      "desc": "无法获取到用户订单信息，原因：" + res.data.Meta.ErrorMsg,
                      "order_title": "",
                      "price": "",
                      "item_url": ""
                    }
                  }
                }
              });
            },
          };
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    orderStatusAlter(type) {
      this.dialogType = type;
      if(type == '3') {
        this.DialogConfig = {
          IsDialog: '1',
          DialogTitle: '删除订单',
          DialogContent: '确定删除订单吗？',
          DialogBtns: ['取消', '确定'],
        };
      }
    },
    orderProcess() {
      this.DialogConfig.IsDialog = '0';
      if(this.dialogType == '3') {
        this.orderDelete();
      }
    },
    dialogClose() {
      this.isMoreOperate = '0';
      this.DialogConfig.IsDialog = '0';
    },
    orderCancel() {
      this.isMoreOperate = '0';
      if(this.orderDetail.OrderBtnInfo.IsDisplayCancelOrderBtn == '1' && this.orderDetail.OrderBtnInfo.IsGotoCancelPage == '1') {
        this.$router.push({
          name: 'order_cancel_reason',
          params: {
            orderId: this.orderId
          }
        });
      } else {
        this.DialogConfig = {
          IsDialog: '1',
          DialogTitle: '取消订单',
          DialogContent: '您已完成支付，是否联系客服取消订单？',
          DialogBtns: ['取消', '确定'],
          DialogBtnsHref: ['javascript: void(0);', 'tel:4008-262-056']
        }
      }
    },
    orderComplaint() {
      this.isMoreOperate = '0';
      this.$router.push({
        name: 'order_complaint_reason',
        params: {
          orderId: this.orderId
        }
      });
    },
    orderDelete() {
      axios.post(API.RemoveOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      })).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.alert('删除成功', () => {
            this.$router.replace({
              name: 'order'
            });
          });
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    evaluateFinish(status) {
      this.isEvaluate = '0';
      if (status) {
        if (status.ErrorCode == '0') {
          this.alert('评价成功');
          this.getOrderStatus();
        } else {
          this.alert(status.ErrorMsg);
        }
      }
    },
    orderConfirmDialog() {
      this.isConfirm = '1';
      var time = this.orderDetail.Service.ServiceStartTime;
      var date = new Date(Number(time + '000'));
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
      time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      this.orderTitleForConfirm = time + ' 的' + this.orderDetail.Service.ServiceName + '服务';
    },
    confirmFinish(status) {
      this.isConfirm = '0';
      if(status) {
        if (status.ErrorCode == '0') {
          this.alert('确认成功');
          this.getOrderStatus(() => {
            this.isEvaluate = '1';
          });
        } else {
          this.alert(status.ErrorMsg);
        }
      }
    },
    orderPay() {
      this.$router.push({
        name: 'order_pay',
        params: {
          orderId: this.orderId
        }
      });
    },
    orderAddPay() {
      this.$router.push({
        name: 'order_add_pay',
        params: {
          orderId: this.orderId
        }
      });
    }
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
    showBtnPanel() {
      if (this.orderDetail.OrderBtnInfo.IsDisplayClientConfirmBtn == '1' || this.orderDetail.OrderBtnInfo.IsDisplayDeleteOrderBtn == '1' || this.orderDetail.OrderBtnInfo.IsDisplayGotoEvaluateBtn == '1' || this.orderDetail.OrderBtnInfo.IsDisplayAddServiceBtn == '1' || this.orderDetail.OrderBtnInfo.IsDisplayGotoPayBtn == '1') {
        return true;
      } else {
        return false;
      }
    }
  },
  components: {
    OrderEvaluate,
    OrderConfirm,
  },
  filters: {
    formatDate(val) {
      val = parseInt(val + '000');
      var date = new Date(val);
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
    formatCountDown(val) {
      if(!val || isNaN(val) || val <= 0) {
        return 0;
      } else {
        val = Math.ceil(val);
        var minute = Math.floor(val / 60);
        minute = minute < 10 ? '0' + minute : minute;
        var second = Math.ceil((val - minute * 60) % 60);
        second = second < 10 ? '0' + second : second;
        return minute + '\"' + second + '\'';
      }
    },
    formatAmount(amount) {
      let a = amount + '';
      if(a.indexOf('.') === -1) {
        return '￥' + amount + '.00';
      } else {
        return '￥' + a.split('.')[0] + '.' + (a.split('.')[1].length === 1 ? a.split('.')[1] + '0' : a.split('.')[1]);
      }
    },
  }
}
</script>

<style scoped lang="scss">
$text-normal: #333639;
$text-light: #999;
$text-warn: #f56165;
.router-view
{
  position: relative;
  box-sizing: border-box;
  padding-bottom: 1.946667rem;
}
.icon-order-step-down
{
  width: 0.32rem;
  height: 0.32rem;
}
.order-header
{
  position: fixed;
  top: 0;
  left: 0;
  transform: translateZ(0);
  z-index: 20;
  width: 100%;
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
  .header-more
  {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    z-index: 21;
    width: 0.586667rem;
  }
}
.order-content
{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  .order-status
  {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 2.213333rem;
    padding-bottom: 3.3rem;
    padding-left: 0.76rem;
    padding-right: 0.426667rem;
    background-color: #fff;
    color: $text-light;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &.trans
    {
      transition: all .3s;
    }
    &.toggle
    {
      transform: translateX(-100%);
    }
    .status-group
    {
      position: relative;
      .group-title
      {
        -webkit-justify-content: initial;
        justify-content: initial;
        position: relative;
        margin-bottom: 0.533333rem;
        &::before
        {
          content: '';
          position: absolute;
          left: 2.5rem;
          top: 0;
          z-index: 1;
          display: block;
          width: 0.133333rem;
          height: 50%;
          background-color: #fff;
        }
        .title-time
        {
          flex-basis: 1.9rem;
          font-size: 14px;
          text-align: right;
        }
        .title-icon
        {
          position: relative;
          z-index: 10;
          margin: 0 0.533333rem;
        }
        .step-line
        {
          position: absolute;
          left: 2.566666rem;
          top: 50%;
          width: 0px;
          height: 100%;
          border-left: 2px dotted #ccc;
        }
      }
      .group-step
      {
        -webkit-justify-content: initial;
        justify-content: initial;
        position: relative;
        &:not(:first-child)
        {
          margin-top: 1.08rem;
        }
        .header
        {
          .step-time
          {
            flex-basis: 1.9rem;
            font-size: 14px;
            text-align: right;
          }
          .step-icon
          {
            position: relative;
            z-index: 10;
            display: block;
            width: 0.266667rem;
            height: 0.266667rem;
            margin: 0 0.533333rem;
            border: 1px solid #fff;
            border-radius: 50%;
            background-color: #ccc;
          }
          .desc-status
          {
            flex: 1;
            width: 1px;
            line-height: 100%;
            font-size: 15px;
          }
        }
        .content
        {
          .step-time
          {
            flex-basis: 1.9rem;
            font-size: 14px;
            text-align: right;
          }
          .step-icon
          {
            // position: relative;
            // z-index: 10;
            // display: block;
            // width: 0.266667rem;
            // height: 0.266667rem;
            // margin: 0 0.533333rem;
            // border: 1px solid transparent;
            display: block;
            flex-basis: 1.346667rem;
          }
          .desc-content
          {
            flex: 1;
            width: 1px;
            margin-top: 0.106667rem;
            font-size: 12px;
            .tel
            {
              color: #27b8f3;
            }
          }
        }
      }
      .next-step
      {
        -webkit-justify-content: initial;
        justify-content: initial;
        position: relative;
        color: $text-normal;
        &:not(:first-child)
        {
          margin-top: 1.08rem;
        }
        .header
        {
          .step-time
          {
            flex-basis: 1.9rem;
            font-size: 15px;
            text-align: right;
            &.hide
            {
              visibility: hidden;
            }
            &::before
            {
              content: '';
              display: inline-block;
              width: 0.426667rem;
              height: 0.426667rem;
              margin-right: 0.16rem;
              vertical-align: middle;
              background-image: url(../../assets/images/order_detail_time.png);
              background-repeat: no-repeat;
              background-size: 100%;
            }
          }
          .step-icon
          {
            position: relative;
            z-index: 10;
            display: block;
            width: 0.266667rem;
            height: 0.266667rem;
            margin: 0 0.533333rem;
            border: 1px solid #fff;
            border-radius: 50%;
            background-color: #333639;
            &.countdown
            {
              width: 0.346667rem;
              height: 0.346667rem;
              margin: 0 0.48rem;
              background-image: url(../../assets/images/order_detail_countdown.png);
              background-repeat: no-repeat;
              background-size: 100%;
              background-color: #fff;
            }
            &::after
            {
              content: '';
              position: absolute;
              top: 100%;
              left: 0;
              z-index: 10;
              width: 100%;
              height: 100%;
              background-color: #fff;
            }
          }
          .desc-status
          {
            flex: 1;
            width: 1px;
            line-height: 100%;
            font-size: 15px;
          }
        }
        .content
        {
          .step-time
          {
            flex-basis: 1.9rem;
            font-size: 14px;
            text-align: right;
          }
          .step-icon
          {
            position: relative;
            z-index: 10;
            display: block;
            flex-basis: 1.346667rem;
            background-color: #fff;
          }
          .desc-content
          {
            flex: 1;
            width: 1px;
            margin-top: 0.106667rem;
            color: #999;
            font-size: 12px;
          }
          .tel
          {
            color: #27b8f3;
          }
        }
      }
      .group-line
      {
        position: absolute;
        left: 2.566666rem;
        bottom: 0;
        width: 0px;
        height: 100%;
        border-left: 2px dotted #ccc;
      }
      & section:last-of-type .content
      {
        -webkit-align-items: stretch;
        align-items: stretch;
      }
      & section:last-of-type .header .step-icon
      {
        &::after
        {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 100%;
          background-color: #fff;
        }
      }
      & section:last-of-type .content .step-icon
      {
        position: relative;
        z-index: 10;
        display: block;
        flex-basis: 1.346667rem;
        background-color: #fff;
      }
    }
  }
  .order-info
  {
    position: absolute;
    top: 0;
    left: 100%;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-top: 1.866667rem;
    padding-bottom: 0.533333rem;
    background-color: #fff;
    color: $text-normal;
    font-size: 14px;
    overflow-y: scroll;
    &.trans
    {
      transition: all .3s;
    }
    &.toggle
    {
      transform: translateX(-100%);
    }
    .info-row
    {
      margin-left: 0.426667rem;
      margin-right: 0.426667rem;
      &:not(:first-child)
      {
        margin-top: 0.306667rem;
      }
      &.contact
      {
        .row-right
        {
          color: $text-light;
          text-align: left;
        }
      }
      .row-left
      {
        flex-basis: 1.866667rem;
      }
      .row-center
      {
        color: $text-warn;
      }
      .row-right
      {
        flex: 1;
        width: 1px;
        margin-left: 0.4rem;
        text-align: right;
      }
    }
    .info-line
    {
      height: 1px;
      margin-top: 0.306667rem;
      margin-left: 0.426667rem;
      background-color: #eef2f5;
    }
  }
}
.order-operation
{
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  box-sizing: border-box;
  width: 100%;
  height: 1.946667rem;
  padding: 0 0.666667rem;
  border-top: 1px solid #eef2f5;
  background-color: #fff;
  .btn
  {
    display: inline-block;
    // width: 3.0rem;
    width: auto;
    height: 1.146667rem;
    line-height: 1.146667rem;
    padding: 0 0.893333rem;
    //line-height: 100%;
    // padding: 0.3rem 0;
    border: 1px solid $text-warn;
    border-radius: 3px;
    color: $text-warn;
    font-size: 16px;
    text-align: center;
    &:not(:first-child)
    {
      margin-left: 0.266667rem;
    }
    &.oppo
    {
      background-color: $text-warn;
      color: #fff;
    }
  }
}
.order-more
{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100%;
  height: 100%;
  .more-wrapper
  {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.4);
  }
  .more-content
  {
    position: absolute;
    top: 1.266667rem;
    right: 0.266667rem;
    width: 3.626667rem;
    border-radius: 4px;
    background-color: #fff;
    &::before
    {
      content: '';
      position: absolute;
      top: -20px;
      right: 0.266667rem;
      display: block;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid #fff;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    .content-btn
    {
      display: block;
      width: 100%;
      height: 1.333333rem;
      line-height: 1.333333rem;
      color: #323232;
      font-size: 15px;
      text-align: center;
      &:not(:first-child)
      {
        border-top: 1px solid #eef2f5;
      }
    }
  }
}
</style>