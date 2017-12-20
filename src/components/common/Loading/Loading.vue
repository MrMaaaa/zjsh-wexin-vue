<template>
  <div class="loading" :class="{ 'bg-style-1': type === 1, 'bg-style-2': type === 2 }">
    <div class="loading-content">
      <div class="loading-txt txt-top" v-if="topMsg !== ''">{{ topMsg }}</div>
      <div class="loading-animate flex-row">
      </div>
      <div class="loading-txt txt-bottom" v-if="bottomMsg !== ''">{{ bottomMsg }}</div>
    </div>
  </div>
</template>

<!--
bgStyle为0表示无背景色，为1表示白色背景，为2表示半透明背景
 -->

<script>
export default {
  name: 'Loading',
  props: {
    type: {
      type: Number,
      default: 0
    },
    topMsg: {
      type: [String, Number],
      default: ''
    },
    bottomMsg: {
      type: [String, Number],
      default: ''
    },
  }
}
</script>

<style scoped>
.loading
{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
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
  min-width: 2.133333rem;
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
  -webkit-animation: linear m-loading-rotating 1.1s infinite;
  animation: linear m-loading-rotating 1.1s infinite;
}
@keyframes m-loading-rotating
{
  0%
  {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100%
  {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
@-webkit-keyframes m-loading-rotating
{
  0%
  {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100%
  {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
</style>
