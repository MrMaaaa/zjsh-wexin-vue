<template>
<div style="height: 100%; position: relative;">
  <header class="header-search" id="header">
    <input class="search-text" :class="{ active: inputFocus }" @click="inputFocus = true" type="text" v-model="inputAddr" placeholder="小区/写字楼/大厦等">
    <span class="search-cancel" v-show="inputFocus == true" @click="inputFocus = false; inputAddr = ''">取消</span>
  </header>

  <div class="input-wrapper" v-show="inputFocus == true">
    <ul>
      <li class="list-item" v-for="item in inputResult" @click="backWithParam(item)">
        <span class="item-title">{{ item.title }}</span>
        <span class="item-address txt-over-hide">{{ item.address }}</span>
      </li>
    </ul>
  </div>

  <div class="map" id="map" v-show="inputFocus == false"></div>

  <ul class="arround-list" id="result" v-show="inputFocus == false">
    <li class="list-item" v-for="item in result" @click="backWithParam(item)">
      <span class="item-title">{{ item.title }}</span>
      <span class="item-address txt-over-hide">{{ item.address }}</span>
    </li>
  </ul>

  <m-loading bg-style="2" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';
import locationImg from '../../assets/images/address_ocation.png';

export default {
  name: 'address_select',
  data() {
    return {
      inputFocus: false,
      inputAddr: '',
      result: [],
      inputResult: [],
      point: {
        lng: 0,
        lat: 0
      },
      map: null,
      marker: null,
      isLoading: false,
    }
  },
  mounted() {
    let that = this;

    this.isLoading = true;

    document.getElementById('map').style.height = parseInt(screen.height) + 'px';

    // 从缓存中读取经纬度
    this.getPosition(function() {
      that.init();
      that.getSurroundingLocation(that.point);
    });
  },
  activated() {
    this.inputFocus = false;
    this.inputAddr = '';
  },
  methods: {
    // 地图初始化
    init() {
      let that = this;
      // 地图初始化
      this.map = new BMap.Map('map');
      // 根据经纬度坐标绘制地图
      let pit = new BMap.Point(this.point.lng, this.point.lat);
      this.map.centerAndZoom(pit, 15);

      // 添加标注
      this.refreshMarker(this.point, 0, this.map);

      // 监听地图拖动事件
      this.map.addEventListener('dragend', function(evt) {
        // 获取拖动后的中点
        that.point = that.map.getCenter();
        // 获取新坐标附近的位置信息
        that.getSurroundingLocation(that.point);
        // 更新标注
        that.refreshMarker(that.point, 0, this.map);
      })
    },
    // 获取当前坐标（经纬度）
    getPosition(callback) {
      let that = this;
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(result) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          that.point = result.point;
          that.isLoading = false;
          if(callback) {
            callback();
          }
        } else {
          that.alert(that.ALERT_MSG.POSITION_ERROR);
        }
      }, {
        enableHighAccuracy: true
      });
    },
    // 获取当前坐标附近位置信息
    getSurroundingLocation(point) {
      let that = this;

      let local = new BMap.LocalSearch(point, {
        onSearchComplete: function(results) {
          that.result.splice(0);
          if(local.getStatus() == BMAP_STATUS_SUCCESS) {
            for(let i = 0; i < results.getCurrentNumPois(); i++) {
              let addr = results.getPoi(i);
              addr.address = that.fixAddress(addr.address, addr.city, addr.province);
              that.result.push(addr);
            }
          }
        }
      });
      local.searchNearby('小区', point, 1000);
    },
    // 补全地址的省市信息
    fixAddress(address, city, province) {
      let isCity = false;
      let isProvince = false;
      if(address.indexOf(city) > -1) {
        isCity = true;
      }
      if(address.indexOf(province) > -1) {
        isProvince = true;
      }
      if(!isCity && !isProvince) {
        return province + city + address;
      } else {
        return address;
      }
    },
    // 根据point修改marker的位置
    refreshMarker(point, index, map) {
      // 定义图片位置
      let myIcon = new BMap.Icon(locationImg, new BMap.Size(32, 32), {
        offset: new BMap.Size(32, 32),
        imageOffset: new BMap.Size(0, 0)
      })
      // 清除上个marker
      this.map.removeOverlay(this.marker);
      // 声明新的marker
      this.marker = new BMap.Marker(point, {
        icon: myIcon
      });
      // 添加到地图上
      this.map.addOverlay(this.marker);
      // 返回当前marker（如果需要）
      return this.marker;
    },
    // 将选择的位置信息（地址，经度，维度）保存在sessionStorage，并后退到上一页
    backWithParam(val) {
      this.AddressAddedInfo.Address1 = val.address + val.title;
      this.AddressAddedInfo.Address1Lng = val.point.lng;
      this.AddressAddedInfo.Address1Lat = val.point.lat;
      this.$store.commit('SetAddressAddedInfo', this.AddressAddedInfo);
      // 返回上一页
      this.$router.go(-1);
    },
  },
  watch: {
    inputAddr() {
      let that = this;
      let local = new BMap.LocalSearch(that.map, {
        onSearchComplete: function(results) {
          that.inputResult.splice(0);
          if(local.getStatus() == BMAP_STATUS_SUCCESS) {
            for(let i = 0; i < results.getCurrentNumPois(); i++) {
              let addr = results.getPoi(i);
              addr.address = that.fixAddress(addr.address, addr.city, addr.province);
              that.inputResult.push(addr);
            }
          }
        }
      });
      local.search(that.inputAddr);
    }
  },
  computed: {
    ...mapState(['AddressAddedInfo', 'ALERT_MSG'])
  }
}
</script>

<style scoped>

/* common */

a
{
  color: #333;
}

/* common end */


/* header */

.header-search
{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  transform: translateZ(0);

  width: 100%;
  height: 44px;
  border-bottom: 1px solid #ddd;

  background: #fff;
}

.search-text
{
  box-sizing: border-box;

  width: 90%;
  height: 24px;
  margin: 10px 5% 0;
  padding-left: 5%;
  border: none;
  border-radius: 15px;

  background-color: #eee;
}

.search-text.active
{
  width: 80%;
  margin-right: 2%;
}

.search-cancel
{
  color: #40c0ff;
  font-size: 14px;
}

/* header end */


/* container */

.input-wrapper
{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 45px;
  background-color: #fff;

  z-index: 99;
}

.arround-list
{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  transform: translateZ(0);
  -webkit-overflow-scrolling: touch;

  width: 100%;
  max-height: 135px;

  background-color: #fff;
  overflow-y: scroll;
}

.list-item
{
  height: 66px;
  line-height: 33px;
  padding-left: 36px;
  background-color: #fff;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.list-item:not(:first-child)
{
  border-top: 1px solid #ddd;
}

.item-title
{
  display: block;
}

.item-address
{
  box-sizing: border-box;
  display: block;
  padding-right: 0.266667rem;

  color: #666;
}

.item-link
{
  display: block;

  width: 100%;
  height: 100%;
}

/* container end */
</style>