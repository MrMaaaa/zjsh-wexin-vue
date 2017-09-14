<template>
<div class="m-confirm" v-show="showConfirm == '1'">
  <div class="wrapper" @click="$emit('confirm-finish')"></div>

  <div class="container">
    <header class="container-title">确认完成<img class="btn-close" @click="$emit('confirm-finish')" src="../../assets/images/close.png"></header>
    <p class="container-desc">{{ orderTitle }}</p>
    <a class="btn-submit" :class="{ disable: isSubmit == '0' }" @click="orderConfirm">服务已完成</a>
    <router-link class="btn-complaint" :to="{ name: 'order_complaint_reason', params: { orderId: orderId } }">服务遇到问题？</router-link>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'm-dialog-confirm',
  data () {
    return {
    }
  },
  props: ['showConfirm', 'orderId', 'orderTitle'],
  mounted() {
  },
  methods: {
    orderConfirm() {
      axios.post(API.CompleteOrderEx, qs.stringify({
        Token: this.Token,
        OrderId: this.orderId,
      })).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.$emit('confirm-finish', res.data.Meta);
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
    isSubmit() {
      return '1';
    }
  },
}
</script>

<style scoped lang="scss">
.m-confirm
{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  .wrapper
  {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
  }
  .container
  {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: 1.333333rem;
    background-color: #fff;
    .container-title
    {
      position: relative;
      line-height: 100%;
      padding: 0.413333rem 0;
      color: #333639;
      font-size: 16px;
      text-align: center;
      .btn-close
      {
        position: absolute;
        left: 0.3rem;
        top: 0.3rem;
        width: 0.333333rem;
      }
    }
    .container-desc
    {
      padding: 0.4rem;
      color: #333;
      font-size: 15px;
      text-align: center;
    }
    .btn-submit
    {
      display: block;
      width: 8.666667rem;
      height: 1.146667rem;
      line-height: 1.146667rem;
      margin: 0.533333rem auto 0.4rem;
      border-radius: 4px;
      background-color: #f56165;
      color: #fff;
      font-size: 16px;
      text-align:center;
      &.disable
      {
        opacity: 0.8;
        pointer-events: none;
      }
    }
    .btn-complaint
    {
      display: block;
      width: 8.666667rem;
      margin: 0.2rem auto 0.4rem;
      color: #27b8f3;
      font-size: 14px;
      text-align:center;
    }
  }
}
</style>