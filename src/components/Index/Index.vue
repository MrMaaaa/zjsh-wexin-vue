<template>
<div class="wrapper">
  <section class="category" v-for="recommendItem in recommendList">
    <header class="category-title">{{ recommendItem.Title }}</header>

    <ul class="category-list flex-row">
      <li class="category-item" v-for="item in recommendItem.Items" @click="routerTo(item)">
        <img class="item-img" :src="item.LogoUrl[0]">

        <p class="item-name">{{ item.ServiceName }}</p>

        <p class="item-unit-price"><span class="price">{{ item.Price }}</span>元/{{ item.Unit }}</p>
      </li>
    </ul>
  </section>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'index',
  data() {
    return {
      recommendList: [],
    }
  },
  mounted() {
    this.getRecommendList();
  },
  methods: {
    getRecommendList() {
        axios.post(API.Recommend, qs.stringify({}), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        if (res.data.Meta.ErrorCode === '0') {
          this.recommendList = res.data.Body.RecommendBlock.slice(0, 2);
        } else {
          // this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch((error)=> {
        // this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    routerTo(item) {
      this.$store.commit('SetThreeServiceId', item.ServiceId);
      this.$store.commit('SetThreeServiceName', item.ServiceName);

      // iframe
      // this.$router.push({
      //   name: 'service_detail',
      //   query: {
      //     service_id: item.ServiceId
      //   },
      //   params: {
      //     detail_url: item.DetailUrl
      //   }
      // })

      // 自定义模块
      this.$router.push({
        name: 'service_detail',
        params: {
          id: item.ServiceId
        }
      });
    }
  },
  computed: {
    ...mapState(['ALERT_MSG']),
  }
}
</script>

<style scoped lang="scss">
.wrapper
{
  background-color: #eef2f5;
  overflow: auto;
}
.category
{
  margin-top: 0.266667rem;
  background-color: #fff;
  text-align: center;
  .category-title
  {
    position: relative;
    display: inline-block;
    height: 1.173333rem;
    line-height: 1.173333rem;
    margin: 0 auto;
    color: #000;
    font-size: 17px;
    &::before
    {
      content: '';
      position: absolute;
      top: 0.586667rem;
      left: -1.466667rem;
      display: block;
      width: 1.2rem;
      height: 1px;
      background-color: #eef2f5;
    }
    &::after
    {
      content: '';
      position: absolute;
      top: 0.586667rem;
      right: -1.466667rem;
      display: block;
      width: 1.2rem;
      height: 1px;
      background-color: #eef2f5;
    }
  }
  .category-list
  {
    padding: 0 0.266667rem;
    text-align: left;
    .category-item
    {
      width: 100%;
      padding-bottom: 0.333333rem;
      &:not(:first-child)
      {
        margin-left: 0.106667rem;
      }
      .item-img
      {
        display: block;
        width: 100%;
        cursor: pointer;
      }
      .item-name
      {
        margin-top: 0.253333rem;
        padding-left: 0.266667rem;
        color: #333639;
        font-size: 15px;
      }
      .item-unit-price
      {
        margin-top: 0.186667rem;
        padding-left: 0.266667rem;
        color: #999;
        font-size: 10px;
        .price
        {
          color: #f56165;
          font-size: 15px;
        }
      }
    }
  }
}
</style>