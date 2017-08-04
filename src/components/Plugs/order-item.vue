<template>
<li class="list-item">
  <header class="item-header flex-row">
    <span class="header-name">{{ orderItem.Service.ServiceName }}</span>
    <span class="header-status">{{ orderItem.OrderBtnInfo.Title }}</span>
  </header>

  <div class="item-split"></div>

  <div class="item-info">
    <div class="info-row flex-row">
      <div class="row-left">服务地址</div>
      <div class="row-right txt-over-hide">{{ orderItem.Service.AddressInfo.Address1 }}{{ orderItem.Service.AddressInfo.Address2 | clearStr }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">服务时间</div>
      <div class="row-right txt-over-hide">{{ orderItem.Service.ServiceStartTime | formatDate }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">订单总价</div>
      <div class="row-right txt-over-hide" v-if="orderItem.IsNegotiable === '1'">{{ orderItem.StartingPrice }}元起</div>
      <div class="row-right txt-over-hide" v-else>{{ orderItem.TotalPrice }}元</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left" v-if="orderItem.PayStatus === '0'">实付金额</div>
      <div class="row-left" v-else>待付金额</div>
      <div class="row-right txt-over-hide" v-if="orderItem.PayAmount == null">待付款</div>
      <div class="row-right txt-over-hide" v-else>{{ orderItem.PayAmount | clearStr }}元</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">订单编号</div>
      <div class="row-right txt-over-hide">{{ orderItem.OrderCode }}</div>
    </div>
  </div>

  <div class="item-operation flex-row" v-if="orderItem.OrderBtnInfo.IsShowBtnInfo">
    <div class="remain-pay-time" :class="{ hide: orderItem.ResidualTime === null || orderItem.ResidualTime <= 0 }">剩余支付时间{{ orderItem.ResidualTime | payCountdown }}</div>

    <div class="operation-btns flex-row">
      <a class="btn" v-if="orderItem.OrderBtnInfo.IsDisplayCancelOrderBtn === '1'" @click="$emit('order-cancel-dialog', orderItem.OrderId)">取消订单</a>
      <a class="btn oppo" v-if="orderItem.OrderBtnInfo.IsDisplayClientConfirmBtn === '1'" @click="$emit('order-confirm-dialog', orderItem.OrderId)">确认订单</a>
      <a class="btn" v-if="orderItem.OrderBtnInfo.IsDisplayDeleteOrderBtn === '1'" @click="$emit('order-delete-dialog', orderItem.OrderId)">删除订单</a>
      <!-- <a class="btn" v-if="orderItem.OrderBtnInfo.IsDisplayGotoEvaluateBtn === '1'">评价订单</a> -->
      <a class="btn oppo" v-if="orderItem.OrderBtnInfo.IsDisplayGotoPayBtn === '1' && orderItem.ResidualTime" @click="$emit('order-pay', orderItem)">立即支付</a>

      <!-- 目前联系客服按钮只在“未支付”状态不显示 -->
      <a class="btn oppo" v-if="orderItem.OrderStatus !== '1' || orderItem.IsPayOff !== '0'" href="tel:4008-262-056">联系客服</a>
    </div>
  </div>
</li>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'order-item',
  data () {
    return {
    }
  },
  props: ['orderItem'],
  mounted() {
    // 设置支付倒计时
    if(this.orderItem.ResidualTime) {
      this.orderItem.payCountdownInterval = setInterval(() => {
        this.orderItem.ResidualTime--;
        if(this.orderItem.ResidualTime == 0) {
          $emit('order-cancel-dialog', this.orderItem.OrderId);
          clearInterval(this.orderItem.payCountdownInterval);
        }
      }, 1000);
    }
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
      minute = minute < 10 ? '0' + minute : minute;
      let second = time % 60;
      second = second < 10 ? '0' + second : second;
      return minute + '分' + second + '秒';
    },
  },
  watch: {
    orderItem() {
      if(!this.orderItem.ResidualTime || this.orderItem.ResidualTime <= 0) {
        clearInterval(this.orderItem.payCountdownInterval);
      }
    }
  }
}
</script>

<style scoped lang="scss">
$color_split_line: #e5e5e5;
$color_txt_normal: #888;
$color_txt_warn: #f56165;
.list-item
{
  background-color: #fff;
  color: $color_txt_normal;
  font-size: 14px;
  &:not(:first-child)
  {
    margin-top: 0.266667rem;
  }
  .item-header
  {
    line-height: 100%;
    padding: 0.533333rem 0.533333rem 0.48rem;
    font-size: 15px;
  }
  .item-split
  {
    height: 1px;
    margin-left: 0.533333rem;
    background-color: $color_split_line;
  }
  .item-info
  {
    padding: 0.4rem 0.533333rem;
    .info-row
    {
      &:not(:first-child)
      {
        margin-top: 0.4rem;
      }
      .row-left
      {
        flex-shrink: 0;
        -webkit-flex-shrink: 0;
      }
      .row-right
      {
        flex-grow: 1;
        -webkit-flex-grow: 1;
        width: 1px;
        margin-left: 0.866667rem;
        text-align: right;
      }
    }
  }
  .item-operation
  {
    overflow: hidden;
    height: 1.333333rem;
    border-top: 1px solid $color_split_line;
    padding: 0 0.533333rem;
    .remain-pay-time
    {
      //margin-right: 0.76rem;
      color: #333639;
      font-size: 15px;
      &.hide
      {
        visibility: hidden;
      }
    }
    .operation-btns
    {
      justify-content: flex-end;
      -webkit-justify-content: flex-end;
      text-align: right;
      .btn
      {
        // box-sizing: border-box;
        display: block;
        width: 2.0rem;
        // height: 0.8rem;
        height: 0.773333rem;
        // line-height: 0.8rem;
        line-height: 0.773333rem;
        border: 1px solid $color_txt_warn;
        border-radius: 3px;
        color: $color_txt_warn;
        font-size: 13px;
        text-align: center;
        &:not(:first-child)
        {
          margin-left: 0.266667rem;
        }
        &.oppo
        {
          background-color: $color_txt_warn;
          color: #fff;
        }
      }
    }
  }
}
</style>
