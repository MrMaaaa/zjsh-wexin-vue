<template>
<div>
  <div class="wrapper">
    <img class="bg-main" src="../../../../assets/static/images/activity/sf_main.png">

    <img class="bg-btn" @click="gotoSFDetail" src="../../../../assets/static/images/activity/sf_btn.png">
  </div>
</div>
</template>

<script>
export default {
  name: 'sf_activity',
  methods: {
    gotoSFDetail() {
      this.$router.push({
        name: 'express'
      });
    },
  },
}
</script>

<style scoped lang="scss">
.wrapper
{
  position: relative;
  .bg-main
  {
    width: 100%;
  }
  .bg-btn
  {
    position: absolute;
    top: 13.693333rem;
    left: 50%;
    transform: translateX(-50%);
    width: 9.36rem;
  }
}
</style>