<template>
<div>
  <div class="address-sel">
    <div class="address-item flex-row address-send" @click="selectAddress(1)">
      <div>
        <img class="icon-address icon-send" src="../../assets/images/icon_send.png"><span v-show="!addrData.sender.show" class="label-address">请选择寄件地址</span>
      </div>

      <div v-show="addrData.sender.show" class="address-txt">
        <span class="txt-info txt-over-hide">{{ addrData.sender.name }} {{ addrData.sender.phone }}</span>
        <span class="txt-addr txt-over-hide">{{ addrData.sender.addr }}</span>
      </div>

      <img class="icon-link" src="../../assets/images/link.png">
    </div>

    <div class="address-line"></div>

    <div class="address-item flex-row address-receive" @click="selectAddress(2)">
      <div>
        <img class="icon-address icon-receive" src="../../assets/images/icon_receive.png"><span v-show="!addrData.receiver.show" class="label-address">请选择收件地址</span>
      </div>

      <div v-show="addrData.receiver.show" class="address-txt">
        <span class="txt-info txt-over-hide">{{ addrData.receiver.name }} {{ addrData.receiver.phone }}</span>
        <span class="txt-addr txt-over-hide">{{ addrData.receiver.addr }}</span>
      </div>

      <img class="icon-link" src="../../assets/images/link.png">
    </div>
  </div>

  <div class="detail-sel">
    <div class="flex-row">
      <div class="send-item send-time" @click="openPicker(0)">
        <span class="title">寄件时间</span>

        <span class="sel-item sel-time">{{ showData.date }}</span>
      </div>

      <div class="send-item send-name" @click="isSelName=true">
        <span class="title">物品名称</span>

        <span class="sel-item sel-name">{{ showData.name }}</span>
      </div>
    </div>

    <div class="flex-row">
      <div class="send-item send-weight" @click="openPicker(1)">
        <span class="title">物品重量</span>

        <span class="sel-item sel-weight">{{ showData.weight }}</span>
      </div>

      <div class="send-item send-way" @click="openPicker(2)">
        <span class="title">付款方式</span>

        <span class="sel-item sel-way">{{ showData.way }}</span>
      </div>
    </div>
  </div>

  <div class="price-estimate flex-row" v-show="estimatedPrice != '0' && estimatedPrice != ''">
    <span>运费预估</span>
    <span class="price">{{ estimatedPrice }}<span style="font-size: 14px;"> 元起</span></span>
  </div>

  <div class="submit">
    <button class="btn-submit" @click="submitOrder" type="button">提交订单</button>
  </div>

  <div class="send-name-selector" v-show="isSelName">
    <transition name="fade">
      <div class="wrapper" v-show="isSelName" @click="isSelName=false"></div>
    </transition>

    <transition name="slide">
      <div class="content" v-show="isSelName">
        <div class="cancel" @click="isSelName=false">取消</div>

        <div class="title">物品名称</div>

        <div class="list">
          <div class="flex-row">
            <span class="list-item" :class="{ active: nameFlag==0 }" @click="sureName($event, 0)">化妆品</span>
            <span class="list-item" :class="{ active: nameFlag==1 }" @click="sureName($event, 1)">衣物首饰</span>
            <span class="list-item" :class="{ active: nameFlag==2 }" @click="sureName($event, 2)">文件</span>
          </div>

          <div class="flex-row" style="margin-top: 0.32rem;">
            <span class="list-item" :class="{ active: nameFlag==3 }" @click="sureName($event, 3)">数码产品</span>
            <span class="list-item" :class="{ active: nameFlag==4 }" @click="sureName($event, 4)">食品</span>
            <span class="list-item" :class="{ active: isSelNameCustom }" @click="openSelNameCustom">其他</span>
          </div>

          <div class="custom-name" v-show="isSelNameCustom">
            <input type="text" v-model="customName" maxlength="10" placeholder="填写你的物品名称，最多10个字">

            <span class="sure" @click="sureCustomName">确定</span>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <div class="express-picker" v-show="isDateTimePicker">
    <transition name="fade">
      <div class="picker-wrapper" v-show="isDateTimePicker" @click="isDateTimePicker=false"></div>
    </transition>

    <transition name="slide">
      <div class="picker-container" v-show="isDateTimePicker">
        <div class="picker-header flex-row">
          <a class="header-btn" @click="isDateTimePicker=false">取消</a>
          <header class="header-content">寄件时间</header>
          <a class="header-btn" @click="selectDateTime">确定</a>
        </div>

        <mt-picker :slots="slots_datetime" @change="onDateTimeChange"></mt-picker>
      </div>
    </transition>
  </div>

  <div class="express-picker" v-show="isWeightPicker">
    <transition name="fade">
      <div class="picker-wrapper" v-show="isWeightPicker" @click="isWeightPicker=false"></div>
    </transition>

    <transition name="slide">
      <div class="picker-container" v-show="isWeightPicker">
        <div class="picker-header flex-row">
          <a class="header-btn" @click="isWeightPicker=false">取消</a>
          <header class="header-content">物品重量</header>
          <a class="header-btn" @click="selectWeight">确定</a>
        </div>

        <mt-picker :slots="slots_weight" @change="onWeightChange"></mt-picker>
      </div>
    </transition>
  </div>

  <div class="express-picker" v-show="isPayWayPicker">
    <transition name="fade">
      <div class="picker-wrapper" v-show="isPayWayPicker" @click="isPayWayPicker=false"></div>
    </transition>

    <transition name="slide">
      <div class="picker-container" v-show="isPayWayPicker">
        <div class="picker-header flex-row">
          <a class="header-btn" @click="isPayWayPicker=false">取消</a>
          <header class="header-content">付款方式</header>
          <a class="header-btn" @click="selectPayWay">确定</a>
        </div>

        <mt-picker :slots="slots_payway" @change="onPayWayChange"></mt-picker>
      </div>
    </transition>
  </div>

  <m-loading bg-style="0" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'express_detail',
  data() {
    return {
      slots_datetime: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }, {
        divider: true,
        content: '',
        className: 'slot2'
      }, {
        flex: 1,
        values: [],
        defaultIndex: 0,
        className: 'slot3',
        textAlign: 'center'
      }],
      dateTimePicker_now: [],
      isDateTimePicker: false,
      slots_weight: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      weightPicker_now: [],
      isWeightPicker: false,
      slots_payway: [{
        flex: 1,
        values: [],
        className: 'slot1',
        textAlign: 'center'
      }],
      isPayWayPicker: false,
      isSelName: false, //显示物品选择菜单
      isSelNameCustom: false, //显示物品自定义输入框
      showData: { //显示的数据
        date: '请选择', //选择的日期
        name: '请选择', //选择的物品名称
        weight: '请选择', //选择的重量
        way: '请选择' //选择的付款方式
      },
      selData: { //后台接口用数据
        date: '', //选择的日期
        name: '', //选择的物品名称
        weight: '', //选择的重量
        way: '' //选择的付款方式
      },
      addrData: {
        sender: {
          show: false,
          name: '',
          phone: '',
          addr: '',
          lng: '',
          lat: '',
          id: '',
          province: '',
          city: ''
        },
        receiver: {
          show: false,
          name: '',
          phone: '',
          addr: '',
          lng: '',
          lat: '',
          id: '',
          province: '',
          city: ''
        }
      },
      nameFlag: '-1', //选中的物品名称的index（非自定义）
      customName: '', //自定义物品名称
      addrFlag: '1', //地址类型： 0 无；1 寄件地址；2 收件地址
      estimatedPrice: '0',
      isLoading: false,
    }
  },
  mounted() {
    this.slots_datetime[0].values = [this.getDate(0) + ' 今天', this.getDate(1) + ' 明天', this.getDate(2) + ' 后天'];
    this.slots_datetime[2].values = this.getDateList(9, 18, 1);

    this.slots_weight[0].values = ['1kg', '2kg', '3kg', '4kg', '5kg', '6kg', '7kg', '8kg', '9kg', '10kg'];

    this.slots_payway[0].values = ['寄件人付', '收件人付'];

    let that = this;
    window.setProvince = function(data) {
      that.getAddressAreaName(data);
    }
  },
  activated() {
    if(this.$route.params.address) {
      this.updateAddress();
    }
  },
  methods: {
    onDateTimeChange(picker, values) {
      if(values[0] && values[1]) {
        if (values[0].split(' ')[1] == '今天') {
          let todayList = this.getDateList(9, 18, 1);
          if(todayList[0] == 'over') {
            picker.setSlotValues(0, [this.getDate(1) + ' 明天', this.getDate(2) + ' 后天']);
          } else {
            picker.setSlotValues(1, todayList);
          }
        } else {
          picker.setSlotValues(1, this.getDateList(9, 18, 0));
        }
        if(this.dateTimePicker_now[0] != values[0]) {
          picker.setSlotValue(1, values[0]);
        }
        this.dateTimePicker_now.splice(0);
        this.dateTimePicker_now.push(values[0]);
        this.dateTimePicker_now.push(values[1]);
      }
    },
    selectDateTime() {
      if(this.dateTimePicker_now[1] == '现在') {
        this.showData.date = this.dateTimePicker_now[0].split(' ')[1] + ' ' + this.dateTimePicker_now[1];
        this.selData.date = this.dateTimePicker_now[0].split(' ')[0] + ' ' + new Date().getHours() + ':' + new Date().getMinutes();
      } else {
        this.showData.date = this.dateTimePicker_now[0].split(' ')[1] + ' ' + this.dateTimePicker_now[1];
        this.selData.date = this.dateTimePicker_now[0].split(' ')[0] + ' ' + this.dateTimePicker_now[1];
      }
      this.isDateTimePicker = false;
    },
    onWeightChange(picker, values) {
      this.weightPicker_now = values[0];
    },
    selectWeight() {
      this.showData.weight = this.weightPicker_now;
      this.selData.weight = this.weightPicker_now.replace('kg', '');
      this.isWeightPicker = false;
    },
    onPayWayChange(picker, values) {
      this.payWayPicker_now = values[0];
    },
    selectPayWay() {
      this.showData.way = this.payWayPicker_now;
      this.selData.way = this.payWayPicker_now == '寄件人付' ? '0' : '1';
      this.isPayWayPicker = false;
    },
    openPicker(type) {
      if(type == 0) {
        this.isDateTimePicker = true;
      } else if(type == 1) {
        this.isWeightPicker = true;
      } else if(type == 2) {
        this.isPayWayPicker = true;
      }
    },
    sureName(event, index) {
      this.isSelNameCustom = false;
      this.customName = '';
      this.nameFlag = index;
      this.showData.name = event.target.innerText;
      this.selData.name = event.target.innerText;
      this.isSelName = false;
    },
    sureCustomName() {
      if (this.customName == '') {
        this.alert('请填写物品名称');
      } else {
        this.showData.name = this.customName;
        this.selData.name = this.customName;
        this.isSelName = false;
      }
    },
    openSelNameCustom() {
      this.nameFlag = '-1';
      this.isSelNameCustom = true;
    },
    getDate(val) {
      //获取与今天相隔val天的日期
      val = parseInt(val);
      var date = new Date();
      date = new Date(parseInt(date.getTime()) + val * 86400000);
      var year = date.getFullYear();
      var month = (parseInt(date.getMonth()) + 1) + '';
      var day = date.getDate();
      return year + '-' + month + '-' + day;
    },
    getDateList(start, end, isToday) {
      //获取可供选择的时间列表，如果为今天则需要与当前时间作对比
      var arr = [];
      if (isToday) {
        var date = new Date();
        var nowHour = date.getHours();
        var nowMinute = date.getMinutes();
        //如果时间大于最晚时间，则不显示“今天”列表
        if (nowHour > end || (nowHour == end && nowMinute >= 30)) {
          arr.push('over');
          return arr;
        }
        //否则显示当前时间之后的时间段
        arr.push('现在');
        if (nowHour <= end && nowMinute < 30) {
          arr.push(nowHour + ':' + '30');
        }
        for (var h = nowHour + 1; h <= end; h++) {
          var hh = h > 9 ? h : '0' + h;
          arr.push(hh + ':' + '00');
          arr.push(hh + ':' + '30');
        }
        return arr;

      } else {
        for (var h = start; h <= end; h++) {
          var hh = h > 9 ? h : '0' + h;
          arr.push(hh + ':' + '00');
          arr.push(hh + ':' + '30');
        }
        return arr;
      }
    },
    selectAddress(type) {
      if(this.IsLogin === '1') {
        this.addrFlag = type;
        this.$router.push({
          name: 'address_list',
          params: {
            originRoute: 'express'
          }
        });
      } else {
        this.openLogin();
      }
    },
    updateAddress() {
      if (this.addrFlag == '1' && this.$route.params.address) {
        this.addrData.sender.show = true;
        this.addrData.sender.name = this.$route.params.address.Contact;
        this.addrData.sender.phone = this.$route.params.address.PhoneNumber;
        this.addrData.sender.addr = this.$route.params.address.Address1 + this.$route.params.address.Address2;
        this.addrData.sender.lng = this.$route.params.address.Address1Lng;
        this.addrData.sender.lat = this.$route.params.address.Address1Lat;
        this.addrData.sender.id = this.$route.params.address.Id;
      } else if (this.addrFlag == '2' && this.$route.params.address) {
        this.addrData.receiver.show = true;
        this.addrData.receiver.name = this.$route.params.address.Contact;
        this.addrData.receiver.phone = this.$route.params.address.PhoneNumber;
        this.addrData.receiver.addr = this.$route.params.address.Address1 + this.$route.params.address.Address2;
        this.addrData.receiver.lng = this.$route.params.address.Address1Lng;
        this.addrData.receiver.lat = this.$route.params.address.Address1Lat;
        this.addrData.receiver.id = this.$route.params.address.Id;
      }
      if (this.$route.params.address) {
        // 向百度发起jsonp请求
        let body = document.getElementsByTagName('body')[0];
        let script = document.createElement('script');
        script.setAttribute('id', 'abcd');
        script.setAttribute('src', 'https://api.map.baidu.com/geocoder/v2/?' + decodeURIComponent(qs.stringify({
          ak: 'u8SIb8KCVSxsAsfEcd5bLv0LZuO4zDop',
          location: this.$route.params.address.Address1Lat + ',' + this.$route.params.address.Address1Lng,
          output: 'json',
          callback: 'window.setProvince'
        })));
        body.appendChild(script);
        setTimeout(() => {
          body.removeChild(script);
        }, 0);
      }
    },
    getAddressAreaName(data) {
      if(this.addrFlag == '1') {
        this.addrData.sender.province = data.result.addressComponent.province;
        this.addrData.sender.city = data.result.addressComponent.city;
      } else if(this.addrFlag == '2') {
        this.addrData.receiver.province = data.result.addressComponent.province;
        this.addrData.receiver.city = data.result.addressComponent.city;
      }

      if(this.addrData.sender.id && this.addrData.receiver.id) {
        this.estimatedPrice = this.getExpressPrice(this.addrData.sender, this.addrData.receiver);
      }
    },
    getExpressPrice(send, receive) {
      //首先判断是否为同城件（city是否相同）
      if (send.province == receive.province && send.city == receive.city && send.city != '') {
        return '12';
      } else {
        //非同城件

        //江浙沪内部
        if ((send.province.indexOf('江苏') != '-1' || send.province.indexOf('浙江') != '-1' || send.province.indexOf('上海') != '-1') && (receive.province.indexOf('江苏') != '-1' || receive.province.indexOf('浙江') != '-1' || receive.province.indexOf('上海') != '-1')) {
          return '12';
        } else {
          //江浙沪到安徽
          if ((send.province.indexOf('江苏') != '-1' || send.province.indexOf('浙江') != '-1' || send.province.indexOf('上海') != '-1') && receive.province.indexOf('安徽') != '-1') {
            return '14';
          } else if (send.province.indexOf('西藏') != '-1' || receive.province.indexOf('西藏') != '-1') {
            return '24';
          } else if (send.province.indexOf('新疆') != '-1' || receive.province.indexOf('新疆') != '-1') {
            return '20';
          } else {
            return '18';
          }
        }
      }
    },
    submitOrder() {
      if (this.selData.date != '' && this.selData.name != '' && this.selData.weight != '' && this.selData.way != '' && this.addrData.sender.show && this.addrData.receiver.show) {
        this.isLoading = true;
        axios.post(API.CreateKdEOrder, qs.stringify({
          Token: this.Token,
          SenderAddressId: this.addrData.sender.id,
          ReceiverAddressId: this.addrData.receiver.id,
          GoodsName: this.selData.name,
          PayType: this.selData.way,
          OrderFrom: '210',
          ServiceTime: this.selData.date,
          GoodsWeight: this.selData.weight
        }), {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          this.isLoading = false;
          if (res.data.Meta.ErrorCode == '0') {
            this.alert('订单已提交，快递员将在2小时内上门取件', 1000);
            setTimeout(() => {
              this.$router.push({
                name: 'express_order_detail',
                params: {
                  orderId: res.data.Body.OrderId
                }
              });
            }, 1000);
          } else {
            this.alert(res.data.Meta.ErrorMsg);
          }
        }).catch(err => {
          this.isLoading = false;
          this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
        });
      } else {
        var msg = '';
        if (!this.addrData.sender.show) msg = '请选择寄件地址';
        else if (!this.addrData.receiver.show) msg = '请选择收件地址';
        else if (this.selData.date == '') msg = '请选择寄件时间';
        else if (this.selData.name == '') msg = '请选择物品名称';
        else if (this.selData.weight == '') msg = '请选择物品重量';
        else if (this.selData.way == '') msg = '请选择付款方式';
        this.alert(msg);
      }
    },
  },
  computed: {
    ...mapState(['Token', 'IsLogin', 'ALERT_MSG']),
  }
}
</script>

<style scoped>
.address-sel
{
  background-color: #fff;
  overflow: hidden;
}
.address-sel .address-item
{
  height: 2.266667rem;
  padding-left: 0.8rem;
  padding-right: 0.4rem;
}
.address-sel .address-item .address-txt
{
  width: 7rem;
}
.address-item .address-txt .txt-info,
.address-item .address-txt .txt-addr
{
  display: block;

  color: #333639;
  font-size: 14px;
}
.address-sel .address-line
{
  height: 1px;
  margin-left: 0.4rem;
  background-color: #eef2f5;
}
.address-sel .icon-address
{
  width: 0.8rem;

  vertical-align: middle;
}
.address-sel .label-address
{
  margin-left: 0.4rem;

  color: #999;
  font-size: 14px;
  vertical-align: middle;
}
.icon-link
{
  width: 0.22rem;
  height: 0.36rem;
  vertical-align: middle;
}
.detail-sel
{
  margin-top: 0.266667rem;

  background-color: #fff;
  overflow: hidden;
}
.detail-sel .send-item
{
  box-sizing: border-box;
  flex: 1;
  -webkit-flex: 1;

  width: 50%;
  height: 2.266667rem;

  text-align: center;
}
.detail-sel .flex-row:first-child .send-item
{
  border-bottom: 1px solid #eef2f5;
}
.detail-sel .flex-row:first-child .send-item:first-child
{
  border-right: 1px solid #eef2f5;
}
.detail-sel .flex-row:last-child .send-item:last-child
{
  border-left: 1px solid #eef2f5;
}
.detail-sel .title
{
  display: block;

  color: #333639;
  font-size: 14px;
  line-height: 100%;
  margin-top: 0.533333rem;
}
.detail-sel .sel-item
{
  display: block;

  margin-top: 0.4rem;
  line-height: 100%;

  color: #27b8f3;
  font-size: 16px;
}
.detail-sel .sel-item.null
{
  color: #999;
}
.price-estimate
{
  height: 50px;
  line-height: 50px;
  margin-top: 10px;
  padding: 0 30px;

  background-color: #fff;
  color: #333639;
  font-size: 14px;
}
.price-estimate .price
{
  color: #f93e24;
  font-size: 24px;
}
.submit
{
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
  height: 1.946667rem;

  background-color: #fff;
  transform: translateZ(0);
}
.submit .btn-submit
{
  display: block;
  width: 8.666667rem;
  height: 1.146667rem;
  border: none;
  border-radius: 4px;
  margin: 0.4rem auto;

  background-color: #27b8f3;
  color: #fefeff;
  font-size: 16px;
}
.send-name-selector
{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  transform: translateZ(0);

  width: 100%;
  height: 100%;
}
.send-name-selector .wrapper
{
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.6);
  opacity: 1;
}
.send-name-selector .content
{
  position: absolute;
  /*bottom: -220px;*/
  bottom: 0;
  left: 0;

  box-sizing: border-box;
  width: 100%;
  padding: 0.48rem 0.48rem 0.933333rem;

  background-color: #fff;
}
.send-name-selector .title
{
  color: #333639;
  font-size: 18px;
  text-align: center;
}
.send-name-selector .cancel
{
  position: absolute;
  top: 18px;
  left: 18px;

  color: #333639;
  font-size: 16px;
}
.send-name-selector .list
{
  position: relative;

  margin-top: 0.746667rem;
}
.send-name-selector .list .list-item
{
  width: 2.8rem;
  height: 1.2rem;
  line-height: 1.2rem;
  border: 1px solid #eef2f5;
  border-radius: 4px;

  color: #333639;
  font-size: 16px;
  text-align: center;
}
.send-name-selector .list .list-item.active
{
  border-color: #27b8f3;
  background-color: #27b8f3;
  color: #fff;
}
.send-name-selector .custom-name
{
  margin-top: 0.426667rem;
}
.send-name-selector .custom-name input
{
  box-sizing: border-box;
  width: 100%;
  height: 1.2rem;
  border: 1px solid #eef2f5;
  outline: none;
  padding-left: 0.4rem;

  font-size: 14px;
}
.send-name-selector .custom-name input::-webkit-input-placeholder
{
  font-size: 14px;
  color: #ccc;
}
.send-name-selector .custom-name .sure
{
  position: absolute;
  bottom: 0;
  right: 0.666667rem;

  height: 1.2rem;
  line-height: 1.2rem;

  color: #333639;
  font-size: 16px;
}
.send-name-selector .custom-name .sure::before
{
  content: '';
  display: block;
  position: absolute;
  left: -0.666667rem;
  top: 0.066667rem;
  width: 1px;
  height: 1.066667rem;
  background-color: #eef2f5;
}
.express-picker
{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
}
.express-picker .picker-wrapper
{
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.6);
}
.express-picker .picker-container
{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  background-color: #fff;
}
.picker-container .header-btn
{
  display: block;
  height: 1.066667rem;
  line-height: 1.066667rem;
  padding: 0 0.2666666rem;
  color: #333639;
  font-size: 16px;
}
.picker-container .header-content
{
  height: 1.066667rem;
  line-height: 1.066667rem;
  color: #333639;
  font-size: 18px;
}
.fade-enter,
.fade-leave-to
{
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active
{
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to
{
  transform: translateY(220px);
}
.slide-enter-active,
.slide-leave-active
{
  transition: all 0.3s;
}
</style>
<style>
.picker-item.picker-selected
{
  font-size: 22px;
}
</style>