<template>
<div>
  <div class="activity-list" v-if="activities.length">
    <router-link class="list-item" v-if="IsLogin == '0'" :to="{ name: 'new_user_coupon' }"><img src="../../../assets/static/images/activity/new_user_coupon.png"></router-link>
    <router-link class="list-item" :to="{ name: 'errand' }"><img src="../../../assets/static/images/activity/errand_banner.png"></router-link>
    <a class="list-item" v-for="item in activities" @click="routeTo(item)"><img :src="item.ImageUrl"></a>
  </div>

  <m-loading v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'activity',
  data() {
    return {
      isLoading: false,
      activities: [],
    }
  },
  mounted() {
    this.isLoading = true;
    this.getActivityList();
  },
  methods: {
    getActivityList() {
      axios.post(API.GetAds, qs.stringify({
        Token: this.Token,
      })).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          this.activities = res.data.Body.Ads;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
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
      }
    }
  },
  computed: {
    ...mapState(['Token', 'IsLogin', 'ALERT_MSG']),
  },
}
</script>

<style scoped lang="scss">
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