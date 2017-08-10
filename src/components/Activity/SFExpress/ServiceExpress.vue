<template>
<div>
  <!-- <div class="address-sel">
    <div class="address-item flex-row address-send" @click="selectAddress(1)">
      <div>
        <img class="icon-address icon-send" src="./images/icon_send.png"><span v-show="!addrData.sender.show" class="label-address">请选择寄件地址</span>
      </div>

      <div v-show="addrData.sender.show" class="address-txt">
        <span class="txt-info txt-over-hidden">{{ addrData.sender.name }} {{ addrData.sender.phone }}</span>
        <span class="txt-addr txt-over-hidden">{{ addrData.sender.addr }}</span>
      </div>

      <img class="icon-link" src="./images/icon_right.png">
    </div>

    <div class="address-line"></div>

    <div class="address-item flex-row address-receive" @click="selectAddress(2)">
      <div>
        <img class="icon-address icon-receive" src="./images/icon_receive.png"><span v-show="!addrData.receiver.show" class="label-address">请选择收件地址</span>
      </div>

      <div v-show="addrData.receiver.show" class="address-txt">
        <span class="txt-info txt-over-hidden">{{ addrData.receiver.name }} {{ addrData.receiver.phone }}</span>
        <span class="txt-addr txt-over-hidden">{{ addrData.receiver.addr }}</span>
      </div>

      <img class="icon-link" src="./images/icon_right.png">
    </div>
  </div>

  <div class="detail-sel">
    <div class="flex-row">
      <div class="send-item send-time" id="time_pick">
        <span class="title">寄件时间</span>

        <span class="sel-item sel-time">{{ showData.date }}</span>

        <ul id="date_group" style="display: none;">
          <li v-if="getDateList(9, 17, true)[0] != 'over'">
            <span>{{ getDate(0) }} 今天</span>
            <ul>
              <li v-for="item in getDateList(9, 17, true)">{{ item }}</li>
            </ul>
          </li>
          <li>
          <span>{{ getDate(1) }} 明天</span>
            <ul>
              <li v-for="item in getDateList(9, 17, false)">{{ item }}</li>
            </ul>
          </li>
          <li>
            <span>{{ getDate(2) }} 后天</span>
            <ul>
              <li v-for="item in getDateList(9, 17, false)">{{ item }}</li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="send-item send-name" @click="openSelName">
        <span class="title">物品名称</span>

        <span class="sel-item sel-name" :class="{ null: showData.name == '请选择' }">{{ showData.name }}</span>
      </div>
    </div>

    <div class="flex-row">
      <div class="send-item send-weight" id="weight_pick">
        <span class="title">物品重量</span>

        <span class="sel-item sel-weight">{{ showData.weight }}</span>

        <ul id="weight_group" style="display: none;">
          <li weight-index="1">1kg</li>
          <li weight-index="2">2kg</li>
          <li weight-index="3">3kg</li>
          <li weight-index="4">4kg</li>
          <li weight-index="5">5kg</li>
          <li weight-index="6">6kg</li>
          <li weight-index="7">7kg</li>
          <li weight-index="8">8kg</li>
          <li weight-index="9">9kg</li>
          <li weight-index="10">10kg</li>
        </ul>
      </div>

      <div class="send-item send-way" id="way_pick">
        <span class="title">付款方式</span>

        <span class="sel-item sel-way">{{ showData.way }}</span>

        <ul id="way_group" style="display: none;">
          <li pay-index="1">寄件人付</li>
          <li pay-index="2">收件人付</li>
        </ul>
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
    <div class="wrapper" style="display: none;" @click="closeSelName"></div>

    <div class="content">
      <div class="cancel" @click="closeSelName">取消</div>

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
  </div>

  <div class="warn-panel" v-show="isWarn">
    <div class="wrapper" @click="isWarn=false"></div>

    <div class="content">
      <span class="txt">{{ warnMsg }}</span>
    </div>
  </div>

  <div class="submit-info warn-panel" v-show="isSubmit">
    <div class="wrapper"></div>

    <div class="content">
      <span class="txt">订单已提交<br>快递员将在2小时内上门取件</span>
    </div>
  </div> -->
</div>
</template>

<script>

export default {
  name: 'express_detail',
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
  components: {
  }
}
</script>

<style scoped>
</style>