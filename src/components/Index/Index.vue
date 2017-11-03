<template>
<div class="outer-wrapper">
  <div class="index-wrapper" :class="appName">
    <section class="shortcut">
      <ul class="shortcut-list flex-row">
        <li class="list-item" :class="'list-item' + index" @click="routerTo(item)" v-for="(item, index) in shortcuts">
          <i class="item-img"><img class="item-icon" :src="item.icon"></i>
          <span class="item-name txt-over-hide">{{ item.ServiceName }}</span>
        </li>
      </ul>
    </section>

    <section class="super-discount" v-if="superDiscountList.Items.length > 0">
      <header class="discount-title">{{ superDiscountList.Title }}</header>
      <!-- <div>
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide class="slide-item" @click.native="gotoOrderPlace(item)" :key="item.ServiceId" v-for="item in superDiscountList.Items">
            <img class="swiper-icon" :src="item.IconUrl">

            <div class="slide-item-slot">
              <span class="slot-title">{{ item.ServiceName }}</span>
              <span class="slot-price"><span class="price-slogon">优惠后</span><span class="price-symbol"> ￥</span><span class="price-amount">{{ item.SuperDiscountItem.Amount }}</span></span>
              <div class="slot-discount-info" v-if="item.SuperDiscountItem">
                <span class="info-item txt-over-hide" v-for="info in item.SuperDiscountItem.DiscountContent"><img class="info-icon" src="../../assets/images/orders_pitch_on.png">{{ info }}</span>
              </div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div> -->
      <ul class="discount-list flex-row">
        <li class="list-item" v-for="item in superDiscountList.Items" @click="gotoOrderPlace(item)">
          <header class="item-intro">
            <img class="item-img" :src="item.IconUrl">
            <p class="item-price">￥{{ item.SuperDiscountItem.Amount }}</p>
          </header>
          <div class="item-discount-desc">
            <span class="desc-item" v-for="list in item.SuperDiscountItem.DiscountContent">{{ list }}</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="category clearning" :style="{ 'padding-bottom': recommend.ServiceId == '1' ? 0 : '1.173333rem'}" v-for="recommend in recommendList">
      <header class="category-title">{{ recommend.Title }}</header>

      <router-link class="category-more" v-if="recommend.ServiceId != '1'" :to="{ name: 'recommend_more', query: { id:recommend.ServiceId } }">更多</router-link>

      <ul class="category-list flex-row">
        <li class="category-item" v-for="item in recommend.Items" @click="routerTo(item)">
          <img class="item-img" :src="item.LogoUrl[0]">

          <p class="item-name">{{ item.ServiceName }}</p>

          <p class="item-unit-price"><span class="price">{{ item.Price }}</span>元/{{ item.Unit }}</p>
        </li>
      </ul>
    </section>

    <section class="category convenience">
      <header class="category-title">快递跑腿</header>

      <ul class="category-list flex-row">
        <li class="category-item" v-for="item in convenienceList" @click="routerTo(item)">
          <img class="item-img" :src="item.icon">

          <p class="item-name">{{ item.ServiceName }}</p>

          <p class="item-unit-price"><span class="price">{{ item.Price }}</span>元/{{ item.Unit }}</p>
        </li>
      </ul>
    </section>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';
// import { swiper, swiperSlide } from 'vue-awesome-swiper';
// require('swiper/dist/css/swiper.css');

export default {
  name: 'index',
  data() {
    return {
      recommendList: [], // 首页推荐服务
      shortcuts: [],
      superDiscountList: {
        Title: '',
        Items: [],
      },
      convenienceList: [{
        ServiceName: '快递上门',
        ServiceId: '21',
        icon: require('../../../assets/static/images/convenience_service_express.png'),
        Price: '12',
        Unit: '次',
      }, {
        ServiceName: '同城跑腿',
        ServiceId: '59',
        icon: require('../../../assets/static/images/convenience_service_errand.png'),
        Price: '10',
        Unit: '次',
      }],
      swiperOption: {
        notNextTick: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: false,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        onTransitionStart(swiper) {
        },
      },
      appName: 'name-zjsh',
    }
  },
  created() {
    var type = '';
    if(this.AppName === '助家生活' || this.AppName === '淘家家政') {
      this.appName = 'name-zjsh';
      type = '2';
    } else if(this.AppName === '同城家政'){
      this.appName = 'name-tcjz';
      type = '2';
    } else if(this.AppName === '同城到家') {
      this.appName = 'name-tcdj';
      type = '2';
    } else if(this.AppName === '快递上门') {
      this.appName = 'name-kdsm';
    } else if(this.AppName === '曹操家政') {
      this.appName = 'name-ccjz';
    }

    this.shortcuts = [{
        ServiceName: '小时工',
        ServiceId: '2',
        icon: require('../../assets/images/shortcut' + type + '_xiaoshigong.png'),
      }, {
        ServiceName: '新房开荒',
        ServiceId: '3',
        icon: require('../../assets/images/shortcut' + type + '_xinfangkaihuang.png'),
      }, {
        ServiceName: '保姆',
        ServiceId: '7',
        icon: require('../../assets/images/shortcut' + type + '_baomu.png'),
      }, {
        ServiceName: '油烟机清洗',
        ServiceId: '12',
        icon: require('../../assets/images/shortcut' + type + '_youyanjiqingxi.png'),
      }, {
        ServiceName: '洗衣机清洗',
        ServiceId: '15',
        icon: require('../../assets/images/shortcut' + type + '_xiyijiqingxi.png'),
      }, {
        ServiceName: '快递上门',
        ServiceId: '21',
        icon: require('../../assets/images/shortcut' + type + '_kuaidi.png'),
      }, {
        ServiceName: '同城跑腿',
        ServiceId: '59',
        icon: require('../../assets/images/shortcut' + type + '_paotui.png'),
      }, {
        ServiceName: '空调清洗',
        ServiceId: '13',
        icon: require('../../assets/images/shortcut' + type + '_kongtiaoqingxi.png'),
      }, {
        ServiceName: '冰箱清洗',
        ServiceId: '14',
        icon: require('../../assets/images/shortcut' + type + '_bingxiangqingxi.png'),
      }, {
        ServiceName: '全部分类',
        ServiceId: '0',
        icon: require('../../assets/images/shortcut' + type + '_quanbu.png'),
      }]
  },
  mounted() {
    this.getRecommendList();
  },
  activated() {
    this.getSuperDiscountList();
  },
  methods: {
    valueFromUrl(key) {
      var url = window.location.search;
      var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
      var result = url.substr(1).match(reg);
      return result ? decodeURIComponent(result[2]) : null;
    },
    getRecommendList() {
      axios.post(API.Recommend, qs.stringify({})).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.recommendList = res.data.Body.RecommendBlock;
          // this.recommendList.forEach(value => {
          //   value.Items.forEach(val => {
          //     var url = val.LogoUrl[0];
          //     val.LogoUrl[0] = require('../../assets/images/order_pay_icon.png');
          //     var img = new Image();
          //     img.src = url;
          //     img.onload = () => {
          //       val.LogoUrl[0] = url;
          //     }
          //   });
          // });
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    getSuperDiscountList() {
      axios.post(API.GetSuperDiscount, qs.stringify({
        Token: this.Token,
        IsNewVersion: '1',
        Longitude: this.CurrentPosition.Longitude,
        Latitude: this.CurrentPosition.Latitude,
      })).then(res => {
        this.superDiscountList.Items.splice(0);
        if (res.data.Meta.ErrorCode === '0') {
          // let list = res.data.Body;
          // list.Items.forEach((value, index) => {
          //   var type = (this.appName == 'name-tcjz' || this.appName == 'name-zjsh' || this.appName == 'name-ccjz') ? '2' : '';
          //   var source = (this.appName == 'name-tcjz' || this.appName == 'name-zjsh' || this.appName == 'name-ccjz') ? '.jpg' : '.png';
          //   value.IconUrl = require('../../../assets/static/images/super_discount' + type + '_' + index + source);
          // });
          // this.superDiscountList.Title = list.Title;
          this.superDiscountList = res.data.Body;
          // list.Items.forEach((value, index) => {
          //   if(value.ServiceName == '小时工') {
          //     value.ServiceName += '3小时';
          //   }
          //   if(value.SuperDiscountItem.DiscountContent.length >= 0) {
          //     this.superDiscountList.Items.push(value);
          //   }
          // });
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    routerTo(item) {
      if(item.ServiceId == '0') {
        this.$router.push({
          name: 'all_service'
        });
      } else if(item.ServiceId == '21') {
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
    },
    gotoOrderPlace(item) {
      // OrderType: 0 普通id; 1 活动id
      if (item.OrderType === '0') {
        this.$router.push({
          name: 'order_place',
          query: {
            id: item.ServiceId,
          },
          params: {
            fromDetailPage: '1',
          },
        });
      } else {
        this.$router.push({
          name: 'order_place',
          query: {
            id: item.ServiceId,
            isActivity: '1',
          },
          params: {
            fromDetailPage: '1',
          },
        });
      }
    },
  },
  computed: {
    ...mapState(['Token', 'AppName', 'CurrentPosition', 'ALERT_MSG']),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  // components: {
  //   swiper,
  //   swiperSlide
  // },
}
</script>

<style scoped lang="scss">
.outer-wrapper
{
  height: 100%;
  overflow-y: scroll;
}
.index-wrapper
{
  -webkit-display: flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-justify-content: space-around;
  justify-content: space-around;
  -webkit-align-items: center;
  align-items: center;
  background-color: #eef2f5;
}
.menu-router-view .index-wrapper
{
  padding-bottom: 0.266667rem;
}

.swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets
{
  bottom: 20px;
  left: 0;
  width: 100%;
}
.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet
{
  margin: 2px;
}
.swiper-pagination-bullet
{
  display: inline-block;
}

.shortcut
{
  -webkit-order: 0;
  order: 0;
  width: 100%;
  background-color: #fff;
  .shortcut-list
  {
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    padding: 0.5rem 0;
    .list-item
    {
      width: 1.5rem;
      padding: 0 0.25rem 0.25rem;
      .item-img
      {
        box-sizing: border-box;
        display: block;
        width: 1.2rem;
        height: 1.2rem;
        line-height: 1.2rem;
        margin: 0 auto;
        padding: 0.226667rem 0;
        border-radius: 50%;
        background: #4fddfb;
        background: -webkit-linear-gradient(#4fddfb, #27b8f3);
        background: linear-gradient(#4fddfb, #27b8f3);
        text-align: center;
        .item-icon
        {
          display: inline-block;
          width: 0.746667rem;
          height: 0.746667rem;
        }
      }
      .item-name
      {
        display: block;
        width: 100%;
        padding-top: 0.16rem;
        color: #333639;
        font-size: 11px;
        text-align: center;
      }
    }
  }
}
.super-discount
{
  -webkit-order: 2;
  order: 2;
  width: 100%;
  margin: 0.266667rem 0 0;
  background-color: #fff;
  text-align: center;
  .discount-title
  {
    position: relative;
    display: inline-block;
    line-height: 100%;
    margin: 0.426667rem auto 0.066667rem;
    color: #000;
    font-size: 17px;
    &::before
    {
      content: '';
      position: absolute;
      top: 50%;
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
      top: 50%;
      right: -1.466667rem;
      display: block;
      width: 1.2rem;
      height: 1px;
      background-color: #eef2f5;
    }
  }
  // .slide-item
  // {
  //   position: relative;
  //   .slide-item-slot
  //   {
  //     position: absolute;
  //     top: 0.466667rem;
  //     left: 0.653333rem;
  //     width: 55%;
  //     color: #333639;
  //     text-align: left;
  //     .info-icon
  //     {
  //       width: 0.266667rem;
  //       height: 0.266667rem;
  //       margin-right: 0.106667rem;
  //     }
  //     .slot-title
  //     {
  //       display: block;
  //       line-height: 100%;
  //       font-size: 18px;
  //     }
  //     .slot-price
  //     {
  //       display: block;
  //       line-height: 100%;
  //       margin-top: 0.2rem;
  //       color: #F56165;
  //       font-size: 18px;
  //       .price-symbol
  //       {
  //         display: inline-block;
  //         line-height: 100%;
  //         padding: 0.02rem 0;
  //         font-size: 12px;
  //         margin-left: 0.2rem;
  //         vertical-align: bottom;
  //       }
  //       .price-slogon
  //       {
  //         display: inline-block;
  //         height: 0.44rem;
  //         padding: 0 0.15rem;
  //         border-radius: 0.22rem;
  //         background-color: #F56165;
  //         color: #fff;
  //         font-size: 10px;
  //         vertical-align: middle;
  //       }
  //       .price-amount
  //       {
  //         line-height: 100%;
  //         vertical-align: middle;
  //       }
  //     }
  //     .slot-discount-info
  //     {
  //       width: 100%;
  //       min-height: 1rem;
  //       margin-top: 0.2rem;
  //       color: #999;
  //       font-size: 10px;
  //       .info-item
  //       {
  //         display: block;
  //         width: 100%;
  //       }
  //     }
  //   }
  //   .swiper-icon
  //   {
  //     box-sizing: border-box;
  //     display: block;
  //     width: 100%;
  //     padding: 0 0.32rem 0.426667rem;
  //   }
  // }
  .discount-list
  {
    -webkit-align-items: initial;
    align-items: initial;
    padding: 0 0.293333rem;
    .list-item
    {
      width: 100%;
      &:not(:first-child)
      {
        margin-left: 0.106667rem;
      }
      .item-intro
      {
        position: relative;
        .item-img
        {
          display: block;
          width: 100%;
        }
        .item-price
        {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 0.533333rem;
          line-height: 0.533333rem;
          padding: 0 0.2rem 0 0.4rem;
          border-top-left-radius: 0.266667rem;
          border-bottom-left-radius: 0.266667rem;
          border-bottom-right-radius: 0.106667rem;
          background: #f56165;
          background: -webkit-linear-gradient(to right, #f56165, #f1a26e);
          background: linear-gradient(to right, #f56165, #f1a26e);
          color: #fff;
          font-size: 11px;
          &::before
          {
            content: '优惠后';
            font-size: 9px;
          }
        }
      }
      .item-discount-desc
      {
        padding: 0.213333rem 0.106667rem 0.333333rem 0.106667rem;
        text-align: left;
        .desc-item
        {
          display: block;
          color: #666;
          font-size: 10px;
          vertical-align: middle;
          &::before
          {
            content: '';
            display: inline-block;
            width: 0.266667rem;
            height: 0.266667rem;
            margin-right: 0.106667rem;
            background: url(../../assets/images/orders_pitch_on.png) no-repeat;
            background-size: 100% 100%;
            vertical-align: middle;
          }
          &:not(:first-child)
          {
            margin-top: 0.173333rem;
          }
        }
      }
    }
  }
}
.category
{
  position: relative;
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
  .category-more
  {
    position: absolute;
    top: 0.266667rem;
    right: 0.266667rem;
    color: #000;
    font-size: 14px;
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

// 助家生活、同城家政样式
.menu-router-view .index-wrapper.name-zjsh,
.menu-router-view .index-wrapper.name-tcjz
{
  @for $item from 0 to 10 {
    .list-item#{$item}
    {
      -webkit-order: $item;
      order: $item;
    }
  }
  .category
  {
    width: 100%;
    &.clearning
    {
      -webkit-order: 2;
      order: 2;
    }
    &.convenience
    {
      -webkit-order: 4;
      order: 4;
    }
  }
  .shortcut
  {
    -webkit-order: 1;
    order: 1;
    .shortcut-list
    {
      .list-item
      {
        .item-img
        {
          background: transparent;
        }
      }
    }
  }
  .category
  {
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    .category-title
    {
      &::before,
      &::after
      {
        display: none;
      }
    }
    .category-more
      {
        right: 0;
        top: 100%;
        width: 100%;
        transform: translateY(-1.173333rem);
        height: 1.173333rem;
        line-height: 1.173333rem;
        color: #666;
        &::before
        {
          content: '查看';
        }
        &::after
        {
          content: '';
          display: inline-block;
          width: 0.106667rem;
          height: 0.16rem;
          margin-left: 5px;
          background-image: url(../../assets/images/right.png);
          background-size: 100%;
          background-repeat: no-repeat;
          font-size: 0;
          vertical-align: middle;
        }
      }
  }
}

// 同城到家样式
.menu-router-view .index-wrapper.name-tcdj
{
  // @for $item from 0 to 10 {
  //   .list-item#{$item}
  //   {
  //     -webkit-order: $item;
  //     order: $item;
  //   }
  // }
  .shortcut
  {
    -webkit-order: 1;
    order: 1;
    .shortcut-list
    {
      .list-item
      {
        .item-img
        {
          background: transparent;
        }
      }
    }
  }
  .category
  {
    width: 100%;
    &.clearning
    {
      -webkit-order: 2;
      order: 2;
      padding-bottom: 1.173333rem;
      .category-more
      {
        right: 0;
        top: 100%;
        width: 100%;
        transform: translateY(-1.173333rem);
        height: 1.173333rem;
        line-height: 1.173333rem;
        color: #666;
        &::before
        {
          content: '查看';
        }
        &::after
        {
          content: '';
          display: inline-block;
          width: 0.106667rem;
          height: 0.16rem;
          margin-left: 5px;
          background-image: url(../../assets/images/right.png);
          background-size: 100%;
          background-repeat: no-repeat;
          font-size: 0;
          vertical-align: middle;
        }
      }
    }
    &.convenience
    {
      -webkit-order: 3;
      order: 3;
    }
  }
}

// 快递上门样式
.menu-router-view .index-wrapper.name-kdsm
{
  // @for $item from 0 to 10 {
  //   .list-item#{$item}
  //   {
  //     -webkit-order: 10 - $item;
  //     order: 10 - $item;
  //   }
  // }
  .list-item
  {
    -webkit-order: 1;
    order: 1;
  }
  .list-item5
  {
    -webkit-order: 0;
    order: 0;
  }
  .list-item6
  {
    -webkit-order: 0;
    order: 0;
  }
  .category
  {
    &.clearning
    {
      -webkit-order: 3;
      order: 3;
      .category-more
      {
        right: 0;
        top: 100%;
        width: 100%;
        transform: translateY(-1.173333rem);
        height: 1.173333rem;
        line-height: 1.173333rem;
        color: #666;
        &::before
        {
          content: '查看';
        }
        &::after
        {
          content: '';
          display: inline-block;
          width: 0.106667rem;
          height: 0.16rem;
          margin-left: 5px;
          background-image: url(../../assets/images/right.png);
          background-size: 100%;
          background-repeat: no-repeat;
          font-size: 0;
          vertical-align: middle;
        }
      }
    }
    &.appliance
    {
      -webkit-order: 4;
      order: 4;
    }
    &.convenience
    {
      -webkit-order: 2;
      order: 2;
    }
  }
}

// 曹操家政样式
.menu-router-view .index-wrapper.name-ccjz
{
  .shortcut
  {
    -webkit-order: 1;
    order: 1;
    margin-top: 0.266667rem;
  }
  .category
  {
    -webkit-order: 2;
    order: 2;
    &.clearning
    {
      -webkit-order: 2;
      order: 2;
      padding-bottom: 1.173333rem;
      .category-more
      {
        right: 0;
        top: 100%;
        width: 100%;
        transform: translateY(-1.173333rem);
        height: 1.173333rem;
        line-height: 1.173333rem;
        color: #666;
        &::before
        {
          content: '查看';
        }
        &::after
        {
          content: '';
          display: inline-block;
          width: 0.106667rem;
          height: 0.16rem;
          margin-left: 5px;
          background-image: url(../../assets/images/right.png);
          background-size: 100%;
          background-repeat: no-repeat;
          font-size: 0;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>