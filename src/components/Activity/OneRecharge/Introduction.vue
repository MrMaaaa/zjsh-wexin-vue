<template>
<div class="router-view">
  <img class="img-bg" src="https://wap.zhujiash.com/activity/Recharge/static/img/recharge-bg.0c9697b.png">

  <router-link :to="{ path: 'one_recharge/index' }" class="btn-receive"></router-link>
</div>
</template>

<script>

export default {
  name: 'one_recharge_introduction',
  data () {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style scoped>
.img-bg
{
  display: block;
  width: 100%;
}
.btn-receive
{
  position: absolute;
  top: 8.0rem;
  left: 4.266667rem;
  width: 4.666667rem;
  height: 1.066667rem;
}
</style>
