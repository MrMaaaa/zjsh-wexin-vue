<template>
  <div>
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
    <footer class="menu flex-row">
      <router-link :to="{ name: 'index' }" class="menu-item menu-item1" active-class="active">
        <i class="menu-icon"></i>
        <span class="menu-name">首页</span>
      </router-link>
      <router-link :to="{ name: 'order' }" class="menu-item menu-item2" active-class="active">
        <i class="menu-icon"></i>
        <span class="menu-name">订单</span>
      </router-link>
      <router-link :to="{ name: 'user' }" class="menu-item menu-item3" active-class="active">
        <i class="menu-icon"></i>
        <span class="menu-name">我的</span>
      </router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'menu',
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
.router-view
{
  box-sizing: border-box;
  position: relative;
  padding-bottom: 1.333333rem;
}
.flex-row
{
  display: box;              /* OLD - Android 4.4- */
  display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
  display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
  display: -ms-flexbox;      /* TWEENER - IE 10 */
  display: -webkit-flex;     /* NEW - Chrome */
  display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-align-items: center;
  align-items: center;
}
.menu
{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
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
      display: inline-block;
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
      background-image: url(../assets/images/order.png);
    }
    &.menu-item2.active .menu-icon
    {
      background-image: url(../assets/images/order-active.png);
    }
    &.menu-item3 .menu-icon
    {
      background-image: url(../assets/images/user.png);
    }
    &.menu-item3.active .menu-icon
    {
      background-image: url(../assets/images/user-active.png);
    }
  }
}
</style>