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
    <div class="send-item flex-row send-time" @click="openPicker(0)">
      <span class="title">寄件时间</span>

      <div class="flex-row">
        <span class="sel-item sel-time" :class="{ null: showData.name == '请选择' }">{{ showData.date }}</span>
        <img class="icon-link" src="../../assets/images/link.png">
      </div>
    </div>

    <div class="send-item flex-row send-name" @click="isSelName=true">
      <span class="title">物品名称</span>

      <div class="flex-row">
        <span class="sel-item sel-name" :class="{ null: showData.name == '请选择' }">{{ showData.name }}</span>
        <img class="icon-link" src="../../assets/images/link.png">
      </div>
    </div>

    <div class="send-item flex-row send-weight" @click="openPicker(1)">
      <span class="title">物品重量</span>

      <div class="flex-row">
        <span class="sel-item sel-weight" :class="{ null: showData.name == '请选择' }">{{ showData.weight }}</span>
        <img class="icon-link" src="../../assets/images/link.png">
      </div>
    </div>

    <div class="send-item flex-row send-way" @click="openPicker(2)">
      <span class="title">留言备注</span>

      <input class="sel-item" type="text" style="width: 6.986667rem;height: 90%;padding: 0;background-color: #fff;color: #333639;font-size: 14px;" v-model="errandNote">
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
            <span class="list-item" :class="{ active: nameFlag==0 }" @click="sureName($event, 0)">其他</span>
            <span class="list-item" :class="{ active: nameFlag==1 }" @click="sureName($event, 1)">美食</span>
            <span class="list-item" :class="{ active: nameFlag==2 }" @click="sureName($event, 2)">文件</span>
            <span class="list-item" :class="{ active: nameFlag==3 }" @click="sureName($event, 3)">蛋糕</span>
          </div>

          <div class="flex-row" style="margin-top: 0.32rem;">
            <span class="list-item" :class="{ active: nameFlag==4 }" @click="sureName($event, 4)">鲜花</span>
            <span class="list-item" :class="{ active: nameFlag==5 }" @click="sureName($event, 5)">钥匙</span>
            <span class="list-item" :class="{ active: nameFlag==6 }" @click="sureName($event, 6)">手机</span>
            <span class="list-item" style="visibility: hidden;"></span>
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
      }, {
        divider: true,
        content: '',
        className: 'slot4'
      }, {
        flex: 1,
        values: [],
        defaultIndex: 0,
        className: 'slot5',
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
      isSelName: false, // 显示物品选择菜单
      isSelNameCustom: false, // 显示物品自定义输入框
      showData: { // 显示的数据
        date: '请选择', // 选择的日期
        name: '请选择', // 选择的物品名称
        weight: '请选择', // 选择的重量
        way: '请选择' // 选择的付款方式
      },
      selData: { // 后台接口用数据
        date: '', // 选择的日期
        name: '', // 选择的物品名称
        weight: '', // 选择的重量
        way: '' // 选择的付款方式
      },
      errandNote: '', // 备注
      priceOrderId: '',
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
      addrFlag: '1', //地址类型： 0 无；1 寄件地址；2 收件地址
      estimatedPrice: '0',
      isLoading: false,
    }
  },
  mounted() {
    this.slots_datetime[0].values = ['今天', '明天'];
    this.slots_datetime[2].values = this.getAvailHour(1);
    this.slots_datetime[4].values = this.getAvailMinute(1);

    this.slots_weight[0].values = ['5公斤以下', '5-10公斤', '10-15公斤', '15-20公斤', '20-25公斤', '25-30公斤', '30-35公斤', '35-40公斤', '40-45公斤', '45-50公斤'];

    this.showData.weight = '5公斤以下';
    this.selData.weight = '5';
    this.nameFlag = '0';
    this.showData.name = '其他';
    this.selData.name = '其他';
  },
  activated() {
    if(this.$route.params.address) {
      this.updateAddress();
    }
  },
  methods: {
    onDateTimeChange(picker, values) {
      if(values[0] && values[1] && values[2]) {
        if (values[0] == '今天') {
          picker.setSlotValues(1, this.getAvailHour(true));
          if(values[1] == '立即') {
            picker.setSlotValues(2, ['立即']);
          } else if(values[1].indexOf(new Date().getHours()) > -1) {
            picker.setSlotValues(2, this.getAvailMinute(3));
          } else {
            picker.setSlotValues(2, this.getAvailMinute());
          }
        } else if(values[0] == '明天') {
          picker.setSlotValues(1, this.getAvailHour(false));
          if(values[1].indexOf(new Date().getHours()) > -1) {
            picker.setSlotValues(2, this.getAvailMinute(2));
          } else {
            picker.setSlotValues(2, this.getAvailMinute());
          }
        }
        if(this.dateTimePicker_now[0] != values[0]) {
          picker.setSlotValue(1, values[0]);
        }
        this.dateTimePicker_now.splice(0);
        this.dateTimePicker_now.push(values[0]);
        this.dateTimePicker_now.push(values[1]);
        this.dateTimePicker_now.push(values[2]);
      }
    },
    selectDateTime() {
      this.dateTimePicker_now[1] = this.dateTimePicker_now[1].replace('时', '');
      this.dateTimePicker_now[2] = this.dateTimePicker_now[2].replace('分', '');
      if (this.dateTimePicker_now[1] == '立即') {
        this.showData.date = this.dateTimePicker_now[1];
        this.selData.date = this.getDate(0) + ' ' + (new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()) + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes());
      } else {
        this.showData.date = this.dateTimePicker_now[0] + ' ' + this.dateTimePicker_now[1] + ':' + this.dateTimePicker_now[2];
        this.selData.date = this.getDate(0) + ' ' + this.dateTimePicker_now[1] + ':' + this.dateTimePicker_now[2];
      }
      this.isDateTimePicker = false;
      this.getErrandPrice();
    },
    onWeightChange(picker, values) {
      this.weightPicker_now = values[0];
    },
    selectWeight() {
      this.showData.weight = this.weightPicker_now;
      this.selData.weight = this.weightPicker_now.match(/\d{1,}公斤/gi)[0].replace('公斤', '');
      console.log(this.selData.weight);
      this.isWeightPicker = false;
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
    getDate(val) {
      //获取与今天相隔val天的日期
      val = parseInt(val);
      var date = new Date();
      date = new Date(parseInt(date.getTime()) + val * 86400000);
      var year = date.getFullYear();
      var month = parseInt(date.getMonth()) + 1;
      month = month < 10 ? '0' + month : month;
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      return year + '-' + month + '-' + day;
    },
    getAvailHour: function(isToday) {
      var arr = [];
      var date = new Date();
      var nowHour = date.getHours();
      var nowMinute = date.getMinutes();
      if (isToday) {
        //如果时间大于最晚时间，则不显示“今天”列表
        if (nowHour == 23 && nowMinute >= 55) {
          return arr;
        }
        //否则显示当前时间之后的时间段
        arr.push('立即');
        if (nowMinute <= 55) {
          arr.push((nowHour > 9 ? nowHour : '0' + nowHour) + '时');
        }
        var nextHour = nowHour + 1;
        if (nextHour == 24) {
          nextHour = 0;
        }
        for (var h = nextHour; h <= 23; h++) {
          arr.push((h > 9 ? h : '0' + h) + '时');
        }
        return arr;
      } else {
        //否则显示明天的可选时间
        //时间范围从今天开始计算24小时
        for (var h = 0; h <= nowHour; h++) {
          arr.push((h > 9 ? h : '0' + h) + '时');
        }
        return arr;
      }
    },
    getAvailMinute: function(type) {
      // type说明 1:今天 2:明天的最后一个小时 3:当前小时的可选分钟
      var arr = [];
      var date = new Date();
      var nowHour = date.getHours();
      var nowMinute = date.getMinutes();
      if (!type) {
        //获取所有可用的分钟
        for (var h = 5; h <= 55; h += 10) {
          arr.push((h > 9 ? h : '0' + h) + '分');
        }
        return arr;
      } else if (type == 1) {
        //获取“立即”
        if (nowHour == 23 && nowMinute >= 55) {
          return arr;
        }
        arr.push('立即');
        return arr;
      } else if (type == 2) {
        //获取当前分钟前的可选分钟
        for (var h = 5; h <= nowMinute; h += 10) {
          if (h >= nowMinute) {
            arr.push((h > 9 ? h : '0' + h) + '分');
          } else {
            arr.push((h > 9 ? h : '0' + h) + '分');
          }
        }
        return arr;
      } else if (type == 3) {
        // 获取当前分钟后的可选分钟
        // 正常版
        // if (nowMinute <= 5) {
        //   nowMinute = 5;
        // } else if (nowMinute > 5 && nowMinute <= 15) {
        //   nowMinute = 15;
        // } else if (nowMinute > 15 && nowMinute <= 25) {
        //   nowMinute = 25;
        // } else if (nowMinute > 25 && nowMinute <= 35) {
        //   nowMinute = 35;
        // } else if (nowMinute > 35 && nowMinute <= 45) {
        //   nowMinute = 45;
        // } else if (nowMinute > 45 && nowMinute <= 55) {
        //   nowMinute = 55;
        // } else {
        //   return arr;
        // }
        // 炫技版
        nowMinute = nowMinute < 10 ? '0' + nowMinute : nowMinute + '';
        nowMinute = parseInt(parseInt(nowMinute.split('')[1]) >= 5 ? (parseInt(nowMinute.split('')[0]) == 5 ? nowMinute : parseInt(nowMinute.split('')[0]) + 1 + '5') : parseInt(nowMinute.split('')[0]) + '5');

        for (; nowMinute <= 55; nowMinute += 10) {
          arr.push((nowMinute > 9 ? nowMinute : '0' + nowMinute) + '分');
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
            originRoute: 'errand'
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
      this.getErrandPrice();
    },
    getErrandPrice() {
      if (this.addrData.sender.id && this.addrData.receiver.id && this.selData.date) {
        this.estimatedPrice = '';
        axios.post(API.GetPaoTuiPrice, qs.stringify({
          Token: this.Token,
          SenderAddressId: this.addrData.sender.id,
          ReceiverAddressId: this.addrData.receiver.id,
          SubscribeTime: this.selData.date,
        }), {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          this.isLoading = false;
          if (res.data.Meta.ErrorCode == '0') {
            this.estimatedPrice = res.data.Body.Price;
            this.priceOrderId = res.data.Body.OrderId;
          } else {
            this.alert(res.data.Meta.ErrorMsg);
          }
        }).catch(err => {
          this.isLoading = false;
          this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
        });
      }
    },
    submitOrder() {
      if (this.selData.date != '' && this.selData.name != '' && this.selData.weight != '' && this.addrData.sender.show && this.addrData.receiver.show && this.estimatedPrice) {
        this.isLoading = true;
        axios.post(API.CreatePaoTuiOrder, qs.stringify({
          Token: this.Token,
          OrderType: '2',
          PayType: '1',
          Note: this.errandNote,
          PriceOrdeId: this.priceOrderId,
          SenderAddressId: this.addrData.sender.id,
          ReceiverAddressId: this.addrData.receiver.id,
          GoodsName: this.selData.name,
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
            this.alert('订单已提交', 1000);
            setTimeout(() => {
              this.$router.push({
                name: 'errand_order_detail',
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

  overflow: hidden;
}
.detail-sel .send-item
{
  height: 1.6rem;
  line-height: 1.6rem;
  padding-left: 0.44rem;
  padding-right: 0.44rem;

  background-color: #fff;
  text-align: center;
}
.detail-sel .send-item:not(:first-child)
{
  margin-top: 1px;
}
.detail-sel .flex-row .icon-link
{
  width: 0.2rem;
  height: 0.333333rem;
  margin-left: 0.426667rem;
}
.detail-sel .title
{
  display: block;

  color: #333639;
  font-size: 14px;
  line-height: 100%;
}
.detail-sel .sel-item
{
  display: block;

  color: #27b8f3;
  font-size: 16px;
}
.detail-sel .sel-item.null
{
  color: #999;
}
.price-estimate
{
  height: 1.6rem;
  line-height: 1.6rem;
  margin-top: 10px;
  padding: 0 0.44rem;

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