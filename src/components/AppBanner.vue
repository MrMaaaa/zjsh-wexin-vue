<template>
<div class="index-banner" v-if="show && img !== ''">
  <div class="wrapper"></div>

  <div class="banner">
    <img class="img-banner" @click="routerToBanner" :src="img">

    <img class="btn-close" @click="close" src="../assets/images/coupon_close.png">
  </div>
</div>
</template>

<script>
import Utils from '../config/utils.js';

export default {
  name: 'banner',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
  },
  methods: {
    close() {
      this.$emit('update:show', false);
    },
    routerToBanner() {
      this.close();
      if (this.url.indexOf('activity/notify/index.html') > -1) {
        window.location.href = this.url;
      } else {
        this.$router.push({
          name: Utils.urlToRoute(this.url),
        });
      }
    }
  }
}
</script>

<style scoped lang="scss">
.index-banner
{
  position: fixed;
  top: 0;
  left: 0;
  transform: translateZ(0);
  z-index: 99999;
  width: 100%;
  height: 100%;
  .wrapper
  {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
  }
  .banner
  {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: auto;
    .img-banner
    {
      width: 100%;
    }
  }
  .btn-close
  {
    position: absolute;
    top: -0.333333rem;
    right: -0.333333rem;
    width: 0.666667rem;
    height: auto;
  }
}
</style>