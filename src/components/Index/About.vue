<template>
<div>
  <img class="logo" src="../../assets/images/about_logo.jpg">
  <article class="content">
    <p>助家生活，是由杭州芸瑾网络科技有限公司，一手打造的全国化家居服务O2O平台，用创新思维搭建出基于生活家居服务的全新互联网商业模式。其中业务涵盖家政、安装、维修、保姆、月嫂、洗衣、美甲、搬家、宠物等各类生活服务。</p>
    <p>助家生活作为行业领先的移动互联网公司，拥有来自各界的运营精英 : 原阿里的资深开发、原苏宁的高级经理人，更拥有规模庞大的线下团队，致力于打造专业、高效、便捷、安全、智能的家居生活服务平台。</p>
    <p>助家生活业务遍及北、上、广、深等全国30个城市，平台认证服务者上万人，用户数达百万，开创了中国O2O平台生活服务平台新模式的先河！</p>
    <p>助家生活倡导简单、轻松的生活方式，力图通过我们的服务，让每一位客户都能悠享生活之美；让每一位劳动者都能通过付出获得尊严。</p>
  </article>
</div>
</template>

<script>
export default {
  name: 'order_about',
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
  background-color: #fff;
  padding-top: 0.6rem;
}
.logo
{
  display: block;
  width: 50%;
  margin: 0 auto;
}
.content
{
  margin-top: 0.333333rem;
  padding: 0.266667rem;
  color: #333639;
  font-size: 14px;
}
.content p:not(:first-child)
{
  margin-top: 0.333333rem;
}
</style>