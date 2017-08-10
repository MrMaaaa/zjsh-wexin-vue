<template>
  <div class="wrapper">
    <header id="header">
      <img class="header-img" src="../assets/images/hbfx_bg2.jpg">
    </header>

    <div id="container">
      <div class="coupon-registered">
        <div class="info">
          <div class="info-title"><img class="title-line" src="../assets/images/hbfx_bg6.png"><span class="txt">您已经是助家生活的老朋友啦</span><img class="title-line" src="../assets/images/hbfx_bg7.png"></div>

          <div class="info-content">仅限新用户参与</div>
        </div>

        <div class="coupon" v-if="couponList.length > 0">
          <div class="title">你可以使用以下红包下单</div>

          <coupon-list :couponList="couponList"></coupon-list>
        </div>
      </div>

      <div class="rule">
        <header class="rule-title">活动规则</header>

        <div class="rule-content">
          <p class="content-line">1.新用户红包可参加其他优惠叠加</p>
          <p class="content-line">2.红包仅限在助家生活最新版客户端使用且选择在线支付时使用</p>
          <p class="content-line">3.使用红包时下单手机号必须为抢红包时手机号</p>
          <p class="content-line">4.如有其它疑问请咨询助家生活客服</p>
        </div>
      </div>
    </div>

    <warn-info :warnMsg="warnMsg" v-show="isWarn"></warn-info>
  </div>
</template>

<script>
//如果哪一天产品要求老用户也领取老用户红包，请取消所有注释

import { mapState } from 'vuex';
import API from '../config/backend';
import axios from 'axios';
import qs from 'qs';
import CouponList from './coupon-list.vue';
import WarnInfo from './warn-info.vue';

export default {
  name: 'userRegistered',
  data () {
    return {
      couponList: [],
      isWarn: false,
      warnMsg: ''
    }
  },
  mounted() {
    axios.post(API.OldUserReceiveRedCoups, qs.stringify({
      "PhoneNumber": this.PhoneNumber
    }), {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => {
      if (res.data.Meta.ErrorCode == '0') {
        let that = this;
        res.data.Body.CouponList.map((val, index, arr) => {
          let range = '所有服务通用';
          if (val.ServiceTypes.length > 0) {
            range = '限';
            val.ServiceTypes.map((val, index, arr) => {
              range += '“' + val.ServiceName + '”';
              if(index < arr.length - 1) {
                range += '、';
              }
            });
            range += '服务';
          }
          let availableTime = Math.floor((parseInt(val.EndTime + '000') - new Date().getTime()) / 1000 / 60 / 60 / 24);
          if (availableTime > 0) {
            that.couponList.push({
              Price: val.CouponDetails[0].DiscountAmount,
              Limit: val.CouponDetails[0].Amount,
              Range: range,
              AvaiTime: availableTime,
              StartTime: val.StartTime,
              CreateTime: val.CreateTime,
              EndTime: val.EndTime,
              ServiceItem: val.ServiceItem,
              Id: val.Id,
              UserId: val.UserId
            });
          }
        });
      } else {
        this.isWarn = true;
        this.warnMsg = res.data.Meta.ErrorMsg;
      }
    });
  },
  components: {
    CouponList,
    WarnInfo
  },
  computed: {
    ...mapState(['PhoneNumber'])
  },
  watch: {
    isWarn(new_value, old_value) {
      //当warn-info弹出时在1s后关闭
      var that = this;
      if(new_value) {
        setTimeout(function() {
          that.isWarn = false;
        }, 1000);
      }
    }
  },
}
</script>

<style scoped>
.wrapper
{
  height: 100%;
  background-color: #f8d909;
}
.flex-row
{
  display: box;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-align-items: center;
  align-items: center;
}
.txt-hide
{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#header
{
  width: 100%;
}
#header .header-img
{
  display: block;
  width: 100%;
}
#container
{
  padding-bottom: 1.506667rem;
  background-color: #f8d909;
}
#container .rule
{
  margin: 0.506667rem 0.3rem 0;
  padding-top: 0.666667rem;
  padding-bottom: 1.133333rem;

  background-image: url(../assets/images/hbfx_bg3.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
#container .rule .rule-title
{
  font-size: 14px;
  text-align: center;
}
#container .rule .rule-content
{
  padding-top: 0.666667rem;
  padding-left: 0.666667rem;
  padding-right: 0.533333rem;
}
#container .rule .rule-content .content-line
{
  line-height: 0.6rem;

  font-size: 14px;
}
#container .coupon-registered .info
{
  margin: 0 0.586667rem;
  padding-top: 0.48rem;
  padding-bottom: 1.173333rem;
  border-radius: 10px;

  background-color: #fff;
}
#container .info .info-title
{
  text-align: center;
}
#container .info .info-title .txt
{
  line-height: 100%;
  margin: 0 0.213333rem;

  font-size: 14px;
  vertical-align: middle;
}
#container .info .title-line
{
  width: 1.2rem;
  vertical-align: middle;
}
#container .info .info-content
{
  margin-top: 0.8rem;

  color: #f33;
  text-align: center;
  font-size: 16px;
}
#container .coupon
{
  margin-top: 0.533333rem;
}
#container .coupon .title
{
  text-align: center;
  font-size: 14px;
}
</style>
