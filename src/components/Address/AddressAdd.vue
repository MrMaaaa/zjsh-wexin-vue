<template>
<div>
  <section class="address-section address-main">
    <div class="row row1 flex-row">
      <span class="title">联系人</span>

      <div class="info">
        <input class="address-input" type="text" v-model="AddressAddedInfo.Contact" placeholder="您的姓名">
        <div class="split-line"></div>
        <div class="address-selector">
          <div class="selector-item" @click="AddressAddedInfo.Gender='0'">
            <img class="icon-selector" v-show="AddressAddedInfo.Gender === '0'" src="../../assets/images/address_select.png">
            <img class="icon-selector" v-show="AddressAddedInfo.Gender === '1'" src="../../assets/images/address_unselected.png">
            <span class="txt-selector">先生</span>
          </div>
          <div class="selector-item" @click="AddressAddedInfo.Gender='1'">
            <img class="icon-selector" v-show="AddressAddedInfo.Gender === '1'" src="../../assets/images/address_select.png">
            <img class="icon-selector" v-show="AddressAddedInfo.Gender === '0'" src="../../assets/images/address_unselected.png">
            <span class="txt-selector">女士</span>
          </div>
        </div>

        <img class="input-clear" @click="AddressAddedInfo.Contact=''" src="../../assets/images/input_delete.png">
      </div>
    </div>

    <div class="row row2 flex-row">
      <span class="title">联系电话</span>

      <div class="info">
        <input class="address-input" type="tel" v-model="AddressAddedInfo.PhoneNumber" maxlength="11" placeholder="您的联系电话">

        <img class="input-clear" @click="AddressAddedInfo.PhoneNumber=''" src="../../assets/images/input_delete.png">
      </div>
    </div>

    <div class="row row3 flex-row">
      <span class="title">服务地址</span>

      <div class="info">
        <router-link :to="{ name: 'address_select' }" v-if="!AddressAddedInfo.Address1" class="address-input default">小区/写字楼/大厦/学校等</router-link>
        <router-link :to="{ name: 'address_select' }" v-else class="address-input txt-over-hide">{{ AddressAddedInfo.Address1 }}</router-link>
        <div class="split-line"></div>
        <input class="address-input" type="text" v-model="AddressAddedInfo.Address2" placeholder="详细地址（如1单元203室…）">

        <img class="input-clear bottom" @click="AddressAddedInfo.Address2=''"  src="../../assets/images/input_delete.png">
      </div>
    </div>
  </section>

  <section class="address-section address-tag">
    <div class="row flex-row">
      <span class="title">标签</span>

      <div class="info">
        <div class="address-selector">
          <div class="selector-item" @click="AddressAddedInfo.Tag='0'">
            <img class="icon-selector" v-show="AddressAddedInfo.Tag === '0'" src="../../assets/images/address_select.png">
            <img class="icon-selector" v-show="AddressAddedInfo.Tag !== '0'" src="../../assets/images/address_unselected.png">
            <span class="txt-selector">无</span>
          </div>
          <div class="selector-item" @click="AddressAddedInfo.Tag=item.Id" v-for="item in addressTagList">
            <img class="icon-selector" v-show="AddressAddedInfo.Tag === item.Id" src="../../assets/images/address_select.png">
            <img class="icon-selector" v-show="AddressAddedInfo.Tag !== item.Id" src="../../assets/images/address_unselected.png">
            <span class="txt-selector">{{ item.Name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="address-add">
    <a class="btn-add" :class="{ disable: !isSaved }" @click="addAddress">保存地址</a>
  </div>

  <m-loading bg-style="2" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'address_add',
  data() {
    return {
      addressTagList: [],
      isLoading: false,
    }
  },
  mounted() {
    this.AddressAddedInfo.Gender = this.AddressAddedInfo.Gender == '1' ? this.AddressAddedInfo.Gender : '0';
    this.AddressAddedInfo.Tag = parseInt(this.AddressAddedInfo.Gender) > 0 ? this.AddressAddedInfo.Gender : '0';
    this.getAddressTags();
  },
  methods: {
    getAddressTags() {
      axios.post(API.GetAddressTags, qs.stringify({}), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        if (res.data.Meta.ErrorCode == '0') {
          this.addressTagList = res.data.Body;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(function(error) {
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    addAddress() {
      if(this.AddressAddedInfo.Contact === '') {
        this.alert(this.ALERT_MSG.ADDRESS_ERROR.NAME_EMPTY);
      } else if (this.AddressAddedInfo.PhoneNumber === '') {
        this.alert(this.ALERT_MSG.ADDRESS_ERROR.PHONE_EMPTY);
      } else if (this.AddressAddedInfo.Address1 === '') {
        this.alert(this.ALERT_MSG.ADDRESS_ERROR.ADDRESS_EMPTY);
      } else if (this.AddressAddedInfo.Address2 === '') {
        this.alert(this.ALERT_MSG.ADDRESS_ERROR.ADDRESS_EMPTY);
      } else if(this.isSaved) {
        this.isLoading = true;
        delete this.AddressAddedInfo.Id;
        axios.post(API.AddAddress, qs.stringify({
          Token: this.Token,
          Address: this.AddressAddedInfo
        }), {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          this.isLoading = false;
          if (res.data.Meta.ErrorCode === '0') {
            this.$router.replace({
              name: 'address_list'
            });
          } else {
            this.alert(res.data.Meta.ErrorMsg);
          }
        }).catch(function(error) {
          this.isLoading = false;
          this.alert(this.ALERT_MSG.NET_ERROR);
        });
      }
    }
  },
  computed: {
    isSaved() {
      if(this.AddressAddedInfo.Contact && /^1[3|4|5|7|8][0-9]\d{8}$/.test(this.AddressAddedInfo.PhoneNumber) && this.AddressAddedInfo.Address1 && this.AddressAddedInfo.Address1Lng && this.AddressAddedInfo.Address1Lat && this.AddressAddedInfo.Address2) {
        return true;
      } else {
        return false;
      }
    },
    ...mapState(['Token', 'AddressAddedInfo', 'ALERT_MSG'])
  }
}
</script>

<style scoped lang="scss">
$row-height: 1.2rem;
.router-view
{
  background-color: #eef2f5;
}
.address-input
{
  display: block;
  height: 0.64rem;
  margin: 0;
  padding: 0.28rem 0;
  border: none;
  outline: none;
  color: #333639;
  font-size: 14px;
  &::-webkit-input-placeholder
  {
    color: #cfcfcf;
  }
  &.default
  {
    color: #cfcfcf;
  }
}
.address-section
{
  padding-left: 0.346667rem;
  background-color: #fff;
  color: #333639;
  font-size: 14px;
  &.address-tag
  {
    margin-top: 0.266667rem;
    height: $row-height;
  }
  .row
  {
    flex-shrink: 0;
    -webkit-flex-shrink: 0;
    &.row1,
    &.row3
    {
      height: 2 * $row-height;
    }
    &.row2
    {
      height: $row-height;
    }
    &:not(:first-child)
    {
      border-top: 1px solid #eef2f5;
    }
    .title
    {
      width: 1.8rem;
      line-height: $row-height;
      align-self: flex-start;
      -webkit-align-self: flex-start;
    }
    .info
    {
      position: relative;
      width: 1px;
      height: 100%;
      flex-grow: 1;
      -webkit-flex-grow: 1;
      .split-line
      {
        height: 1px;
        background-color: #eef2f5;
      }
      .address-selector
      {
        line-height: $row-height;
        .selector-item
        {
          display: inline-block;
          &:not(:first-child)
          {
            margin-left: 0.933333rem;
          }
          .icon-selector
          {
            display: inline-block;
            width: 0.373333rem;
            height: 0.373333rem;
            vertical-align: middle;
          }
        }
      }
      .input-clear
      {
        position: absolute;
        right: 0.346667rem;
        top: 0.373333rem;
        width: 0.426667rem;
        height: 0.426667rem;
      }
      .input-clear.bottom
      {
        top: none;
        top: 1.573333rem;
      }
    }
  }
}
.address-add
{
  margin-top: 1.0rem;
  .btn-add
  {
    display: block;
    height: 1.133333rem;
    line-height: 1.133333rem;
    margin: 0 0.666667rem;
    border-radius: 4px;
    background-color: #27b8f3;
    color: #fff;
    text-align: center;
    font-size: 16px;
    // &.disable
    // {
    //   background-color: rgba(86,201,255,.3);
    //   pointer-events: none;
    // }
  }
}
</style>