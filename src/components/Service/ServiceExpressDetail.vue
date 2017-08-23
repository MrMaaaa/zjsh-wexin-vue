<template>
<div>
  <div class="order-detail" v-if="orderDetail">
    <div class="order-status-title">
      <img class="icon-status" src="../../assets/images/order_process.png">
      <div class="info" v-if="orderStatusList && orderStatusList.length > 0">
        <span class="title">已接单</span>
        <span class="desc">请等待快递员上门取件</span>
      </div>
      <div class="info" v-else>
        <span class="title">订单已提交</span>
        <span class="desc">请等待快递员上门取件</span>
      </div>
    </div>

    <div class="order-status" v-if="orderStatusList && orderStatusList.length > 0">
      <div class="top-split"></div>
      <ul class="status-list">
        <li class="status-item receive-address flex-row">
          <div class="datetime">
            <span class="time">00:00</span>
            <span class="date">0000-00-00</span>
          </div>
          <div class="step">
            <img class="icon-receive" src="../../assets/images/icon_receive.png">
          </div>
          <div class="info">【收件地址】{{ orderDetail.RevicerAddress.Address1 + orderDetail.RevicerAddress.Address2 }}</div>
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

    <div class="status-info">
      <div class="row flex-row">
        <div class="left">快递公司</div>
        <div class="right txt-over-hidden">{{ orderDetail.ShipperName }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">快递单号</div>
        <div class="right txt-over-hidden">{{ orderDetail.LogisticCode }}</div>
      </div>
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
      <div class="express">
        <img class="icon-express" src="../../assets/images/sf.png"><span>{{ orderDetail.ShipperName }}</span>
      </div>
      <div class="row flex-row">
        <div class="left">发件地址</div>
        <div class="right txt-over-hidden">{{ orderDetail.SenderAddress.Address1 + orderDetail.SenderAddress.Address2 }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">发件人</div>
        <div class="right txt-over-hidden">{{ orderDetail.SenderAddress.Contact }}  {{orderDetail.SenderAddress.PhoneNumber }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">收件地址</div>
        <div class="right txt-over-hidden">{{ orderDetail.RevicerAddress.Address1 + orderDetail.RevicerAddress.Address2 }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">收件人</div>
        <div class="right txt-over-hidden">{{ orderDetail.RevicerAddress.Contact }}  {{orderDetail.RevicerAddress.PhoneNumber }}</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">物品名称</div>
        <div class="right txt-over-hidden">{{ orderDetail.GoodsName }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">物品重量</div>
        <div class="right txt-over-hidden">{{ orderDetail.GoodsWeight }}kg</div>
      </div>
      <div class="row flex-row">
        <div class="left">付款方式</div>
        <div class="right txt-over-hidden" v-if="orderDetail.PayType == '0'">寄件人付</div>
        <div class="right txt-over-hidden" v-if="orderDetail.PayType == '1'">收件人付</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">订单编号</div>
        <div class="right txt-over-hidden">{{ orderDetail.OrderCode }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">下单时间</div>
        <div class="right txt-over-hidden">{{ orderDetail.CreateTime | formatDate }}</div>
      </div>
    </div>
  </div>

  <m-loading bg-style="1" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'express_order_detail',
  data() {
    return {
      orderDetail: null,
      orderStatusList: [],
      orderId: '',
      isLoading: true,
    }
  },
  activated() {
    this.orderId = this.$route.params.orderId;
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail: function() {
      this.isLoading = true;
      axios.post(API.GetExpressDetail, {
        Token: this.Token,
        OrderId: this.orderId
      }).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          this.orderDetail = res.data.Body;
          this.getOrderStatus(this.orderDetail.LogisticCode, this.orderDetail.ShipperCode);
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
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then(res => {
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
    }
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
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
  }
}
</script>

<style scoped>
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
.status-info
{
  margin-top: 0.266667rem;
  padding-top: 0.4rem;
  padding-bottom: 0.6rem;
  background-color: #fff;
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
  padding-left: 0.35rem;
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
.row
{
  padding: 0 0.426667rem;
  background-color: #fff;
  font-size: 14px;
}
.row:not(:first-child)
{
  margin-top: 0.4rem;
}
.row.price .left
{
  font-size: 16px;
}
.row.price .right
{
  color: #f93e24;
  font-size: 16px;
}
.row .left
{
  min-width: 2rem;
  color: #333639;
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
}
.row .right
{
  color: #666;
  text-align: right;
  flex-grow: 1;
  -webkit-flex-grow: 1;
}
</style>