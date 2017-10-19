<template>
<div>
  <div class="container flex-row">
    <aside class="category">
      <a class="category-item" :class="{ active: activeIndex === (item.ServiceId ? item.ServiceId : '0') }" v-for="item in serviceList" @click.prevent.stop="switchCategory(item.ServiceId, $event)"><img class="item-icon" :src="item.IconUrl"><span class="item-name">{{ item.ServiceName }}</span></a>
    </aside>

    <div class="corres-services">
      <section class="service-section" :id="subList.ServiceId || '0'" v-for="subList in serviceList">
        <header class="section-title">{{ subList.ServiceName }}</header>
        <div class="section-list flex-row" :class="{ hot: subList.ServiceName === '热门' }">
          <a class="list-item" v-for="item in subList.SubItems" @click="linkToDetailPage(item)">
            <img class="item-icon" v-if="subList.ServiceName === '热门'" :src="item.IconUrl"><span class="item-name">{{ item.ServiceName }}</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'all_service',
  data() {
    return {
      activeIndex: '0',
      serviceList: [],
    }
  },
  mounted() {
    this.getAllService();
  },
  activated() {
    this.activeIndex = '0';
  },
  methods: {
    getAllService() {
      axios.post(API.AllService, qs.stringify({
      })).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          this.serviceList = res.data.Body.Items;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    switchCategory(id, event) {
      if(!id) {
        id = '0';
      }
      this.activeIndex = id;
      document.getElementById(id).scrollIntoView(true);
    },
    linkToDetailPage(item) {
      if(item.ServiceId == '21') {
        this.$router.push({
          name: 'express'
        });
      } else if(item.ServiceId == '59') {
        this.$router.push({
          name: 'errand'
        });
      } else {
        // 自定义模块
        this.$router.push({
          name: 'service_detail',
          query: {
            id: item.ServiceId
          },
          params: {
            id: item.ServiceId,
            url: item.DetailUrl,
            img: item.LogoUrl ? item.LogoUrl[0] : '',
          }
        });
      }
    }
  },
  computed: {
    ...mapState(['ALERT_MSG']),
  },
}
</script>

<style scoped lang="scss">
.container
{
  -webkit-align-items: stretch;
  align-items: stretch;
  height: 100%;
  .category
  {
    -webkit-flex-basis: 2.466667rem;
    flex-basis: 2.466667rem;
    height: 100%;
    overflow-y: scroll;
    .category-item
    {
      display: block;
      width: 100%;
      height: 2.32rem;
      background-color: #fff;
      color: #666;
      text-align: center;
      overflow: auto;
      &.active
      {
        background-color: #eef2f5;
      }
      .item-icon
      {
        display: block;
        width: 0.666667rem;
        height: 0.666667rem;
        margin: 0.56rem auto 0.266667rem;
      }
      .item-name
      {
        display: block;
      }
    }
  }
  .corres-services
  {
    -webkit-flex: 1;
    flex: 1;
    width: 1px;
    padding-left: 0.426667rem;
    height: 100%;
    overflow-y: scroll;
    .service-section
    {
      padding: 0.533333rem 0;
      .section-title
      {
        color: #666;
        font-size: 11px;
      }
      .section-list
      {
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-justify-content: initial;
        justify-content: initial;
        margin-top: 0.32rem;
        .list-item
        {
          display: block;
          width: 2.133333rem;
          height: 0.8rem;
          line-height: 0.8rem;
          margin-right: 0.213333rem;
          margin-top: 0.213333rem;
          background-color: #fff;
          color: #666;
          font-size: 11px;
          text-align: center;
          .item-name
          {
            display: block;
          }
        }
        &.hot .list-item
        {
          display: block;
          width: 1.546667rem;
          height: 1.546667rem;
          line-height: 100%;
          margin-right: 0.213333rem;
          margin-top: 0.213333rem;
          background-color: #fff;
          color: #666;
          font-size: 11px;
          text-align: center;
          .item-icon
          {
            display: block;
            width: 0.6rem;
            height: 0.6rem;
            margin: 0.253333rem auto 0.213333rem;
          }
          .item-name
          {
            display: block;
          }
        }
      }
    }
  }
}
</style>