<template>
<div class="m-confirm">
  <div class="wrapper" @click="close"></div>

  <div class="container">
    <header class="container-title">确认完成<img class="btn-close" @click="close" src="../assets/images/close2.png"></header>
    <p class="container-desc txt-over-hide">{{ options.PopTitle }}</p>
    <a class="btn-submit" @click="orderConfirm">服务已完成</a>
    <router-link class="btn-complaint" :to="{ name: 'order_complaint_reason', params: { orderId: this.options.OrderId } }">服务遇到问题？</router-link>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'm-dialog-confirm',
  data () {
    return {
      orderId: '123'
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          PopType: '2',
          OrderId: '',
          OrderCode: '',
          PopTitle: '',
          PopDescription: '',
          ServiceTypeId: ''
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    close() {
      let opt = this.options;
      opt.PopType = '';
      this.$emit('update:options', opt);
    },
    orderConfirm() {
      this.$loading.open();
      this.$store.dispatch('CompleteOrderEx', {
        OrderId: this.options.OrderId
      })
      .then(res => {
        this.$loading.close();
        this.$alert('确认成功');
        this.close();
        this.$emit('complete', res);
      })
      .catch(err => {
        this.$loading.close();
        this.$alert(err.message || err.ErrorMsg);
      });
    },
  },
  computed: {
    ...mapState(['ALERT_MSG']),
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
      color: #b1b1b1;
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