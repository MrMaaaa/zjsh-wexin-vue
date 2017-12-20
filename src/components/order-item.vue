<template>
<li class="list-item">
  <header class="item-header flex-row" @click="showOrderDetail(orderItem)">
    <span class="header-info flex-row">
      <img class="info-icon" :src="orderItem.Service.ServiceProductIcon">
      <span class="info-name txt-over-hide">{{ orderItem.Service.ServiceName }}</span>
    </span>
    <span class="header-status txt-over-hide" v-if="orderItem.IsKdEOrder !== '1'">{{ orderItem.OrderBtnInfo.Title }}</span>
  </header>

  <div class="item-split"></div>

  <div class="item-info" v-if="orderItem.IsKdEOrder === '0'" @click="showOrderDetail(orderItem)">
    <div class="info-row flex-row">
      <div class="row-left">服务时间</div>
      <div class="row-right txt-over-hide">{{ orderItem.Service.ServiceStartTime | formatTitleDate }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">服务地址</div>
      <div class="row-right txt-over-hide">{{ orderItem.Service.AddressInfo.Address1 }} {{ orderItem.Service.AddressInfo.Address2 | clearStr }}</div>
    </div>

    <div class="info-row flex-row" v-if="orderItem.DepositInfo && orderItem.DepositInfo.DepositIsPayOff == '0'">
      <div class="row-left">订金</div>
      <div class="row-right txt-over-hide">{{ orderItem.DepositInfo.DepositAmount }}元</div>
    </div>

    <div class="info-row flex-row" v-else>
      <div class="row-left">订单总价</div>
      <div class="row-right txt-over-hide" v-if="orderItem.IsNegotiable === '1'">{{ orderItem.StartingPrice }}元起</div>
      <div class="row-right txt-over-hide" v-else>{{ orderItem.TotalPrice }}元</div>
    </div>

    <div class="info-row pay-info flex-row">
      <div class="row-left" v-if="orderItem.PayStatus === '0'">实付金额</div>
      <div class="row-left" v-else>待付金额</div>
      <div class="row-right txt-over-hide" v-if="orderItem.DepositInfo && orderItem.DepositInfo.DepositIsPayOff == '0'">{{ orderItem.DepositInfo.DepositAmount }}元</div>
      <div class="row-right txt-over-hide" v-else-if="orderItem.PayAmount == null">待付款</div>
      <div class="row-right txt-over-hide" v-else>{{ orderItem.PayAmount | clearStr }}元</div>
    </div>
  </div>

  <div class="item-info" v-else-if="orderItem.KdEOrderInfo" @click="showOrderDetail(orderItem)">
    <div class="info-row flex-row">
      <div class="row-left">快递单号</div>
      <div class="row-right txt-over-hide">{{ orderItem.KdEOrderInfo.LogisticCode }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">发件时间</div>
      <div class="row-right txt-over-hide">{{ orderItem.Service.ServiceStartTime | formatTitleDate }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">发件地址</div>
      <div class="row-right txt-over-hide">{{ orderItem.Service.AddressInfo.Address1 }} {{ orderItem.Service.AddressInfo.Address2 | clearStr }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">收件地址</div>
      <div class="row-right txt-over-hide">{{ orderItem.KdEOrderInfo.TargetAddress.Address1 }} {{ orderItem.KdEOrderInfo.TargetAddress.Address2 | clearStr }}</div>
    </div>
  </div>

  <div class="item-info" v-else-if="orderItem.ExpressOrderInfo" @click="showOrderDetail(orderItem)">
    <!-- <div class="info-row flex-row">
      <div class="row-left">快递单号</div>
      <div class="row-right txt-over-hide">{{ orderItem.ExpressOrderInfo.LogisticCode }}</div>
    </div> -->

    <div class="info-row flex-row">
      <div class="row-left">发件时间</div>
      <div class="row-right txt-over-hide">{{ orderItem.Service.ServiceStartTime | formatTitleDate }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">发件地址</div>
      <div class="row-right txt-over-hide">{{ orderItem.Service.AddressInfo.Address1 }} {{ orderItem.Service.AddressInfo.Address2 | clearStr }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">收件地址</div>
      <div class="row-right txt-over-hide">{{ orderItem.ExpressOrderInfo.TargetAddress.Address1 }} {{ orderItem.ExpressOrderInfo.TargetAddress.Address2 | clearStr }}</div>
    </div>

    <div class="info-row flex-row">
      <div class="row-left">订单总价</div>
      <div class="row-right txt-over-hide">{{ orderItem.TotalPrice | clearStr }}元</div>
    </div>

    <div class="info-row pay-info flex-row">
      <div class="row-left" v-if="orderItem.PayStatus === '0'">实付金额</div>
      <div class="row-left" v-else>待付金额</div>
      <div class="row-right txt-over-hide" v-if="orderItem.DepositInfo && orderItem.DepositInfo.DepositIsPayOff == '0'">{{ orderItem.DepositInfo.DepositAmount }}元</div>
      <div class="row-right txt-over-hide" v-else-if="orderItem.PayAmount == null">待付款</div>
      <div class="row-right txt-over-hide" v-else>{{ orderItem.PayAmount | clearStr }}元</div>
    </div>
  </div>

  <div class="item-operation flex-row" v-if="orderItem.OrderBtnInfo.IsShowBtnInfo">
    <div class="refund-status" :class="{ hide: !orderItem.RefundStatus || orderItem.RefundStatus == '' }">{{ orderItem.RefundStatus }}</div>

    <div class="operation-btns flex-row">
      <a class="btn oppo" v-if="orderItem.IsKdEOrder !== '1' && orderItem.OrderBtnInfo.IsDisplayClientConfirmBtn === '1'" @click="$emit('order-confirm', orderItem.OrderId, orderDialogTitle)">确认订单</a>
      <a class="btn" v-if="orderItem.IsKdEOrder !== '1' && orderItem.OrderBtnInfo.IsDisplayDeleteOrderBtn === '1'" @click="$emit('order-delete', orderItem.OrderId)">删除订单</a>
      <a class="btn" v-if="orderItem.OrderBtnInfo.IsDisplayGotoEvaluateBtn === '1'" @click="$emit('order-evaluate', orderItem.OrderCode, orderItem.Service.ServiceId, orderDialogTitle)">评价订单</a>
      <a class="btn oppo" v-if="orderItem.IsKdEOrder !== '1' && orderItem.OrderBtnInfo.IsDisplayAddServiceBtn === '1'" @click="$emit('order-add-pay', orderItem)">￥增加服务</a>
      <a class="btn oppo" v-if="orderItem.IsKdEOrder !== '1' && orderItem.OrderBtnInfo.IsDisplayGotoPayBtn === '1'" @click="$emit('order-pay', orderItem)">立即支付</a>
    </div>
  </div>
</li>
</template>

<script>
import { mapState } from 'vuex';
import Utils from '../config/utils.js';

export default {
  name: 'order-item',
  data () {
    return {
    }
  },
  props: ['orderItem'],
  mounted() {
    // 设置支付倒计时
    // let interval = null;
    // if(this.orderItem.ResidualTime && this.orderItem.ResidualTime > 0) {
    //   interval = setInterval(() => {
    //     this.orderItem.ResidualTime--;
    //     if((this.orderItem.ResidualTime <= 0 || !this.orderItem.ResidualTime) && this.orderItem.OrderStatus != '50') {
    //       this.$emit('order-cancel-dialog', {
    //         orderId: this.orderItem.OrderId,
    //         autoCancel: '1'
    //       });
    //       clearInterval(interval);
    //     }
    //   }, 1000);
    // }
  },
  methods: {
    showOrderDetail(item) {
      if(item.IsKdEOrder === '0') {
        this.$router.push({
          name: 'order_detail',
          params: {
            orderId: item.OrderId
          }
        });
      } else if(item.IsKdEOrder === '1') {
        this.$router.push({
          name: 'express_order_detail',
          params: {
            orderId: item.OrderId
          }
        });
      } else if(item.IsKdEOrder === '2') {
        this.$router.push({
          name: 'errand_order_detail',
          params: {
            orderId: item.OrderId
          }
        });
      }
    },
    formatTitleDate(date) {
      let now = new Date(Number(date + '000'));
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
  },
  computed: {
    orderDialogTitle() {
      return this.formatTitleDate(this.orderItem.Service.ServiceStartTime + '000') + '的' + this.orderItem.Service.ServiceName + '服务';
    }
  },
  filters: {
    formatTitleDate(date) {
      if (!date) {
        return '';
      }

      let today = new Date();
      let tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      let yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      let target = new Date(Number(date + '000'));
      if (target.getFullYear() === today.getFullYear() && (target.getMonth() + 1) === (today.getMonth() + 1) && target.getDate() === today.getDate()) {
        // 今天
        return '今天 ' + Utils.formatDate(target.getTime(), 'hh:mm');
      } else if (target.getFullYear() === tomorrow.getFullYear() && (target.getMonth() + 1) === (tomorrow.getMonth() + 1) && target.getDate() === tomorrow.getDate()) {
        // 明天
        return '明天 ' + Utils.formatDate(target.getTime(), 'hh:mm');
      } else if (target.getFullYear() === yesterday.getFullYear() && (target.getMonth() + 1) === (yesterday.getMonth() + 1) && target.getDate() === yesterday.getDate()) {
        // 昨天
        return '昨天 ' + Utils.formatDate(target.getTime(), 'hh:mm');
      } else {
        return Utils.formatDate(target.getTime(), 'yyyy-mn-dd hh:mm');
      }
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
// $color_text_normal: #888;
// $color_base_red: #f56165;

$color_base_bg: #f7f7ff;
$color_base_red: #f56165;
$color_split_line: #e5e5e5;
$color_text_normal: #333639;
$color_text_light: #888;

.list-item
{
  display: block;
  background-color: #fff;
  color: $color_text_light;
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
    .header-info
    {
      -webkit-justify-content: initial;
      justify-content: initial;
      .info-icon
      {
        width: 0.586667rem;
        height: 0.586667rem;
        margin-right: 0.24rem;
      }
      .info-name
      {
        width: 3.733333rem;
      }
    }
    .header-status
    {
      width: 4.0rem;
      text-align: right;
    }
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
      &.pay-info
      {
        .row-right
        {
          color: $color_text_normal;
        }
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
    .refund-status
    {
      margin-right: 0.76rem;
      color: $color_base_red;
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
        display: block;
        width: 2.0rem;
        // height: 0.8rem;
        // height: 0.773333rem;
        // line-height: 0.8rem;
        // line-height: 0.8rem;
        line-height: 100%;
        padding: 0.2rem 0;
        border: 1px solid $color_base_red;
        border-radius: 3px;
        color: $color_base_red;
        font-size: 13px;
        text-align: center;
        &:not(:first-child)
        {
          margin-left: 0.266667rem;
        }
        &.oppo
        {
          background-color: $color_base_red;
          color: #fff;
        }
      }
    }
  }
}
</style>
