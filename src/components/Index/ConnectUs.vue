<template>
<div>
  <div class="row-group">
    <div class="row flex-row">
      <span class="left">公司名称</span>

      <span class="right">杭州芸瑾网络科技有限公司</span>
    </div>
  </div>

  <div class="row-group">
    <div class="row flex-row">
      <span class="left">客服热线</span>

      <a class="tel right" href="tel:4008-262-056">4008-262-056</a>
    </div>
  </div>

  <div class="row-group">
    <div class="row flex-row">
      <span class="left">工作时间</span>

      <span class="right">周一至周五 9:00-18:00</span>
    </div>

    <div class="row-split"></div>

    <div class="row flex-row">
      <span class="left">客服时间</span>

      <span class="right">周一至周日 8:00-21:00</span>
    </div>
  </div>

  <div class="row-group">
    <div class="row flex-row">
      <span class="left">微信公众号</span>

      <span class="right">助家生活服务号</span>
    </div>

    <div class="row-split"></div>

    <div class="row flex-row">
      <span class="left">微信号</span>

      <span class="right">huahffhhv</span>
    </div>

    <div class="row-split"></div>

    <div class="row flex-row">
      <span class="left">客服QQ</span>

      <span class="right">1372285990</span>
    </div>
  </div>

  <div class="row-group">
    <div class="row flex-row">
      <span class="left">商务合作邮箱</span>

      <a class="right" href="mailto:lidanyang@homepaas.com">lidanyang@homepaas.com</a>
    </div>

    <div class="row-split"></div>

    <div class="row flex-row">
      <span class="left">意见反馈邮箱</span>

      <a class="right" href="mailto:lidanyang@homepaas.com">lidanyang@homepaas.com</a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'order_connect_us',
  data() {
    return {
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.router-view
{
  overflow: auto;
}
.row-group
{
  margin-top: 0.373333rem;
}
.row-group .row-split
{
  height: 1px;
  background-color: #eef2f5;
}
.row-group .row
{
  padding: 0.226667rem 0.4rem 0.226667rem 0.426667rem;
  background-color: #fff;
  font-size: 14px;
}
.row-group .row .left
{
  color: #333639;
}
.row-group .row .right
{
  color: #888;
}
.row-group .row .right.tel
{
  color: #27b8f3;
}
</style>