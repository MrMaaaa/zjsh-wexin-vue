<template>
  <div class="loading" :class="{ 'bg-style-1': bgStyle == '1', 'bg-style-2': bgStyle == '2' }">
    <div class="loading-content">
      <div class="loading-txt txt-top" v-if="txtTop">{{ txtTop }}</div>
      <div class="loading-animate flex-row">
        <!-- <div class="object object1"></div>
        <div class="object object2"></div>
        <div class="object object3"></div> -->
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

  padding: 0.266667rem;
  -webkit-border-radius: 4px;
  border-radius: 4px;

  background-color: rgba(0,0,0,.6);
  text-align: center;
  -webkit-transform: translate(-50%, -50%);
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
  position: relative;
  width: 0.6rem;
  height: 0.6rem;
  margin: 0 auto;
  font-size: 10px;
  text-indent: -9999rem;
  border-radius: 50%;
  border-top: 0.08rem solid rgba(255, 255, 255, 0.2);
  border-right: 0.08rem solid rgba(255, 255, 255, 0.2);
  border-bottom: 0.08rem solid rgba(255, 255, 255, 0.2);
  border-left: 0.08rem solid #fff;
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@keyframes load8
{
  0%
  {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100%
  {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
/*.loading-content .loading-animate
{
  width: 1.5rem;
  margin: 0 auto;
}
@-webkit-keyframes bouncedelay
{
  0% {
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }
  40% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
  80% {
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }
  100% {
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }
}
@keyframes bouncedelay
{
  0% {
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }
  40% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
  80% {
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }
  100% {
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }
}
.loading-animate .object
{
  display: inline-block;

  width: 0.34rem;
  height: 0.34rem;
  -webkit-border-radius: 100%;
  border-radius: 100%;

  background-color: #fff;
  -webkit-animation-name: bouncedelay;
  animation-name: bouncedelay;
  -webkit-animation-duration: 1.4s;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-direction: normal;
  animation-direction: normal;
  -webkit-animation-fill-mode: none;
  animation-fill-mode: none;
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
}*/
</style>
