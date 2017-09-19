<template>
<div>
  <div class="order-wrapper">
    <header class="title">
      <img class="title-img" src="../../assets/images/order_pay_success.png">

      <div class="title-info">
        <p class="info-status">支付成功</p>
        <p class="info-price">已支付￥{{ payAmount }}</p>
      </div>
    </header>

    <section class="order" v-if="orderInfo">
      <div class="order-item flex-row">
        <div class="left">联系人</div>

        <div class="right txt-over-hide">{{ orderInfo.Service.AddressInfo.Contact }} {{ orderInfo.Service.AddressInfo.PhoneNumber }}</div>
      </div>
      <div class="order-item flex-row">
        <div class="left">服务地址</div>

        <div class="right txt-over-hide">{{ orderInfo.Service.AddressInfo.Address1 }} {{ orderInfo.Service.AddressInfo.Address2 }}</div>
      </div>
      <div class="order-item flex-row">
        <div class="left">服务时间</div>

        <div class="right txt-over-hide">{{ orderInfo.Service.ServiceStartTime | formatDate }}</div>
      </div>
    </section>

    <section class="operation flex-row">
      <a class="operation-btn" @click="viewOrder">查看订单</a>
      <router-link class="operation-btn" :to="{ name: 'index' }">返回首页</router-link>
    </section>
  </div>

  <m-loading :bg-style="1" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import OrderItem from '../Plugs/order-item';
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'order_pay_status',
  data() {
    return {
      orderId: '',
      payAmount: '',
      type: '',
      orderInfo: null,
      isLoading: true,
    }
  },
  activated() {
    this.payAmount = '';
    this.orderId = this.$route.query.orderId;
    this.type = this.$route.query.type;
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail() {
      axios.post(API.GetOrderInfoEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      })).then(res => {
        this.isLoading = false;
        this.bgLoading = '2';
        if (res.data.Meta.ErrorCode === '0') {
          this.orderInfo = res.data.Body.Order;

          // 根据传递的type显示不同的金额 0订金 1普通 2增项
          if (this.type == '0') {
            this.payAmount = this.orderInfo.DepositInfo.DepositAmount;
          } else if (this.type == '1') {
            this.payAmount = this.orderInfo.PayAmount;
          } else if (this.type == '2') {
            this.payAmount = this.$route.query.money;
          } else {
            this.payAmount = '';
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.txtLoading = '';
        this.bgLoading = '2';
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    viewOrder() {
      if(this.orderInfo.IsKdEOrder == '0') {
        this.$router.push({
          name: 'order_detail',
          params: {
            orderId: this.orderId
          }
        });
      } else if(this.orderInfo.IsKdEOrder == '2') {
        this.$router.push({
          name: 'errand_order_detail',
          params: {
            orderId: this.orderId
          }
        });
      }
    }
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
  },
  components: {
    OrderItem,
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
  }
}
</script>

<style scoped lang="scss">
$text-normal: #333639;
$text-light: #999;
$text-warn: #f56165;
.order-wrapper
{
  padding-bottom: 0.4rem;
  background-color: #fff;
  .title
  {
    padding-top: 0.68rem;
    padding-bottom: 0.706667rem;
    text-align: center;
    .title-img
    {
      display: inline-block;
      width: 1.306667rem;
      vertical-align: middle;
    }
    .title-info
    {
      display: inline-block;
      margin-left: 0.32rem;
      color: #333639;
      vertical-align: middle;
      .info-status
      {
        font-size: 18px;
        font-weight: bolder;
      }
      .info-price
      {
        color: $text-normal;
        font-size: 14px;
      }
    }
  }
  .order
  {
    padding: 0.426667rem 0.533333rem;
    .order-item
    {
      line-height: 100%;
      color: $text-light;
      font-size: 14px;
      &:not(:first-child)
      {
        margin-top: 0.266667rem;
      }
      .left
      {
        -webkit-flex-basis: 2.0rem;
        flex-basis: 2.0rem;
      }
      .right
      {
        -webkit-flex: 1;
        flex: 1;
        width: 1px;
        text-align: right;
      }
    }
  }
  .operation
  {
    -webkit-justify-content: center;
    justify-content: center;
    margin-top: 0.413333rem;
    padding: 0 0.4rem;
    .operation-btn
    {
      display: block;
      width: 100%;
      padding: 0.333333rem 0;
      border: 1px solid $text-warn;
      border-radius: 4px;
      color: $text-warn;
      font-size: 16px;
      text-align: center;
      &:not(:first-child)
      {
        margin-left: 0.453333rem;
      }
    }
  }
}
</style>