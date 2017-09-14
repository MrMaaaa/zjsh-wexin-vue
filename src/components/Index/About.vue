<template>
<div>
  <img class="logo" v-if="AppName === '助家生活'" src="../../../assets/static/images/logo_zhujiashenghuo.png">
  <img class="logo" v-if="AppName === '快递上门'" src="../../../assets/static/images/logo_kuaidishangmen.png">
  <img class="logo" v-if="AppName === '同城家政'" src="../../../assets/static/images/logo_tongchengjiazheng.png">
  <span class="app-name">{{ AppName }}</span>
  <article class="content">
    <p>为什么选择{{ AppName }}？<br>{{ AppName }}，成立于2014年，是杭州芸瑾网络科技有限公司旗下的生活服务O2O平台。服务覆盖全国48个城市，平台认证服务者上万人，迄今已为超过100万的用户提供优质服务。</p>
    <p>我可以享受哪些上门服务？<br>金牌小时工、新房开荒、油烟机空调拆洗、保姆月搜、快递上门、同城跑腿、家电维修、搬家……所有你能想到的生活服务，这里应有尽有！60秒下单，最快30分钟极速上门。</p>
    <p>为我服务的是群什么人？<br>服务人员：均通过健康认证，经过专业培训，配备专业工具。运营团队：包含原阿里的资深开发、原苏宁的高级经理人、原腾讯的产品经理，还有规模庞大的线下铁军。我们相聚在一起，只为了让您有更舒心的生活体验。</p>
    <p>搜上门服务，用{{ AppName }}。</p>
  </article>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'order_about',
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['AppName'])
  }
}
</script>

<style scoped>
.router-view
{
  background-color: #fff;
  padding-top: 0.6rem;
}
.app-name
{
  display: block;
  margin-top: 0.2rem;
  color: #31aef5;
  font-size: 14px;
  text-align: center;
}
.logo
{
  display: block;
  width: 1.706667rem;
  margin: 0 auto;
  border-radius: 8px;
}
.content
{
  margin-top: 0.333333rem;
  padding: 0 0.533333rem;
  color: #333639;
  font-size: 14px;
}
.content p:not(:first-child)
{
  margin-top: 0.333333rem;
}
</style>