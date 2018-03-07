<template>
<div>
  <div class="activity-list">
    <router-link class="list-item" v-if="IsLogin == '0'" :to="{ name: 'new_user_coupon' }"><img src="../../../assets/static/images/activity/new_user_coupon.jpg"></router-link>
    <a class="list-item" v-for="item in activityList" @click="routeTo(item)"><img :src="item.ImageUrl"></a>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'activity',
  data() {
    return {
      activityList: [],
    }
  },
  mounted() {
    this.getActivityList();
  },
  methods: {
    getActivityList() {
      this.$loading.open(2);
      this.$store.dispatch('GetAds')
        .then(res => {
          this.$loading.close();
          this.activityList = res.Ads;
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    routeTo(item) {
      // 根据活动的title跳转到不同的路由
      if(item.ObjectApns.Title.indexOf('就是爱') > -1 || item.ObjectApns.Title.indexOf('超级星期五') > -1) {
        // 超级星期五
        this.$router.push({
          name: 'black_friday'
        });
      } else if(item.ObjectApns.Title.indexOf('顺丰速运') > -1) {
        // 顺丰
        this.$router.push({
          name: 'sf_activity'
        });
      } else if(item.ObjectApns.Title.indexOf('钱内助') > -1) {
        // 钱内助
        this.$router.push({
          name: 'qianneizhu',
          params: {
            selfLink: true
          }
        });
      } else if(item.ObjectApns.Title.indexOf('首充') > -1) {
        // 一元首充
        this.$router.push({
          name: 'one_recharge',
        });
      } else if(item.ObjectApns.Title.indexOf('跑腿') > -1) {
        // 快递跑腿
        this.$router.push({
          name: 'errand',
        });
      } else if(item.ObjectApns.Title.indexOf('新春通知') > -1) {
        window.location.href = item.ObjectApns.Url;
      }
    }
  },
  computed: {
    ...mapState(['IsLogin', 'ALERT_MSG']),
  },
}
</script>

<style scoped lang="scss">
.menu-router-view
{
  height: 100%;
  overflow-y: scroll;
}
.activity-list
{
  .list-item
  {
    display: block;
    margin: 0.266667rem;
    img
    {
      display: block;
      width: 100%;
      border-radius: 4px;
    }
  }
}
</style>