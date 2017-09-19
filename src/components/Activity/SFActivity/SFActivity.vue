<template>
<div>
  <div class="wrapper">
    <img class="bg-main" src="../../../../assets/static/images/activity/sf_main.png">

    <img class="bg-btn" @click="gotoSFDetail" src="../../../../assets/static/images/activity/sf_btn.png">
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'sf_activity',
  data() {
    return {
      isLoading: false,
    }
  },
  mounted() {
  },
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