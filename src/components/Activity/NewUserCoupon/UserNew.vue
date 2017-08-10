<template>
  <div>
    <header id="header">
      <img class="header-img" src="../assets/images/hbfx_bg2.jpg">
    </header>

    <div id="container">
      <div class="coupon-new">
        <div class="info">
          <div class="info-title"><img class="title-line" src="../assets/images/hbfx_bg6.png"><span class="txt">恭喜你领取了</span><img class="title-line" src="../assets/images/hbfx_bg7.png"></div>

          <div class="info-content">￥<span class="coupon-price">188</span></div>
        </div>

        <div class="title">红包已放入您的账户<br>可在“我的红包”中查看</div>

        <coupon-list :couponList="couponList"></coupon-list>
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../config/backend';
import CouponList from './coupon-list.vue';
import axios from 'axios';
import qs from 'qs';
import WarnInfo from './warn-info.vue';

export default {
  name: 'userNew',
  data () {
    return {
      couponList: []//经过清洗后的红包列表
    }
  },
  mounted() {
    let that = this;
    if(this.NewUserCouponList && this.NewUserCouponList.length > 0) {
      this.NewUserCouponList.map((val, index, arr) => {
        let range = '所有服务通用';
        if (val.ServiceTypes.length > 0) {
          range = '限';
          val.ServiceTypes.map((val, index, arr) => {
            range += '“' + val.ServiceName + '”';
            if (index < arr.length - 1) {
              range += '、';
            }
          });
          range += '服务';
        }
        let availableTime = Math.floor((parseInt(val.EndTime + '000') - new Date().getTime()) / 1000 / 60 / 60 / 24);
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
      });
    }
  },
  computed: {
    ...mapState(['NewUserCouponList'])
  },
  components: {
    CouponList,
    WarnInfo
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
#container .coupon-new .info
{
  margin: 0 0.586667rem;
  padding: 0.48rem 0;
  border-radius: 10px;

  background-color: #fff;
}
#container .coupon-new .info-title
{
  text-align: center;
}
#container .coupon-new .info-title .txt
{
  line-height: 100%;
  margin: 0 0.213333rem;

  font-size: 14px;
  vertical-align: middle;
}
#container .coupon-new .title
{
  margin-top: 0.2rem;
  text-align: center;
  font-size: 14px;
}
#container .coupon-new .title-line
{
  width: 1.2rem;
  vertical-align: middle;
}
#container .coupon-new .info-content
{
  line-height: 100%;
  margin-top: 0.8rem;

  color: #f33;
  text-align: center;
  font-size: 30px;
}
#container .coupon-new .info-content .coupon-price
{
  font-size: 60px;
}
#container .coupon-lists
{
  margin: 0.533333rem 0.586667rem 0;
}
#container .coupon-lists .title
{
  text-align: center;
  font-size: 14px;
}
</style>
