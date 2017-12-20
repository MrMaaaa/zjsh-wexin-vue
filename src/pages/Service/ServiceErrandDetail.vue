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
        <div class="right txt-over-hide">{{ orderDetail.SenderAddress.Contact }} {{ orderDetail.SenderAddress.PhoneNumber }}</div>
      </div>
      <div class="info-split"></div>
      <div class="row flex-row">
        <div class="left">收件地址</div>
        <div class="right txt-over-hide">{{ orderDetail.RevicerAddress.Address1 }} {{ orderDetail.RevicerAddress.Address2 }}</div>
      </div>
      <div class="row flex-row">
        <div class="left">收件人</div>
        <div class="right txt-over-hide">{{ orderDetail.RevicerAddress.Contact }} {{ orderDetail.RevicerAddress.PhoneNumber }}</div>
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
      <div class="operation-btns">
        <a class="btn" v-if="orderDetail.IsPayOff === '0' && orderDetail.State > 0" @click="orderCancel">取消订单</a>
        <a class="btn oppo" v-if="orderDetail.IsPayOff === '0' && orderDetail.State > 0" @click="orderPay">支付</a>
        <a class="btn oppo" v-if="orderDetail.State > 1" href="tel:4008-262-056">联系客服</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'errand_order_detail',
  data() {
    return {
      orderDetail: null,
      orderStatusList: [],
      orderId: '',
    }
  },
  activated() {
    this.orderStatusList.splice(0);
    this.orderId = this.$route.params.orderId;
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail() {
      this.$loading.open(2);
      this.$store.dispatch('GetExpressDetail', {
        OrderId: this.orderId
      })
      .then(res => {
        this.$loading.close();
        this.orderDetail = res;
        if (this.orderDetail.LogisticCode) {
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
      })
      .catch(err => {
        this.$loading.close();
        this.$alert(err.message || err.ErrorMsg);
      });
    },
    getOrderStatus(LogisticCode, ShipperCode) {
      this.$store.dispatch('GetKdTrackInfo', {
          LogisticCode,
          ShipperCode
        })
        .then(res => {
          this.orderStatusList = res.Traces;
          this.orderStatusList = this.orderStatusList.concat(this.orderDetail.Traces);
          this.orderStatusList.forEach((value, index) => {
            value.Date = value.AcceptTime.split(' ')[0];
            value.Time = value.AcceptTime.split(' ')[1];
          });
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    orderPay() {
      this.$router.push({
        name: 'order_pay',
        params: {
          orderId: this.orderId
        }
      });
    },
    orderCancel() {
      this.$router.push({
        name: 'order_cancel_reason',
        params: {
          orderId: this.orderId
        }
      });
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
  text-align: right;
  padding: 0 0.426667rem;
}
.operation-btns .btn
{
  display: inline-block;
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