<template>
<div class="router-view">
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

    <div class="send-item flex-row send-name" @click="isSelName = true">
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

      <input class="sel-item remarks" type="text" v-model="errandNote">
    </div>
  </div>

  <div class="price-estimate flex-row" v-show="estimatedPrice != '0' && estimatedPrice != ''">
    <span>运费预估</span>
    <span class="price">{{ estimatedPrice }}<span style="font-size: 14px;"> 元起</span></span>
  </div>

  <div ref="btnWraper" class="submit">
    <button class="btn-submit" @click="submitOrder" type="button">提交订单</button>
  </div>

  <transition name="fade">
    <div class="picker-wrapper" v-if="isDateTimePicker || isWeightPicker || isSelName" @click="pickerClose"></div>
  </transition>

  <transition name="slide">
    <div class="picker-container send-name-selector" v-if="isSelName">
      <div class="content">
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
    </div>
  </transition>

  <transition name="slide">
    <div class="picker-container" v-if="isDateTimePicker">
      <div class="picker-header flex-row">
        <a class="header-btn btn-cancel" @click="isDateTimePicker=false">取消</a>
        <header class="header-content">寄件时间</header>
        <a class="header-btn btn-confirm" @click="selectDateTime">确定</a>
      </div>

      <mt-picker :slots="slots_datetime" @change="onDateTimeChange"></mt-picker>
    </div>
  </transition>

  <transition name="slide">
    <div class="picker-container" v-if="isWeightPicker">
      <div class="picker-header flex-row">
        <a class="header-btn btn-cancel" @click="isWeightPicker=false">取消</a>
        <header class="header-content">物品重量</header>
        <a class="header-btn btn-confirm" @click="selectWeight">确定</a>
      </div>

      <mt-picker :slots="slots_weight" @change="onWeightChange"></mt-picker>
    </div>
  </transition>
</div>
</template>

<script>
import { mapState } from 'vuex';
import SupportCity from '../../config/errandCity.js';

export default {
  name: 'errand_detail',
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
      },
      selData: { // 后台接口用数据
        date: '', // 选择的日期
        name: '', // 选择的物品名称
        weight: '', // 选择的重量
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
      addrFlag: '0', //地址类型： 0 无；1 寄件地址；2 收件地址
      estimatedPrice: '',
      errandType: '0' // 0 不支持 1闪送 2UU
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
    if(this.addrFlag != '0') {
      this.updateAddress();
    }
  },
  methods: {
    pickerClose() {
      this.isSelName = false;
      this.isWeightPicker = false;
      this.isDateTimePicker = false;
    },
    onDateTimeChange(picker, values) {
      if(values[0] && values[1] && values[2]) {
        if (values[0] == '今天') {
          picker.setSlotValues(1, this.getAvailHour(true));
          if(values[1] == '立即') {
            picker.setSlotValues(2, ['立即']);
          } else if(values[1].indexOf(new Date().getHours()) > -1 || new Date().getMinutes() >= 30 && values[1].indexOf(new Date().getHours() + 1) > -1) {
            picker.setSlotValues(2, this.getAvailMinute(3));
          } else if(this.errandType === '1' && values[1].indexOf(new Date().getHours() + 2) > -1) {
            // 如果是闪送并且选中了2小时后的时间
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
        this.selData.date = this.getDate(0) + ' ' + (new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()) + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()) + ':00';
      } else {
        this.showData.date = this.dateTimePicker_now[0] + ' ' + this.dateTimePicker_now[1] + ':' + this.dateTimePicker_now[2];
        this.selData.date = (this.dateTimePicker_now[0] == '明天' ? this.getDate(1) : this.getDate(0)) + ' ' + this.dateTimePicker_now[1] + ':' + this.dateTimePicker_now[2] + ':00';
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

      this.getErrandPrice();
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

      this.getErrandPrice();
    },
    //获取与今天相隔val天的日期
    getDate(val) {
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
    /*getAvailHour(isToday) {
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
    },*/
    getAvailHour(isToday) {
      var arr = [];
      var date = new Date();
      var nowHour = date.getHours();
      var nowMinute = date.getMinutes();
      if (isToday) {
        //如果时间大于最晚时间，则不显示“今天”列表
        if (this.errandType === '1' && nowHour >= 21 && nowMinute >= 30) {
          return arr;
        } else if (nowHour >= 23 && nowMinute >= 30) {
          return arr;
        }
        //否则显示当前时间之后的时间段
        arr.push('立即');
        var nextHour = nowHour;
        if (this.errandType === '1') {
          if (nowMinute >= 55) {
            nextHour += 3;
          } else {
            nextHour += 2;
          }
        } else {
          if (nowMinute > 25) {
            nextHour++;
          }
        }
        if (nextHour >= 24) {
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
    getAvailMinute(type) {
      var arr = [];
      var date = new Date();
      var nowHour = date.getHours();
      var nowMinute = date.getMinutes();
      var originMin = nowMinute;

      if (this.errandType !== '1') {
        // uu要求半小时后
        originMin += 30;
        if (originMin >= 60) {
          originMin -= 60;
        }
        originMin = originMin + (5 - originMin % 5);
      } else {
        // 闪送
        originMin = originMin + (5 - originMin % 5);
      }
      if (!type) {
        //获取所有可用的分钟
        var h = originMin < 10 ? '0' + originMin: '' + originMin;
        h = h[1] >= 5 ? 5 : 0;
        for (; h <= 55; h += 10) {
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
        var h = (5 - originMin % 5);
        for (; h <= originMin; h += 10) {
          arr.push((h > 9 ? h : '0' + h) + '分');
        }
        return arr;
      } else if (type == 3) {
        for (; originMin <= 55; originMin += 10) {
          arr.push((originMin > 9 ? originMin : '0' + originMin) + '分');
        }
        return arr;
      }
    },
    // type说明 1:立即 2:明天的最后一个小时 3:当前小时的可选分钟
    // getAvailMinute(type) {
    //   var arr = [];
    //   var date = new Date();
    //   var nowHour = date.getHours();
    //   var nowMinute = date.getMinutes();
    //   var originMin = (nowMinute < 10) ? ('0' + nowMinute) : ('' + nowMinute);
    //   originMin = (originMin[1] > 5) ? 0 : 5;
    //   if (!type) {
    //     //获取所有可用的分钟
    //     for (; originMin <= 55; originMin += 10) {
    //       arr.push((originMin > 9 ? originMin : '0' + originMin) + '分');
    //     }
    //     return arr;
    //   } else if (type == 1) {
    //     //获取“立即”
    //     if (nowHour == 23 && nowMinute >= 55) {
    //       return arr;
    //     }
    //     arr.push('立即');
    //     return arr;
    //   } else if (type == 2) {
    //     //获取当前分钟前的可选分钟
    //     for (; originMin <= nowMinute; originMin += 10) {
    //       if (originMin >= nowMinute) {
    //         arr.push((originMin > 9 ? originMin : '0' + originMin) + '分');
    //       } else {
    //         arr.push((originMin > 9 ? originMin : '0' + originMin) + '分');
    //       }
    //     }
    //     return arr;
    //   } else if (type == 3) {
    //     originMin = 5 - nowMinute % 5 + nowMinute;
    //     // 获取当前分钟后的可选分钟
    //     // 正常版
    //     // if (nowMinute <= 5) {
    //     //   nowMinute = 5;
    //     // } else if (nowMinute > 5 && nowMinute <= 15) {
    //     //   nowMinute = 15;
    //     // } else if (nowMinute > 15 && nowMinute <= 25) {
    //     //   nowMinute = 25;
    //     // } else if (nowMinute > 25 && nowMinute <= 35) {
    //     //   nowMinute = 35;
    //     // } else if (nowMinute > 35 && nowMinute <= 45) {
    //     //   nowMinute = 45;
    //     // } else if (nowMinute > 45 && nowMinute <= 55) {
    //     //   nowMinute = 55;
    //     // } else {
    //     //   return arr;
    //     // }
    //     // 炫技版
    //     // nowMinute = nowMinute < 10 ? '0' + nowMinute : nowMinute + '';
    //     // nowMinute = parseInt(parseInt(nowMinute.split('')[1]) >= 5 ? (parseInt(nowMinute.split('')[0]) == 5 ? nowMinute : parseInt(nowMinute.split('')[0]) + 1 + '5') : parseInt(nowMinute.split('')[0]) + '5');

    //     // for (; nowMinute <= 55; nowMinute += 10) {
    //     //   arr.push((nowMinute > 9 ? nowMinute : '0' + nowMinute) + '分');
    //     // }
    //     for (; originMin <= 55; originMin += 10) {
    //       arr.push((originMin > 9 ? originMin : '0' + originMin) + '分');
    //     }
    //     return arr;
    //   }
    // },
    selectAddress(type) {
      if(this.IsLogin === '1') {
        this.addrFlag = type;
        this.$router.push({
          name: 'address_list',
        });
      } else {
        this.$router.push({
          name: 'login',
          params: {
            callback: () => {
              // 这里如果不使用定时器就会直接跳转到首页,原因尚不清楚
              window.setTimeout(() => {
                this.selectAddress(type);
              }, 50);
            }
          }
        });
      }
    },
    updateAddress() {
      let addr = this.SelectedAddress;
      this.$store.commit('SetSelectedAddress', {});
      if (this.addrFlag == '1' && addr.Id) {
        this.addrData.sender.show = true;
        this.addrData.sender.name = addr.Contact;
        this.addrData.sender.phone = addr.PhoneNumber;
        this.addrData.sender.addr = addr.Address1 + addr.Address2;
        this.addrData.sender.lng = addr.Address1Lng;
        this.addrData.sender.lat = addr.Address1Lat;
        this.addrData.sender.id = addr.Id;
        if(this.addrData.receiver.id == this.addrData.sender.id) {
          this.addrData.receiver.name = addr.Contact;
          this.addrData.receiver.phone = addr.PhoneNumber;
          this.addrData.receiver.addr = addr.Address1 + addr.Address2;
          this.addrData.receiver.lng = addr.Address1Lng;
          this.addrData.receiver.lat = addr.Address1Lat;
          this.addrData.receiver.id = addr.Id;
        }
      } else if (this.addrFlag == '2' && addr.Id) {
        this.addrData.receiver.show = true;
        this.addrData.receiver.name = addr.Contact;
        this.addrData.receiver.phone = addr.PhoneNumber;
        this.addrData.receiver.addr = addr.Address1 + addr.Address2;
        this.addrData.receiver.lng = addr.Address1Lng;
        this.addrData.receiver.lat = addr.Address1Lat;
        this.addrData.receiver.id = addr.Id;
        if(this.addrData.sender.id == addr.Id) {
          this.addrData.sender.name = addr.Contact;
          this.addrData.sender.phone = addr.PhoneNumber;
          this.addrData.sender.addr = addr.Address1 + addr.Address2;
          this.addrData.sender.lng = addr.Address1Lng;
          this.addrData.sender.lat = addr.Address1Lat;
          this.addrData.sender.id = addr.Id;
        }
      }

      if (this.addrData.sender.id && this.addrData.sender.id === this.addrData.receiver.id) {
        this.$alert('地址相同！请新增一个地址');
      } else {
        this.getErrandType();
        this.getErrandPrice();
      }
    },
    getErrandType() {
      if (this.addrData.sender.id && this.addrData.sender.id === this.addrData.receiver.id) {
        this.$alert('地址相同！请新增一个地址');
      } else if (this.addrData.sender.show && this.addrData.receiver.show) {
        this.errandType = '0';

        // 首先判断闪送
        SupportCity.SS.forEach(value => {
          if (this.addrData.sender.addr.indexOf(value) > -1 && this.addrData.receiver.addr.indexOf(value) > -1) {
            this.errandType = '1';
          }
        });

        // 然后判断UU
        if (this.errandType === '0') {
          SupportCity.UU.forEach(value => {
            if (this.addrData.sender.addr.indexOf(value) > -1 && this.addrData.receiver.addr.indexOf(value) > -1) {
              this.errandType = '2';
            }
          });
        }

        if (this.errandType === '0') {
          this.estimatedPrice = '';
          this.$alert('该订单暂时无法提供服务，请联系客服');
        }
      }
    },
    getErrandPrice() {
      if (this.addrData.sender.id && this.addrData.sender.id === this.addrData.receiver.id) {
        this.$alert('地址相同！请新增一个地址');
      } else if (this.addrData.sender.show && this.addrData.receiver.show && this.selData.date) {
        this.estimatedPrice = '';
        this.$loading.open(2);

        if (this.errandType === '1') {
          this.$store.dispatch('GetShanSongPrice', {
              SenderAddressId: this.addrData.sender.id,
              ReceiverAddressId: this.addrData.receiver.id,
              SubscribeTime: this.showData.date === '立即' ? '' : this.selData.date,
              Weight: this.selData.weight,
              Goods: this.selData.name,
              Remark: this.errandNote
            })
            .then(res => {
              this.$loading.close();
              this.estimatedPrice = res.Price;
              this.priceOrderId = res.OrderId;
            })
            .catch(err => {
              this.$loading.close();
              this.$alert(err.message || err.ErrorMsg);
            });
        } else {
          this.$store.dispatch('GetPaoTuiPrice', {
              SenderAddressId: this.addrData.sender.id,
              ReceiverAddressId: this.addrData.receiver.id,
              SubscribeTime: this.selData.date
            })
            .then(res => {
              this.$loading.close();
              this.estimatedPrice = res.Price;
              this.priceOrderId = res.OrderId;
            })
            .catch(err => {
              this.$loading.close();
              this.$alert(err.message || err.ErrorMsg);
            });
        }
      }
    },
    submitOrder() {
      if (this.selData.date && this.selData.name && this.selData.weight && this.addrData.sender.show && this.addrData.receiver.show && this.estimatedPrice) {
        this.$loading.open(2);
        this.$store.dispatch('CreatePaoTuiOrder', {
            OrderType: this.errandType === '1' ? '3' : '2',
            PayType: '1',
            Note: this.errandNote,
            PriceOrdeId: this.priceOrderId,
            SenderAddressId: this.addrData.sender.id,
            ReceiverAddressId: this.addrData.receiver.id,
            GoodsName: this.selData.name,
            ServiceTime: this.selData.date,
            GoodsWeight: this.selData.weight
          })
          .then(res => {
            this.$loading.close();
            this.$alert('订单已提交');
            this.$router.push({
              name: 'order_pay',
              params: {
                orderId: res.OrderId
              }
            });
          })
          .catch(err => {
            this.$loading.close();
            this.$alert(err.message || err.ErrorMsg);
          });
      } else {
        var msg = '';
        if (!this.addrData.sender.show) {
          msg = '请选择寄件地址';
        } else if (!this.addrData.receiver.show) {
          msg = '请选择收件地址';
        } else if (!this.selData.date) {
          msg = '请选择寄件时间';
        } else if (!this.selData.name) {
          msg = '请选择物品名称';
        } else if (!this.selData.weight) {
          msg = '请选择物品重量';
        } else if (!this.estimatedPrice) {
          this.getErrandPrice();
        }
        if (msg) {
          this.$alert(msg);
        }
      }
    },
  },
  computed: {
    ...mapState(['IsLogin', 'OrderFrom', 'SelectedAddress', 'ALERT_MSG']),
  },
  watch: {
    errandType(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === '1') {
          this.slots_weight[0].values = ['5公斤以下', '6公斤', '7公斤', '8公斤', '9公斤', '10公斤', '11公斤', '12公斤', '13公斤', '14公斤', '15公斤', '16公斤', '17公斤', '18公斤', '19公斤', '20公斤', '21公斤', '22公斤', '23公斤', '24公斤', '25公斤', '26公斤', '27公斤', '28公斤', '29公斤', '30公斤', '31公斤', '32公斤', '33公斤', '34公斤', '35公斤', '36公斤', '37公斤', '38公斤', '39公斤', '40公斤', '41公斤', '42公斤', '43公斤', '44公斤', '45公斤', '46公斤', '47公斤', '48公斤', '49公斤', '50公斤'];
          this.showData.weight = '5公斤以下';
          this.selData.weight = '5';
        } else {
          this.slots_weight[0].values = ['5公斤以下', '5-10公斤', '10-15公斤', '15-20公斤', '20-25公斤', '25-30公斤', '30-35公斤', '35-40公斤', '40-45公斤', '45-50公斤'];
          this.showData.weight = '5公斤以下';
          this.selData.weight = '5';
        }

        this.slots_datetime[0].values = ['今天', '明天'];
        this.slots_datetime[2].values = this.getAvailHour(1);
        this.slots_datetime[4].values = this.getAvailMinute(1);
      }
    }
  }
}
</script>

<style scoped>
.router-view
{
  box-sizing: border-box;
  padding-bottom: 3rem;
}
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
.detail-sel .sel-item.remarks
{
  width: 6.986667rem;
  height: 90%;
  padding: 0;
  background-color: #fff;
  color: #333639;
  font-size: 14px;
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

  color: #999;
  font-size: 16px;
}
.send-name-selector .list
{
  position: relative;

  margin-top: 0.746667rem;
}
.send-name-selector .list .list-item
{
  width: 2rem;
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
.picker-wrapper
{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.6);
}
.picker-container
{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10000;
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
  color: #999;
  font-size: 16px;
}
.picker-container .header-btn.btn-confirm
{
  color: #27b8f3;
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
  transition: all .2s;
}
.slide-enter,
.slide-leave-to
{
  transform: translateY(220px);
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active
{
  transition: all .2s;
}
</style>
<style>
.picker-slot .picker-item.picker-selected
{
  font-size: 20px;
}
</style>