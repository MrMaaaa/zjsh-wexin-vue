<template>
<div class="wrapper">
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
    <div>
        <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide class="slide-item" @click.native="gotoOrderPlace(item)" :key="item.ServiceId" v-for="item in superDiscountList.Items">
              <img class="swiper-icon" :src="item.IconUrl">

              <div class="slide-item-slot">
                <span class="slot-title">{{ item.ServiceName }}</span>
                <span class="slot-price"><span class="price-slogon">优惠后</span><span class="price-Symbol"> ￥</span><span class="price-amount">{{ item.SuperDiscountItem.Amount }}</span></span>
                <div class="slot-discount-info" v-if="item.SuperDiscountItem">
                  <span class="info-item txt-over-hide" v-for="info in item.SuperDiscountItem.DiscountContent"><img class="info-icon" src="../../assets/images/orders_pitch_on.png">{{ info }}</span>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
  </section>

  <section class="category clearning" v-if="recommendList[0]">
    <header class="category-title">{{ recommendList[0].Title }}</header>

    <ul class="category-list flex-row">
      <li class="category-item" v-for="item in recommendList[0].Items" @click="routerTo(item)">
        <img class="item-img" :src="item.LogoUrl[0]">

        <p class="item-name">{{ item.ServiceName }}</p>

        <p class="item-unit-price"><span class="price">{{ item.Price }}</span>元/{{ item.Unit }}</p>
      </li>
    </ul>
  </section>

  <section class="category appliance" v-if="recommendList[1]">
    <header class="category-title">{{ recommendList[1].Title }}</header>

    <ul class="category-list flex-row">
      <li class="category-item" v-for="item in recommendList[1].Items.slice(0,3)" @click="routerTo(item)">
        <img class="item-img" :src="item.LogoUrl[0]">

        <p class="item-name">{{ item.ServiceName }}</p>

        <p class="item-unit-price"><span class="price">{{ item.Price }}</span>元/{{ item.Unit }}</p>
      </li>
    </ul>

    <ul class="category-list flex-row">
      <li class="category-item" v-for="item in recommendList[1].Items.slice(3,6)" @click="routerTo(item)">
        <img class="item-img" :src="item.LogoUrl[0]">

        <p class="item-name">{{ item.ServiceName }}</p>

        <p class="item-unit-price"><span class="price">{{ item.Price }}</span>元/{{ item.Unit }}</p>
      </li>
    </ul>
  </section>

  <section class="category convenience" v-if="ConvenienceServiceList">
    <header class="category-title">{{ ConvenienceServiceList.Title }}</header>

    <ul class="category-list flex-row">
      <li class="category-item" v-for="(item, index) in ConvenienceServiceList.Items" @click="routerToConvenience(index)">
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
import { swiper, swiperSlide } from 'vue-awesome-swiper';
require('swiper/dist/css/swiper.css');

export default {
  name: 'index',
  data() {
    return {
      recommendList: [], // 首页推荐服务
      shortcuts: [{
        ServiceName: '小时工',
        ServiceId: '2',
        icon: require('../../assets/images/shortcut_xiaoshigong.png'),
      }, {
        ServiceName: '新房开荒',
        ServiceId: '3',
        icon: require('../../assets/images/shortcut_xinfangkaihuang.png'),
      }, {
        ServiceName: '油烟机清洗',
        ServiceId: '12',
        icon: require('../../assets/images/shortcut_youyanjiqingxi.png'),
      }, {
        ServiceName: '空调清洗',
        ServiceId: '13',
        icon: require('../../assets/images/shortcut_kongtiaoqingxi.png'),
      }, {
        ServiceName: '沙发清洗',
        ServiceId: '4',
        icon: require('../../assets/images/shortcut_shafaqingxi.png'),
      }, {
        ServiceName: '洗衣机清洗',
        ServiceId: '15',
        icon: require('../../assets/images/shortcut_xiyijiqingxi.png'),
      }, {
        ServiceName: '微波炉清洗',
        ServiceId: '16',
        icon: require('../../assets/images/shortcut_chongfuliang.png'),
      }, {
        ServiceName: '冰箱清洗',
        ServiceId: '14',
        icon: require('../../assets/images/shortcut_bingxiangqingxi.png'),
      }, {
        ServiceName: '快递上门',
        ServiceId: '21',
        icon: require('../../assets/images/shortcut_kuaidi.png'),
      }, {
        ServiceName: '同城跑腿',
        ServiceId: '59',
        icon: require('../../assets/images/shortcut_paotui.png'),
      }],
      ConvenienceServiceList: {
        Title: '便民服务',
        Items: [{
          ServiceName: '快递上门',
          Price: '12',
          Unit: '次起',
          LogoUrl: [require('../../assets/images/convenience_service_express.png')]
        }, {
          ServiceName: '同城跑腿',
          Price: '10',
          Unit: '次起',
          LogoUrl: [require('../../assets/images/convenience_service_errand.png')]
        }]
      },
      superDiscountList: {
        Title: '',
        Items: [],
      },
      swiperOption: {
        notNextTick: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: 300000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        onTransitionStart(swiper) {
        },
      }
    }
  },
  mounted() {
    this.getRecommendList();

    if(true) {
      require('./index1.scss')
    } else {
      require('./index2.scss')
    }
  },
  activated() {
    this.getSuperDiscountList();
  },
  methods: {
    getRecommendList() {
      axios.post(API.Recommend, qs.stringify({}), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.recommendList = res.data.Body.RecommendBlock.slice(0, 2);
          this.recommendList[1].Items.push({
            ServiceId: '14',
            ServiceName: '冰箱清洗',
            Price: '130',
            Unit: '台',
            LogoUrl: [require('../../assets/images/index_bingxiangqingxi.jpg')]
          });
          this.recommendList[1].Items.push({
            ServiceId: '17',
            ServiceName: '饮水机清洗',
            Price: '90',
            Unit: '台',
            LogoUrl: [require('../../assets/images/index_yinshuijiqingxi.jpg')]
          });
          this.recommendList[1].Items.push({
            ServiceId: '16',
            ServiceName: '微波炉清洗',
            Price: '70',
            Unit: '台',
            LogoUrl: [require('../../assets/images/index_weiboluqingxi.jpg')]
          });
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    getSuperDiscountList() {
      axios.post(API.GetSuperDiscount, qs.stringify({
        Token: this.Token,
        IsNewVersion: '1',
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.superDiscountList.Items.splice(0);
          let list = res.data.Body;
          list.Items.forEach((value, index) => {
            value.IconUrl = require('../../assets/images/super_discount_' + index + '.png');
          });
          // this.superDiscountList.Title = list.Title;
          this.superDiscountList.Title = '为你推荐';
          list.Items.map(value => {
            if(value.SuperDiscountItem.DiscountContent.length > 0) {
              this.superDiscountList.Items.push(value);
            }
          });
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    routerTo(item) {
      if(item.ServiceId == '21') {
        this.routerToConvenience(0);
      } else if(item.ServiceId == '59') {
        this.routerToConvenience(1);
      } else {
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
    routerToConvenience(index) {
      if(index == '0') {
        this.$router.push({
          name: 'express'
        });
      } else if(index == '1') {
        this.$router.push({
          name: 'errand'
        });
      }
    },
    gotoOrderPlace(item) {
      this.$store.commit('SetThreeServiceId', item.ServiceId);
      this.$store.commit('SetThreeServiceName', item.ServiceName);
      this.$router.push({
        name: 'order_place',
      });
    }
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  components: {
    swiper,
    swiperSlide
  },
}
</script>

<style scoped lang="scss">

</style>