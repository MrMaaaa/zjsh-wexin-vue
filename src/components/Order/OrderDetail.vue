<template>
<div>
  <header class="order-header flex-row">
    <a class="header-title" @click="switchTab(0)">订单状态</a>
    <a class="header-title" @click="switchTab(1)">订单信息</a>
    <i class="header-index" :class="{ right: tabIndex == '1' }" ref="tabIndex"></i>
  </header>

  <div class="order-content" ref="sliderContainer">
    <div class="float-container"ref="sliderWrapper" :class="{ right: tabIndex == '1' }">
      <div class="order-status" v-if="orderStatus && orderStatus.DateStatus.length > 0">
        <section class="status-group" v-for="item in orderStatus.DateStatus">
          <header class="group-title flex-row">
            <div class="title-time">{{ item.Date }}</div>
            <img class="icon-order-step-down title-icon" src="../../assets/images/order-detail-down.png">
          </header>

          <section class="group-step flex-row" v-for="step in item.Status">
            <div class="step-time">{{ step.Time }}</div>
            <i class="step-icon"></i>
            <div class="step-desc">
              <div class="desc-status">{{ step.Status }}</div>
              <div class="desc-content">{{ step.Description }}</div>
            </div>
          </section>

          <section class="next-step flex-row" v-if="orderStatus.NextStatus">
            <div class="step-time">{{ orderStatus.NextStatus.CountDown }}</div>
            <i class="step-icon flex-row"><i class="step-inner-icon"></i></i>
            <div class="step-desc">
              <div class="desc-status">{{ orderStatus.NextStatus.Status }}</div>
              <div class="desc-content">{{ orderStatus.NextStatus.Description }}</div>
            </div>
          </section>
          <i class="group-line"></i>
        </section>
      </div>

      <div class="order-info" v-if="orderDetail">
        <div class="info-row flex-row">
          <div class="row-left">服务类型</div>
          <div class="row-right">{{ orderDetail.Service.ServiceName }}</div>
        </div>
        <div class="info-row flex-row">
          <div class="row-left">服务时间</div>
          <div class="row-right">{{ orderDetail.Service.ServiceStartTime | formatDate }}</div>
        </div>
        <div class="info-row flex-row">
          <div class="row-left">服务价格</div>
          <div class="row-right">{{ orderDetail.Price | formatAmount }} × {{ orderDetail.Total }}{{ orderDetail.UnitName }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.ClaimsInfo">
          <div class="row-left">一元保险</div>
          <div class="row-right">{{ orderDetail.ClaimsInfo.ClaimsAmount | formatAmount }}</div>
        </div>
        <div class="info-row flex-row">
          <div class="row-left">订单总价</div>
          <div class="row-right">{{ orderDetail.TotalPrice | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.DiscountAmount && orderDetail.DiscountAmount > 0">
          <div class="row-left">{{ orderDetail.DiscountInfo }}</div>
          <div class="row-right">-{{ orderDetail.DiscountAmount | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-for="dis in orderDetail.ActivityNgs.ServiceTypeRules" v-if="orderDetail.ActivityNgs && orderDetail.ActivityNgs.ServiceTypeRules.length > 0">
          <div class="row-left">{{ dis.Details[0].Title }}</div>
          <div class="row-right">-{{ dis.Details[0].Rules[0].Minus | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-if="orderDetail.IsPayOff === '1'">
          <div class="row-left">实付</div>
          <div class="row-right">{{ orderDetail.PayAmount | formatAmount }}</div>
        </div>
        <div class="info-row flex-row" v-else>
          <div class="row-left">待支付</div>
          <div class="row-right">{{ orderDetail.PayAmount | formatAmount }}</div>
        </div>
        <div class="info-line"></div>
        <div class="info-row flex-row">
          <div class="row-left">备注</div>
          <div class="row-right">{{ orderDetail.Service.Content && orderDetail.Service.Content.join('；') }}</div>
        </div>
        <div class="info-line"></div>
        <div class="info-row contact flex-row">
          <div class="row-left">联系人</div>
          <div class="row-right">{{ orderDetail.Service.AddressInfo.Contact }}</div>
        </div>
        <div class="info-row contact flex-row">
          <div class="row-left">联系电话</div>
          <div class="row-right">{{ orderDetail.Service.AddressInfo.PhoneNumber }}</div>
        </div>
        <div class="info-row contact flex-row">
          <div class="row-left">服务地址</div>
          <div class="row-right">{{ orderDetail.Service.AddressInfo.Address1 }} {{ orderDetail.Service.AddressInfo.Address2 }}</div>
        </div>
        <div class="info-line"></div>
        <div class="info-row contact flex-row">
          <div class="row-left">订单编号</div>
          <div class="row-right">{{ orderDetail.OrderCode }}</div>
        </div>
      </div>
    </div>
  </div>

  <m-loading :bg-style="loadingBgStyle" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
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
    }
  },
  mounted() {
    this.$refs.sliderContainer.addEventListener('touchstart', event => {
      this.touchStartX = event.changedTouches[0].clientX;
      this.touchStartY = event.changedTouches[0].clientY;
    });
    this.$refs.sliderContainer.addEventListener('touchmove', event => {
      if(Math.abs(event.changedTouches[0].clientX - this.touchStartX) <= 20) {
        event.preventDefault();
      } else {
        if(this.tabIndex == '0' && event.changedTouches[0].clientX - this.touchStartX < 0) {
          // 向左滑动
          var transDis = Math.ceil(Math.abs(event.changedTouches[0].clientX - this.touchStartX) / screen.availWidth * 100 * 1.2); // 计算滑动距离并转为百分比
          if(transDis > 100) {
            // 百分比不超过100
            transDis = 100;
          }
          this.$refs.tabIndex.style.transform = 'translateX(' + transDis + '%)'; // 最大移动100%
          this.$refs.sliderWrapper.style.transform = 'translateX(-' + transDis / 2 + '%)'; // 最大移动50%
        } else if(this.tabIndex == '1' && event.changedTouches[0].clientX - this.touchStartX > 0) {
          // 向右滑动
          console.log(event.changedTouches[0].clientX - this.touchStartX);
          var transDis = Math.ceil(Math.abs(event.changedTouches[0].clientX - this.touchStartX) / screen.availWidth * 100 * 1.2);
          if(transDis > 100) {
            transDis = 100;
          }
          this.$refs.tabIndex.style.transform = 'translateX(' + (100 - transDis) + '%)';
          this.$refs.sliderWrapper.style.transform = 'translateX(-' + (100 - transDis) / 2 + '%)';
        }
      }
    });
    this.$refs.sliderContainer.addEventListener('touchend', event => {
      this.$refs.tabIndex.removeAttribute('style');
      this.$refs.sliderWrapper.removeAttribute('style');
      if(Math.abs(event.changedTouches[0].clientX - this.touchStartX) >= screen.availWidth / 3) {
        this.tabIndex = this.tabIndex == '0' ? '1' : '0';
      }
    });
  },
  activated() {
    this.orderId = this.$route.params.orderId;
    this.getOrderStatus();
  },
  methods: {
    switchTab(index) {
      this.tabIndex = index.toString();
    },
    getOrderStatus() {
      this.isLoading = true;
      axios.post(API.TrackOrderStatus, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          this.orderStatus = res.data.Body;
          this.getOrderDetail();
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    getOrderDetail() {
      axios.post(API.GetOrderInfoEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.orderDetail = res.data.Body.Order;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
  },
  computed: {
    ...mapState(['Token'])
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
    formatAmount(amount) {
      let a = amount.toString();
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
.icon-order-step-down
{
  width: 0.32rem;
  height: 0.32rem;
}
.order-header
{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 1.066667rem;
  background-color: #fff;
  box-shadow: 0 3px 3px #ddd;
  overflow: hidden;
  .header-title
  {
    display: block;
    width: 50%;
    height: 0.933333rem;
    line-height: 0.933333rem;
    font-size: 15px;
    text-align: center;
  }
  .header-index
  {
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 50%;
    height: 4px;
    background-color: #f56165;
    transition: all .3s;
    &.right
    {
      transform: translateX(100%);
    }
  }
}
.order-content
{
  width: 100%;
  min-height: 100%;
  margin-top: 1.322223rem;
  overflow: hidden;
  .float-container
  {
    width: 200%;
    min-height: 100%;
    overflow: hidden;
    transition: all .3s;
    &::before,
    &::after
    {
      content: '';
      display: block;
      width: 0;
      height: 0;
      clear: both;
    }
    &.right
    {
      transform: translateX(-50%);
      transition: all .3s;
    }
    .order-status
    {
      box-sizing: border-box;
      float: left;
      width: 50%;
      padding-top: 0.88rem;
      padding-bottom: 0.88rem;
      padding-left: 0.76rem;
      padding-right: 0.426667rem;
      background-color: #fff;
      color: $text-light;
      .status-group
      {
        position: relative;
        .group-title
        {
          justify-content: flex-start;
          margin-bottom: 0.533333rem;
          .title-time
          {
            flex-basis: 1.9rem;
            font-size: 14px;
            text-align: right;
          }
          .title-icon
          {
            position: relative;
            z-index: 2;
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
          justify-content: flex-start;
          &:not(:first-child)
          {
            margin-top: 1.08rem;
          }
          .step-time
          {
            flex-basis: 1.9rem;
            font-size: 14px;
            text-align: right;
          }
          .step-icon
          {
            display: block;
            width: 0.266667rem;
            height: 0.266667rem;
            margin: 0 0.533333rem;
            border: 1px solid #fff;
            border-radius: 50%;
            background-color: #ccc;
          }
          .step-desc
          {
            flex: 1;
            width: 1px;
            .desc-status
            {
              font-size: 15px;
            }
          }
        }
        .next-step
        {
          justify-content: flex-start;
          color: $text-normal;
          &:not(:first-child)
          {
            margin-top: 1.08rem;
          }
          .step-time
          {
            flex-basis: 1.9rem;
            font-size: 14px;
            text-align: right;
          }
          .step-icon
          {
            justify-content: center;
            position: relative;
            z-index: 1;
            width: 0.3rem;
            height: 0.3rem;
            margin: 0 0.52rem;
            border: 1px solid $text-normal;
            border-radius: 50%;
            background-color: #fff;
            .step-inner-icon
            {
              display: block;
              width: 0.23rem;
              height: 0.23rem;
              border-radius: 50%;
              background-color: $text-normal;
            }
          }
          .step-desc
          {
            flex: 1;
            width: 1px;
            .desc-status
            {
              font-size: 15px;
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
          border-left: 2px dashed #ccc;
        }
      }
    }
    .order-info
    {
      box-sizing: border-box;
      float: left;
      width: 50%;
      padding-top: 0.533333rem;
      padding-bottom: 0.533333rem;
      background-color: #fff;
      color: $text-normal;
      font-size: 14px;
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
}
</style>