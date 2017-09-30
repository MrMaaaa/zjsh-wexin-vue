<template>
<div>
  <keep-alive>
    <router-view class="menu-router-view"></router-view>
  </keep-alive>
  <nav ref="btnWraper" class="menu flex-row">
    <router-link :to="{ name: 'index' }" class="menu-item menu-item1" active-class="active">
      <i class="menu-icon"></i>
      <span class="menu-name">首页</span>
    </router-link>
    <router-link :to="{ name: 'activity' }" class="menu-item menu-item2" active-class="active">
      <i class="menu-icon"></i>
      <span class="menu-name">活动</span>
    </router-link>
    <router-link :to="{ name: 'order' }" class="menu-item menu-item3" active-class="active">
      <i class="menu-icon"></i>
      <span class="menu-name">订单</span>
    </router-link>
    <router-link :to="{ name: 'user' }" class="menu-item menu-item4" active-class="active">
      <i class="menu-icon"></i>
      <span class="menu-name">我的</span>
    </router-link>
  </nav>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'menu',
  data() {
    return {
    }
  },
  mounted() {
  },
  computed: {
    ...mapState(['AppName']),
  }
}
</script>

<style scoped lang="scss">
.menu-router-view
{
  box-sizing: border-box;
  position: relative;
  padding-bottom: 1.333333rem;
}
.menu
{
  position: fixed;
  bottom: 0;
  left: 0;
  transform: translateZ(0);
  z-index: 10000;
  width: 100%;
  height: 1.333333rem;
  border-top: 1px solid #e4eaee;
  background-color: #fff;
  -webkit-justify-content: space-around;
  justify-content: space-around;
  .menu-item
  {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-top: 0.2rem;
    color: #666;
    font-size: 10px;
    text-align: center;
    .menu-icon
    {
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
      margin: 0 auto;
    }
    .menu-name
    {
      display: block;
      line-height: 100%;
      margin-top: 0.146667rem;
    }
    &.active
    {
      .menu-name
      {
        color: #27b8f3;
      }
    }
    &.menu-item .menu-icon
    {
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    &.menu-item1 .menu-icon
    {
      background-image: url(../assets/images/home.png);
    }
    &.menu-item1.active .menu-icon
    {
      background-image: url(../assets/images/home-active.png);
    }
    &.menu-item2 .menu-icon
    {
      background-image: url(../assets/images/activity.png);
    }
    &.menu-item2.active .menu-icon
    {
      background-image: url(../assets/images/activity-active.png);
    }
    &.menu-item3 .menu-icon
    {
      background-image: url(../assets/images/order.png);
    }
    &.menu-item3.active .menu-icon
    {
      background-image: url(../assets/images/order-active.png);
    }
    &.menu-item4 .menu-icon
    {
      background-image: url(../assets/images/user.png);
    }
    &.menu-item4.active .menu-icon
    {
      background-image: url(../assets/images/user-active.png);
    }
  }
}
</style>