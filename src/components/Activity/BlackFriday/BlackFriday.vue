<template>
<div>
  <img class="body-bg" :src="bodyBgImg" v-if="bodyBgImg">

  <div style="padding-top: 7rem;">
    <div class="activity-list" :style="{ backgroundImage: 'url(' + item.NormalImageUrl + ')' }" v-for="item in activityList">
      <img v-show="activityStatus == '0' && btn_before" :src="btn_before" class="btn-submit" @click="showInfo('0')">
      <img v-show="activityStatus == '1' && btn_process" :src="btn_process" class="btn-submit" @click="goToOrder(item)">
      <img v-show="activityStatus == '2' && btn_after" :src="btn_after" class="btn-submit" @click="showInfo('-1')">
    </div>
  </div>

  <m-loading bg-style="1" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'black_friday',
  data() {
    return {
      bodyBgImg: '',
      activityList: [],
      activityStatus: '',
      btn_before: '',
      btn_process: '',
      btn_after: '',
      isLoading: false,
    }
  },
  activated() {
    this.getActivityInfo();
  },
  methods: {
    getActivityInfo() {
      this.isLoading = true;
      axios.post(API.BlackFridayEx, qs.stringify({
      })).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          //背景图
          this.bodyBgImg = res.data.Body.BackImageUrl;
          //活动列表
          this.activityList = res.data.Body.ProductList;
          //保存按钮状态图
          this.btn_before = 'https://image.zhujiash.com/upload/BlackFriday/btn_waiting.png';
          this.btn_process = 'https://image.zhujiash.com/upload/BlackFriday/btn_sckill.png';
          this.btn_after = 'https://image.zhujiash.com/upload/BlackFriday/btn_waiting.png';

          //启动计时器
          this.launchTimer(this.activityList[0]);
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    launchTimer(value) {
      var that = this;
      //按钮背景色与活动状态
      //var timeStart = 2;
      var timeStart = value.StartCountDown;
      //var timeEnd = 60;
      var timeEnd = value.EndCountDown;
      if (timeStart == '') timeStart = 0;
      if (timeEnd == '') timeEnd = 0;
      /**************************************************************/
      //获取活动结束剩余时间，如果活动未开始这个时间为活动持续时间
      timeEnd = timeEnd - timeStart;

      var startCDInterval = null;
      var endCDInterval = null;

      //活动未开始
      if (timeStart > 0) {
        this.activityStatus = '0';
        //启动开始倒计时
        startCDInterval = setInterval(() => {
          timeStart--;
          if (timeStart == 0) {
            //活动开始
            clearInterval(startCDInterval);

            //允许抢单
            this.activityStatus = '1';
            //启动结束倒计时
            endCDInterval = setInterval(() => {
              timeEnd--;
              if (timeEnd == 0) { //活动结束
                clearInterval(endCDInterval);

                //不可抢单
                this.activityStatus = '2';
              }
            }, 1000);
          }
        }, 1000);
      } else if (timeStart == 0 && timeEnd > 0) {
        //活动已开始
        this.activityStatus = '1';
        endCDInterval = setInterval(() => {
          timeEnd--;
          if (timeEnd == 0) { //活动结束
            clearInterval(endCDInterval);

            //不可点击
            this.activityStatus = '2';
          }
        }, 1000);
      } else if (timeStart < 0) {
        //活动已结束
        //不可抢单
        this.activityStatus = '2';
      }
    },
    goToOrder(item) {
      this.$router.push({
        name: 'order_place',
        query: {
          id: item.ProductId,
          isActivity: '1',
        }
      });
    },
    showInfo(type) {
      if(type == '0') {
        this.alert('本期活动尚未开始，每周五10:00开抢，敬请期待！', 3000);
      } else if(type == '-1') {
        this.alert('本期活动已经结束，每周五10:00开抢，敬请期待！', 3000);
      }
    },
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
  },
}
</script>

<style scoped lang="scss">
.router-view
{
  height: auto;
}
.contain
{
  position: relative;
  width: 100%;
}
.body-bg
{
  display: block;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.activity-list
{
  position: relative;
  width: 8.533333rem;
  height: 4.8rem;
  margin: 0 auto 0.2rem;

  background-size: 100% 100%;
}
.btn-submit
{
  position: absolute;
  right: 0.5rem;
  bottom: 15%;
  display: block;

  width: 3.1rem;
  height: 0.9rem;
}
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
</style>