<template>
<div>
  <section class="section address flex-row" @click="routeTo({ name: 'address_list' })">
    <div class="left flex-row">
      <img class="icon-header" src="../../assets/images/nearby.png">

      <p v-if="OrderInfo.Address.Contact === undefined" class="txt-light">请选择一个服务地址</p>

      <p v-else class="address-info txt-normal">
        <span class="txt-over-hide">{{ OrderInfo.Address.Contact }}，{{ OrderInfo.Address.Address1 }}{{ OrderInfo.Address.Address2 }}</span>
        <span>{{ OrderInfo.Address.PhoneNumber }}</span>
      </p>
    </div>

    <img class="icon-link" src="../../assets/images/link.png">
  </section>

  <section class="section type flex-row">
    <img class="icon-header" src="../../assets/images/orders_type.png">

    <span class="txt-light">请选择{{ ThreeServiceName }}类型</span>
  </section>

  <ul class="type-list">
    <li class="list-item flex-row" v-for="(item,index) in serviceList" @click="selectType(item, index)">
      <img class="type-img" :src="item.IconUrl">

      <div class="flex-row list-right">
        <div class="type-info">
          <p class="info-name">{{ item.ServiceName }}</p>
          <p class="info-price">{{ item.Price }}元/{{ item.Unit }}</p>
        </div>

        <img class="icon-selector" v-show="typeIndex != index" src="../../assets/images/orders_choose.png">
        <img class="icon-selector" v-show="typeIndex == index" src="../../assets/images/orders_pitch_on.png">
      </div>
    </li>
  </ul>

  <section class="section amount flex-row">
    <div class="flex-row">
      <img class="icon-header" src="../../assets/images/orders_amount.png">

      <span class="txt-normal">服务数量</span>
    </div>

    <div class="flex-row">
      <img class="icon-amount" v-show="isReduce" @click="amountReduce" src="../../assets/images/orders_reduce.png">
      <img class="icon-amount" v-show="!isReduce" src="../../assets/images/orders_reduce_disable.png">
      <span class="amount-value" v-show="!isMaunalInput">{{ OrderInfo.Amount }}</span>
      <input class="amount-value" type="text" @input="inputFilter" @blur="inputBlurCheck" :value="OrderInfo.Amount" v-show="isMaunalInput">
      <img class="icon-amount" v-show="isAdd" @click="amountAdd" src="../../assets/images/orders_add.png">
      <img class="icon-amount" v-show="!isAdd" src="../../assets/images/orders_add_disable.png">
    </div>
  </section>

  <section class="section time flex-row" @click="routeTo({ name: 'order_service_time' })">
    <div class="flex-row">
      <img class="icon-header" src="../../assets/images/orders_time.png">

      <span class="txt-light" v-if="OrderInfo.DateTime === ''">请选择服务时间</span>
      <span v-else>{{ OrderInfo.DateTime }}</span>
    </div>
    <img class="icon-link" src="../../assets/images/link.png">
  </section>

  <section class="section one-safe flex-row" v-show="oneSafe.isShow">
    <div class="flex-row">
      <img class="icon-header" src="../../assets/images/orders_safe.png">

      <span class="txt-normal">1元保险：迟到、爽约赔付</span>
      <img class="icon-one-safe" @click="oneSafeAlert" src="../../assets/images/orders_alert.png">
    </div>

    <div class="selector" :class="{ active: oneSafe.isUsed }" @click="toggleOneSafe">
      <div class="toggle"></div>
    </div>
  </section>

  <section class="section discount">
    <ul class="discount-list" v-if="activityList.length > 0">
      <li class="list-item-discount">-￥{{ discountAmount | amountFormat }}</li>
      <li class="list-item" v-for="item in activityList">{{ item.Title }}满<span class="txt-price">{{ item.Upper }}</span>减<span class="txt-price">{{ item.Minus }}</span></li>
    </ul>

    <div class="discount-coupon flex-row">
      <span>红包</span>

      <div class="flex-row" @click="routeTo({ name: 'order_coupon_select' })">
        <span class="txt-price" v-if="CouponSelected.NoUse === '0'">-￥{{ CouponSelected.CouponDetails[0].DiscountAmount | amountFormat }}</span>
        <span class="txt-price" v-else-if="CouponSelected.NoUse === '1'">不使用红包</span>
        <span class="txt-price" v-else>暂无可用红包</span>
        <img class="icon-link" src="../../assets/images/link.png">
      </div>
    </div>

    <div class="discount-split"></div>

    <p class="discount-total" v-if="CouponSelected.NoUse === '0'">已优惠￥{{ (discountAmount + Number(CouponSelected.CouponDetails[0].DiscountAmount)) | amountFormat }}</p>
    <p class="discount-total" v-else>已优惠￥{{ discountAmount | amountFormat }}</p>
  </section>

  <section class="section remark flex-row">
    <img class="icon-header" src="../../assets/images/orders_remark.png">

    <input class="remark-input" type="text" v-model="OrderInfo.ServiceContent" placeholder="备注留言">
  </section>

  <section class="bottom-button">
    <a class="btn-submit" @click="orderSubmit">立即支付 ￥{{ payAmount | amountFormat }}</a>
  </section>

  <section class="one-safe-alert" v-show="oneSafe.isOpenAlert">
    <div class="wrapper" @click="oneSafe.isOpenAlert=false"></div>

    <div class="content">
      <div class="title">{{ oneSafe.title }}</div>
      <div class="split-line"></div>
      <p class="info">{{ oneSafe.content }}</p>
      <div class="split-line"></div>
      <p class="tips">轻触下方的“好的”按钮，即表示你同意<a class="safe-url" :href="oneSafe.url" target="_blank">《保险协议》</a></p>
      <div class="split-line"></div>
      <a class="btn-ok" @click="oneSafe.isOpenAlert=false">好的</a>
    </div>
  </section>

  <m-loading :bg-style="bgLoading" :txt-top="txtLoading" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import OrderServiceTime from './OrderServiceTime';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';
import Common from '../../config/Common';

export default {
  name: 'order_place',
  data() {
    return {
      serviceList: [],
      activityList: [],
      couponList: [],
      discountAmount: 0,
      countStep: 0,
      maxCount: -1,
      minCount: -1,
      isAdd: false,
      isReduce: false,
      typeIndex: -1,
      unitPrice: 0,
      isMaunalInput: false, // 是否允许手动输入数量
      oneSafe: {
        title: '',
        content: '',
        url: '',
        isShow: false,
        isOpenAlert: false,
        isUsed: true
      },
      thisThreeServiceId: '', // 用来和vuex中的id作比较
      isLoading: true,
      bgLoading: '1',
      txtLoading: '正在获取服务信息…',
    }
  },
  mounted() {
    this.thisThreeServiceId = this.ThreeServiceId;
    this.getCouponList();
    this.getUserAddress();
  },
  activated() {
    if(this.thisThreeServiceId !== this.ThreeServiceId) {
      this.thisThreeServiceId = this.ThreeServiceId;
      this.serviceList.splice(0);
      this.getServiceDetail();
    }

    // 防止网络问题导致没有刷新
    if(this.serviceList.length == 0) {
      this.getServiceDetail();
    }
  },
  methods: {
    oneSafeAlert() {
      this.oneSafe.isOpenAlert = true;
    },
    valueFromUrl(key) {
      var url = window.location.search;
      var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
      var result = url.substr(1).match(reg);
      return result ? decodeURIComponent(result[2]) : null;
    },
    getServiceDetail() {
      this.isLoading = true;
      this.txtLoading = '正在获取服务信息……';
      axios.post(API.QueryServicePrice, qs.stringify({
        ServiceId: this.ThreeServiceId
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isLoading = false;
        this.txtLoading = '';
        this.bgLoading = '2';
        if (res.data.Meta.ErrorCode === '0') {
          this.serviceList = res.data.Body.Service.SubItems;

          // 如果之前已经选择过对应服务的四级服务，显示之，否则显示第一个服务品类
          if(this.OrderInfo.FourServiceId) {
            this.typeIndex = -1;
            let isMatch = false;
            res.data.Body.Service.SubItems.map((value, index) => {
              if (value.ServiceId === this.OrderInfo.FourServiceId) {
                isMatch = true;
                this.selectType(this.serviceList[index], index);
              }
            });
            if(!isMatch) {
              this.selectType(this.serviceList[0], 0);
            }
          } else {
            this.selectType(this.serviceList[0], 0);
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.isLoading = false;
        this.txtLoading = '';
        this.bgLoading = '2';
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    getServiceActivity() {
      // 初始化折扣信息与折扣金额
      this.activityList.splice(0);
      this.discountAmount = 0;

      axios.post(API.GetActivityEx, qs.stringify({
        Token: this.Token,
        ServiceId: this.OrderInfo.FourServiceId
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          // 活动信息清洗
          res.data.Body.ServiceTypeRules.map(value => {
            value.Details.map(val => {
              let dis = 0, upp = 0;
              val.Rules.map(v => {
                // 计算当前优惠规则的最大折扣
                if(v.Upper >= upp && v.Upper <= this.payAmount) {
                  upp = Number(v.Upper);
                  dis = Number(v.Minus);
                }

                // 遍历每一条优惠信息（无论是否满足）
                this.activityList.push({
                  Title: val.Title,
                  Upper: Number(v.Upper),
                  Minus: Number(v.Minus),
                });
              });
              // 累加满足的折扣金额
              this.discountAmount += dis;
            });
          });
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    getCouponList() {
      axios.post(API.GetCoupons, qs.stringify({
        Token: this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          // 红包分类
          let date = new Date();
          res.data.Body.CouponList.forEach((value, index) => {
            // 未使用红包
            if (date.getTime() < Number(value.EndTime + '000') && value.IsUsed === '0') {
              this.couponList.push(value);
            }
          });
          this.getCouponMaxAmount();
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    getCouponMaxAmount() {
      let maxDisCoupon = null;
      let maxDis = 0;
      this.couponList.map(value => {
        if (this.ThreeServiceId === value.ServiceItem.ServiceId && maxDis <= value.CouponDetails[0].DiscountAmount) {
          maxDisCoupon = value;
          maxDis = value.CouponDetails[0].DiscountAmount;
        }
      });

      // 遍历对象赋值
      if (maxDisCoupon) {
        let keyArr = Object.keys(maxDisCoupon);
        keyArr.map(value => {
          this.CouponSelected[value] = maxDisCoupon[value];
        });
        this.CouponSelected.NoUse = '0';
      } else {
        this.CouponSelected.NoUse = '1';
      }
    },
    getUserAddress() {
      axios.post(API.GetAddress, qs.stringify({
        Token: this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          if(res.data.Body.length >= 1) {
            if(!this.OrderInfo.Address.Id) {
              this.OrderInfo.Address = res.data.Body[0];
            }
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(function(error) {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    amountReduce() {
      this.OrderInfo.Amount -= this.countStep;
      this.amountCheck();
    },
    amountAdd() {
      this.OrderInfo.Amount += this.countStep;
      this.amountCheck();
    },
    amountCheck() {
      if(this.OrderInfo.Amount <= this.minCount) {
        this.isReduce = false;
      } else {
        this.isReduce = true;
      }
      if(this.OrderInfo.Amount >= this.maxCount) {
        this.isAdd = false;
      } else {
        this.isAdd = true;
      }
    },
    selectType(item, index) {
      // 切换四级品类时
      index = Number(index);

      // 如果下标不同
      if(this.typeIndex != index) {
        this.typeIndex = index;
        // 获取四级服务信息
        this.OrderInfo.FourServiceId = item.ServiceId;
        this.OrderInfo.SellType = item.SellType;
        this.OrderInfo.SpecialType = item.SpecialType;
        this.OrderInfo.Price = item.Price;

        // 获取id对应活动信息
        this.getServiceActivity();

        // 修改单价、数量步长、最大最小数量
        this.unitPrice = Number(item.Price);
        this.countStep = Number(item.CountStep);
        this.maxCount = Number(item.MaxCount);
        this.minCount = Number(item.MinCount);

        // 初始化数量
        this.OrderInfo.Amount = this.minCount;

        // 判断是否可增减
        this.amountCheck();

        // 判断是否可手动输入
        this.isMaunalInput = item.MaunalInput === '1' ? true : false;

        // 1元保险
        this.oneSafe.isShow = item.IsEnableClaims === '1' ? true : false;
        this.OrderInfo.IsClaims = item.IsEnableClaims === '1' ? '1' : '0';
        if (this.oneSafe.isShow) {
          this.oneSafe.isUsed = true;
          this.oneSafe.title = item.ClaimsNote.Title;
          this.oneSafe.content = item.ClaimsNote.Content;
          this.oneSafe.url = item.ClaimsNote.Url;
        } else {
          this.oneSafe.isUsed = false;
          this.oneSafe.title = '';
          this.oneSafe.content = '';
          this.oneSafe.url = 'item.ClaimsNote.Url';
        }

        // 保存订单信息
        this.$store.commit('SetOrderInfo', this.OrderInfo);
      }
    },
    inputFilter(evt) {
      let val = evt.target.value;
      if (isNaN(val)) {
        //非数字
        evt.target.value = this.minCount;
      } else if (val > this.maxCount) {
        evt.target.value = this.maxCount;
      }
      this.OrderInfo.Amount = Number(evt.target.value);
    },
    inputBlurCheck(evt) {
      if(evt.target.value < this.minCount || !evt.target.value) {
        evt.target.value = this.minCount;
      } else if(evt.target.value > this.maxCount) {
        evt.target.value = this.maxCount;
      } else if(Number(evt.target.value) % this.countStep > 0) {
        // 如果输入的值除以步长存在余数，向上补齐
        evt.target.value = Number(evt.target.value) + this.countStep - Number(evt.target.value) % this.countStep;
      }

      this.OrderInfo.Amount = Number(evt.target.value);
      this.amountCheck();
    },
    toggleOneSafe() {
      if (this.oneSafe.isShow) {
        this.oneSafe.isUsed = !this.oneSafe.isUsed;
        this.OrderInfo.IsClaims = this.oneSafe.isUsed ? '1' : '0';
      }
    },
    orderSubmit() {
      if(!this.OrderInfo.Address.Id) {
        this.alert('请选择服务地址');
      } else if(this.OrderInfo.DateTime === '') {
        this.alert('请选择服务时间');
      } else {
        this.isLoading = true;
        this.txtLoading = '正在提交订单……';
        axios.post(API.SubmitOrder, qs.stringify({
          Token: this.Token,
          ServiceId: this.OrderInfo.FourServiceId,
          SpecialType: this.OrderInfo.SpecialType,
          OrderFrom: this.OrderInfo.OrderFrom,
          ServiceAddressId: this.OrderInfo.Address.Id,
          Total: this.OrderInfo.Amount,
          ServiceStartAt: this.OrderInfo.DateTime,
          Price: this.OrderInfo.Price,
          SellType: this.OrderInfo.SellType,
          ServiceContent: this.OrderInfo.ServiceContent,
          IsClaims: this.OrderInfo.IsClaims,
        }), {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          this.isLoading = false;
          if (res.data.Meta.ErrorCode === '0') {
            // 订单支付页所用数据
            this.$store.commit('SetOrderInfo', this.OrderInfo);
            this.$store.commit('SetOrderIdForPay', res.data.Body.OrderId);

            // 如果需要使用红包，需要在传入的总金额中减去红包的金额

            // 原始总价
            let p = Number(this.OrderInfo.Amount * this.OrderInfo.Price);

            // 减去一元保险
            p += this.OrderInfo.IsClaims == '1' ? 1 : 0;

            // 减去红包折扣
            p -= this.OrderInfo.CouponSelected.NoUse === '1' ? 0 : Number(this.OrderInfo.CouponSelected.CouponDetails[0].DiscountAmount);

            this.orderPay(res.data.Body.OrderId, p, this.OrderInfo.CouponSelected.NoUse === '1' ? '' : this.OrderInfo.CouponSelected.Id);
          } else {
            this.alert(res.data.Meta.ErrorMsg);
          }
        }).catch(error => {
          this.isLoading = false;
          this.alert(this.ALERT_MSG.NET_ERROR);
        });
      }
    },
    orderPay(orderId, price, couponId) {
      this.isLoading = true;
      this.bgLoading = '2';
      this.txtLoading = '';
      axios.post(API.GetWxpaySign, qs.stringify({
        Token: this.Token,
        OrderId: orderId,
        PayFrom: '0', // 0:微信公众号 1:app
        OpenId: this.OpenId,
        WxPay: price,
        BalancePay: '0',
        CouponId: couponId || '',
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isLoading = false;
        const that = this;
        if (res.data.Meta.ErrorCode === '0') {
          function onBridgeReady() {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": res.data.Body.WxpaySign.appid,
                "timeStamp": res.data.Body.WxpaySign.timestamp,
                "nonceStr": res.data.Body.WxpaySign.noncestr,
                "package": res.data.Body.WxpaySign.package,
                "signType": "MD5",
                "paySign": res.data.Body.WxpaySign.sign
              },
              function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  that.$router.push({
                    name: 'order_pay_status',
                    params: {
                      orderId: orderId
                    }
                  });
                } else if (res.err_msg == "get_brand_wcpay_request:cancel" || res.err_msg == "get_brand_wcpay_request:fail") {
                  that.alert(that.ALERT_MSG.PAY_ERROR);
                } else {
                  that.alert(res.err_msg);
                }
              }
            );
          }
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
          } else {
            onBridgeReady();
          }
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    routeTo(option={name:''}, isReplace=false) {
      // 保存订单信息
      this.$store.commit('SetOrderInfo', this.OrderInfo);

      if (isReplace) {
        this.$router.replace(option);
      } else {
        this.$router.push(option);
      }
    },
  },
  computed: {
    ...mapState(['Token', 'OpenId', 'ThreeServiceId', 'ThreeServiceName', 'OrderInfo', 'ALERT_MSG']),
    CouponSelected() {
      return this.OrderInfo.CouponSelected;
    },
    payAmount() {
        // 服务总价
      let serviceTotalAmount = Number(this.unitPrice) * Number(this.OrderInfo.Amount);

      // 折扣
      let discountTotal = Number(this.discountAmount) + Number(this.CouponSelected.NoUse === '0' ? this.CouponSelected.CouponDetails[0].DiscountAmount : 0);

      // 是否使用一元赔付
      let oneSafeAmount = this.oneSafe.isUsed ? 1 : 0;

      return serviceTotalAmount + oneSafeAmount - discountTotal;
    },
  },
  filters: {
    amountFormat(amount) {
      let a = amount.toString();
      if(a.indexOf('.') === -1) {
        return amount + '.00';
      } else {
        return a.split('.')[0] + '.' + (a.split('.')[1].length === 1 ? a.split('.')[1] + '0' : a.split('.')[1]);
      }
    }
  },
  components: {
    OrderServiceTime,
  },
}
</script>

<style scoped lang="scss">
.router-view
{
  height: auto;
  padding-top: 0.32rem;
  padding-bottom: 2.213333rem;
  background-color: #eef2f5;
}
.txt-light
{
  color: #999;
}
.txt-normal
{
  color: #333639;
}
.txt-price
{
  color: #f56165;
}
.section
{
  position: relative;
  height: 1.733333rem;
  padding-left: 0.413333rem;
  padding-right: 0.44rem;
  background-color: #fff;
  font-size: 14px;
  &:not([class*='address'])
  {
    margin-top: 0.266667rem;
  }
  &.address
  {
    .left
    {
      justify-content: flex-start;
      -webkit-justify-content: flex-start;
      flex-grow: 1;
      -webkit-flex-grow: 1;
      margin-right: 0.266667rem;
      .icon-header
      {
        flex-shrink: 0;
        -webkit-flex-shrink: 0;
      }
      .address-info
      {
        flex-grow: 1;
        -webkit-flex-grow: 1;
        display: block;
        width: 1px;
        span
        {
          display: block;
        }
      }
    }
  }
  &.address::after
  {
    content: '';
    position: absolute;
    bottom: 0.053333rem;
    left: 0;
    display: block;
    width: 100%;
    height: 4px;
    background-image: url(../../assets/images/orders_line.png);
  }
  &.type
  {
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
  }
  &.amount
  {
    .icon-amount
    {
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
    }
    .amount-value
    {
      width: 1.333333rem;
      height: 0.666667rem;
      line-height: 0.666667rem;
      margin: 0 0.586667rem;
      border: none;
      outline: none;
      background-color: #f3f3f3;
      text-align: center;
      font-size: 14px;
    }
  }
  &.one-safe
  {
    .icon-one-safe
    {
      width: 0.346667rem;
      height: 0.346667rem;
      margin-left: 0.12rem;
      vertical-align: middle;
    }
    .selector
    {
      position: relative;
      width: 1.333333rem;
      height: 0.746667rem;
      border: 1px solid #ddd;
      border-top-left-radius: 0.373333rem;
      border-top-right-radius: 0.373333rem;
      border-bottom-left-radius: 0.373333rem;
      border-bottom-right-radius: 0.373333rem;
      background-color: #fff;
      &.active
      {
        border-color: #f56165;
        background-color: #f56165;
        .toggle
        {
          transform: translateX(0.666667rem);
          transition: all .2s;
        }
      }
      .toggle
      {
        width: 0.666667rem;
        height: 0.666667rem;
        margin-top: 0.02rem;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 3px 2px rgba(35,35,35,.3);
        transition: all .2s;
      }
    }
  }
  &.discount
  {
    height: auto;
    padding-top: 0.266667rem;
    padding-bottom: 0.266667rem;
    padding-left: 0;
    padding-right: 0;
    .icon-link
    {
      margin-left: 0.133333rem;
    }
    .discount-list
    {
      position: relative;
      // margin-top: 0.266667rem;
      padding-top: 0.48rem;
      padding-bottom: 0.48rem;
      padding-left: 0.413333rem;
      padding-right: 0.44rem;
      background-color: #fff;
      font-size: 14px;
      .list-item-discount
      {
        position: absolute;
        top: 50%;
        right: 0.44rem;
        transform: translateY(-50%);
        color: #f56165;
      }
      .list-item
      {
        &:not(:last-child)
        {
          margin-bottom: 0.48rem;
        }
      }
    }
    .discount-coupon
    {
      padding-left: 0.413333rem;
      padding-right: 0.44rem;
    }
    .discount-split
    {
      height: 1px;
      margin: 0.266667rem 0;
      background-color: #eef2f5;
    }
    .discount-total
    {
      padding-left: 0.413333rem;
      padding-right: 0.44rem;
      text-align: right;
    }
  }
  &.remark
  {
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    .remark-input
    {
      border: none;
      outline: none;
      font-size: 14px;
    }
  }
  .icon-header
  {
    display: block;
    width: 0.586667rem;
    margin-right: 0.32rem;
  }
  .icon-link
  {
    display: block;
    width: 0.2rem;
    vertical-align: middle;
  }
}
.type-list
{
  padding-left: 0.533333rem;
  background-color: #fff;
  .list-item
  {
    height: 2.053333rem;
    &:not(:first-child)
    {
      .list-right
      {
        border-top: 1px solid #eef2f5;
      }
    }
    .type-img
    {
      display: block;
      width: 1.733333rem;
      height: 1.733333rem;
      margin-right: 0.426667rem;
      flex-shrink: 0;
      -webkit-flex-shrink: 0;
    }
    .list-right
    {
      width: 100%;
      height: 100%;
    }
    .type-info
    {
      .info-name
      {
        line-height: 100%;
        color: #333639;
      }
      .info-price
      {
        line-height: 100%;
        margin-top: 0.533333rem;
        color: #f56165;
      }
    }
    .icon-selector
    {
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
      margin-right: 0.666667rem;
    }
  }
}
.bottom-button
{
  position: fixed;
  bottom: 0;
  left: 0;
  transform: translateZ(0);
  width: 100%;
  height: 1.946667rem;
  background-color: #fff;
  .btn-submit
  {
    display: block;
    width: 8.666667rem;
    height: 1.146667rem;
    line-height: 1.146667rem;
    border-radius: 4px;
    margin: 0.4rem auto;
    background-color: #f66165;
    color: #fff;
    text-align: center;
    font-size: 16px;
  }
}
.one-safe-alert
{
  position: fixed;
  top: 0;
  left: 0;
  transform: translateZ(0);
  width: 100%;
  height: 100%;
  .wrapper
  {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
  }
  .content
  {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    border-radius: 4px;
    background-color: #fff;
    .title
    {
      padding: 0.266667rem 0;
      font-size: 16px;
      text-align: center;
    }
    .split-line
    {
      height: 1px;
      background-color: #eef2f5;
    }
    .info
    {
      padding: 0.266667rem;
      font-size: 14px;
    }
    .tips
    {
      padding: 0.266667rem;
    }
    .safe-url
    {
      color: #27b8f3;
    }
    .btn-ok
    {
      display: block;
      padding: 0.266667rem 0;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>