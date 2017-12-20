<template>
<div style="height: 100%; position: relative;">
  <header class="header-search flex-row" id="header">
    <m-textarea style="height: 100%; border-radius: 6px; background: #eef2f5;" :textareaClasses="inputAddr !== '' ? 'active' : ''" :m-text.sync="inputAddr">
      <span class="search-placeholder" slot="placeholder"><img class="icon-search" src="../../assets/images/icon_search.png">小区/写字楼/大厦等</span>
    </m-textarea>
    <span class="search-cancel" v-if="inputAddr !== ''" @click="inputAddr = ''">取消</span>
  </header>

  <div class="input-wrapper" v-if="inputAddr !== ''">
    <ul v-show="inputResult.length > 0">
      <li class="list-item" v-for="item in inputResult" :key="item.point.lng" @click="backWithParam(item)">
        <span class="item-title">{{ item.title }}</span>
        <span class="item-address txt-over-hide">{{ item.address }}</span>
      </li>
    </ul>
    <p class="no-result" v-show="inputResult.length === 0">请输入详细地址，如小区、写字楼、大厦……</p>
  </div>

  <div class="map" id="map" v-show="inputAddr === ''"></div>

  <ul class="arround-list" id="result" v-show="inputAddr === ''">
    <li class="list-item txt-over-hide" v-for="(item,key) in result" :key="key" @click="backWithParam(item)">
      <span class="item-title"><span v-if="key === 0" class="now">[当前]</span>{{ item.title }}</span>
      <span class="item-address txt-over-hide">{{ item.address }}</span>
    </li>
  </ul>
</div>
</template>

<script>
import { mapState } from 'vuex';
import locationImg from '../../assets/images/address_map.png';
import MTextarea from '../../components/common/m-textarea.vue';

export default {
  name: 'address_select',
  data() {
    return {
      inputAddr: '',
      result: [],
      inputResult: [],
      point: {
        lng: 0,
        lat: 0
      },
      map: null,
      marker: null,
    }
  },
  components: {
    MTextarea
  },
  mounted() {
    this.$loading.open(2);

    document.getElementById('map').style.height = parseInt(screen.height) + 'px';

    // 从缓存中读取经纬度
    this.getPosition(() => {
      this.init();
      this.getSurroundingLocation(this.point);
    });
  },
  activated() {
    this.inputAddr = '';
  },
  methods: {
    // 地图初始化
    init() {
      // 地图初始化
      this.map = new BMap.Map('map');
      // 根据经纬度坐标绘制地图
      let pit = new BMap.Point(this.point.lng, this.point.lat);
      this.map.centerAndZoom(pit, 15);

      // 添加标注
      this.refreshMarker(this.point, 0, this.map);

      // 监听地图拖动事件
      this.map.addEventListener('dragend', evt => {
        // 获取拖动后的中点
        this.point = this.map.getCenter();
        // 获取新坐标附近的位置信息
        this.getSurroundingLocation(this.point);
        // 更新标注
        this.refreshMarker(this.point, 0, this.map);
      })
    },
    // 获取当前坐标（经纬度）
    getPosition(callback) {
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(result => {
        if (geolocation.getStatus() == window.BMAP_STATUS_SUCCESS) {
          this.point = result.point;
          this.$loading.close();
          callback && callback();
        } else {
          this.$alert(this.ALERT_MSG.POSITION_ERROR);
        }
      }, {
        enableHighAccuracy: true
      });
    },
    // 获取当前坐标附近位置信息
    getSurroundingLocation(point) {
      let local = new BMap.LocalSearch(point, {
        onSearchComplete: results => {
          this.result.splice(0);
          if(local.getStatus() == window.BMAP_STATUS_SUCCESS) {
            for(let i = 0; i < results.getCurrentNumPois(); i++) {
              let addr = results.getPoi(i);
              addr.address = this.fixAddress(addr.address, addr.city, addr.province);
              this.result.push(addr);
            }
          }
        }
      });
      local.searchNearby('小区', point, 1000);
    },
    // 获取不包含省市区的详细地址信息
    clearAddress(address = '', province = '', city = '', district = '') {
      return address.replace(province, '').replace(city, '').replace(district, '');
    },
    // 补全地址的省市信息
    fixAddress(address = '', city = '', province = '') {
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
        imageOffset: new BMap.Size(0, 0),
        imageSize: new BMap.Size(32, 32)
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
      this.AddressAddedInfo.Address1Lng = val.point.lng;
      this.AddressAddedInfo.Address1Lat = val.point.lat;
      new BMap.Geocoder().getLocation(val.point, res => {
        // Address1: 省市区
        // Address2: 自定义地址信息
        this.AddressAddedInfo.Address1 = res.addressComponents.province + res.addressComponents.city + res.addressComponents.district;
        this.AddressAddedInfo.Address2 = this.clearAddress(val.address + val.title, res.addressComponents.province, res.addressComponents.city, res.addressComponents.district);
        this.$store.commit('SetAddressAddedInfo', this.AddressAddedInfo);
        this.$router.back();
      });
    },
  },
  watch: {
    inputAddr() {
      let local = new BMap.LocalSearch(this.map, {
        onSearchComplete: results => {
          this.inputResult.splice(0);
          if(local.getStatus() == window.BMAP_STATUS_SUCCESS) {
            for(let i = 0; i < results.getCurrentNumPois(); i++) {
              let addr = results.getPoi(i);
              if(addr.city && addr.province) {
                addr.address = this.fixAddress(addr.address, addr.city, addr.province);
                this.inputResult.push(addr);
              }
            }
          }
        }
      });
      local.search(this.inputAddr);
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
  justify-content: space-evenly;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  transform: translateZ(0);
  box-sizing: border-box;
  width: 100%;
  height: 1.333333rem;
  padding: 0.133333rem;
  border-bottom: 1px solid #ddd;
  background: #fff;
  text-align: center;
}

.header-search .search-placeholder
{
  line-height: 1.066667rem;
  color: #999;
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
}

.header-search .search-placeholder .icon-search
{
  width: 0.48rem;
  height: 0.48rem;
  margin-right: 0.2rem;
  vertical-align: middle;
}

.search-text
{
  box-sizing: border-box;
  display: block;
  width: 95%;
  height: 1.066667rem;
  padding-left: 5%;
  border-radius: 2px;
  background-color: #eee;
  color: #333639;
  text-align: center;
  font-size: 16px;
}

.search-text.active
{
  width: 8.266667rem;
}

.search-cancel
{
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
  width: 1.333333rem;
  color: #27b8f3;
  font-size: 14px;
  text-align: center;
}

/* header end */


/* container */

.input-wrapper
{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 1.2rem;
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
  max-height: 5.333333rem;

  background-color: #fff;
  overflow-y: scroll;
}

.list-item
{
  position: relative;
  height: 1.76rem;
  line-height: 0.88rem;
  padding-left: 0.96rem;
  background-color: #fff;
  font-size: 14px;
}

.list-item::before
{
  content: '';
  position: absolute;
  top: 50%;
  left: 0.16rem;
  transform: translateY(-50%) translateZ(0);
  display: block;
  width: 0.64rem;
  height: 0.64rem;
  background: url(../../assets/images/address_location.png) no-repeat;
  background-size: 100% 100%;
}

.list-item:not(:first-child)
{
  border-top: 1px solid #ddd;
}

.no-result
{
  margin-top: 0.266667rem;
  padding: 0 0.266667rem;
  font-size: 14px;
  color: #666;
}

.item-title
{
  display: block;
}

.item-title .now
{
  color: #27b8f3;
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