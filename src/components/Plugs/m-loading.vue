<template>
  <div class="loading" :class="{ 'bg-style-1': bgStyle == '1', 'bg-style-2': bgStyle == '2' }">
    <div class="loading-content">
      <div class="loading-txt txt-top" v-if="txtTop">{{ txtTop }}</div>
      <div class="loading-animate flex-row">
        <div class="object object1"></div>
        <div class="object object2"></div>
        <div class="object object3"></div>
      </div>
      <div class="loading-txt txt-bottom" v-if="txtBottom">{{ txtBottom }}</div>
    </div>
  </div>
</template>

<!--
bgStyle为0表示无背景色，为1表示白色背景，为2表示半透明背景
 -->

<script>
export default {
  name: 'm-loading',
  data() {
    return {
    }
  },
  props: ['bgStyle', 'txtTop', 'txtBottom'],
}
</script>

<style scoped>
.loading
{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 200;
  transform: translateZ(0);

  width: 100%;
  height: 100%;
}
.loading.bg-style-1
{
  background-color: #fff;
}
.loading.bg-style-2
{
  background-color: rgba(0,0,0,.6);
}
.loading-content
{
  position: absolute;
  top: 50%;
  left: 50%;

  padding: 20px;
  border-radius: 4px;

  background-color: rgba(0,0,0,.6);
  text-align: center;
  transform: translate(-50%, -50%);
}
.loading-content .loading-txt
{
  color: #fff;
  font-size: 14px;
}
.loading-content .loading-txt.txt-top
{
  margin-bottom: 0.266667rem;
}
.loading-content .loading-txt.txt-bottom
{
  margin-top: 0.266667rem;
}
.loading-content .loading-animate
{
  width: 1.5rem;
  margin: 0 auto;
}
.loading-animate .object
{
  display: inline-block;

  width: 0.3rem;
  height: 0.3rem;
  padding: 1px;
  border-radius: 100%;

  background-color: #fff;
  -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
  animation: bouncedelay 1.4s infinite ease-in-out;
  /* Prevent first frame from flickering when animation starts */
  -webkit-animation-fill-mode: none;
  animation-fill-mode: none;
}
@-webkit-keyframes bouncedelay
{
  0%, 80%, 100% { -webkit-transform: scale(0.0) }
  40% { -webkit-transform: scale(1.0) }
}
@keyframes bouncedelay
{
  0%, 80%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 40% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
.loading-content .object1
{
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loading-content .object2
{
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
</style>
