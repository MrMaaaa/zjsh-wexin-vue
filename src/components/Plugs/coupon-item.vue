<template>
<!--
couponTypeByVue: 0:未使用 1:已使用 2:已过期
-->
<li class="list-item flex-row" :class="{ gray: couponItem.couponTypeByVue === '1' || couponItem.couponTypeByVue === '2' }">
  <div class="left">
    <p class="item-discount">{{ couponItem.CouponDetails[0].DiscountAmount }}</p>

    <p class="item-limit-discount">满{{ couponItem.CouponDetails[0].Amount }}可用</p>
  </div>

  <div class="item-split"></div>

  <div class="right">
    <header class="item-title txt-over-hide">{{ couponItem.Title }}</header>

    <p class="item-limit-service txt-over-hide" v-if="couponItem.ServiceTypes && couponItem.ServiceTypes.length >  0">
      <span class="service-type" v-for="(type, t_index) in couponItem.ServiceTypes"><span v-if="t_index > 0">、</span>{{ type.ServiceName }}</span>
    </p>
    <p class="item-limit-service" v-else>全品类可用</p>

    <p class="item-limit-date txt-over-hide">{{ couponItem.CreateTime | formatDate }}至{{ couponItem.EndTime | formatDate }}</p>
  </div>

  <img v-if="couponItem.couponTypeByVue === '1'" class="item-status" src="../../assets/images/coupon_overdued.png">
  <img v-if="couponItem.couponTypeByVue === '2'" class="item-status" src="../../assets/images/coupon_overdued.png">
</li>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'coupon-item',
  data () {
    return {
      isShow: false//目前未显示“立即使用”按钮，ios将在3.4版本加入跳转，android将在3.5版本加入
    }
  },
  props: ['couponItem'],
  methods: {
    useCoupon(item) {
      let postData = {
        'Meta': {
          'ErrorCode': '0',
          'ErrorMsg': ''
        },
        'Body': {
          'ObjectApns': {
            'Type': '2',
            'CouponServiceItem': item
          }
        }
      }
      if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
        function setupWebViewJavascriptBridge(callback) {
          if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
          }
          if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
          }
          window.WVJBCallbacks = [callback];
          var WVJBIframe = document.createElement('iframe');
          WVJBIframe.style.display = 'none';
          WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
          document.documentElement.appendChild(WVJBIframe);
          setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
          }, 0)
        }
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('iosWebJsHandle', postData,
            function(response) {
            }
          );
        });
      }
      if (browser.versions.android) {
        var data = JSON.stringify(postData);
        window.android.androidWebJsHandle(data);
      }
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
      return year + '-' + month + '-' + day;
    }
  }
}
</script>

<style scoped lang="scss">
.list-item
{
  box-sizing: border-box;
  height: 2.4rem;
  margin: 0.32rem 0.32rem 0;
  padding-top: 0.426667rem;
  padding-bottom: 0.32rem;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  border-radius: 4px;
  background-image: url(../../assets/images/coupon_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .left
  {
    flex-shrink: 0;
    -webkit-flex-shrink: 0;
    width: 2.666667rem;
    overflow: hidden;
    text-align: center;
    .item-discount
    {
      color: #ff1b56;
      height: 45px;
      line-height: 45px;
      font-size: 45px;
      &::before
      {
        content: '￥';
        font-size: 18px;
      }
    }
    .item-limit-discount
    {
      display: block;
      margin-top: 0.186667rem;
      color: #ff1b56;
      font-size: 13px;
    }
  }
  .item-split
  {
    width: 1px;
    height: 100%;
    margin-right: 0.373333rem;
    border-left: 1px dashed #ccc;
  }
  .right
  {
    flex-grow: 1;
    -webkit-flex-grow: 1;
    width: 1px;
    height: 100%;
    .item-title
    {
      line-height: 100%;
      color: #333;
      font-size: 18px;
    }
    .item-limit-service
    {
      line-height: 100%;
      margin-top: 0.266667rem;
      padding-right: 0.266667rem;
      color: #666;
      font-size: 11px;
    }
    .item-limit-date
    {
      line-height: 100%;
      margin-top: 0.16rem;
      color: #666;
      font-size: 11px;
    }
  }
  .item-status
  {
    width: 2.08rem;
    margin-right: 0.106667rem;
  }
}
.list-item.gray
{
  background-image: url(../../assets/images/coupon_bg_gray.png);
  .left
  {
    .item-discount
    {
      color: #ccc;
    }
    .item-limit-discount
    {
      color: #cdcdcd;
    }
  }
  .right
  {
    .item-title
    {
      color: #ccc;
    }
    .item-limit-service,
    .item-limit-date
    {
      color: #cdcdcd;
    }
  }
}
</style>
