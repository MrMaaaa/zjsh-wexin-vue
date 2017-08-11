<template>
<div>
  <div class="address" v-if="addressList.length > 0">
    <ul class="address-list">
      <li class="address-item flex-row" v-for="item in addressList">
        <div class="address-content" @click="routerTo(item)">
          <p class="txt-normal address-user">
            <span>{{ item.Contact | clearNull  }}</span><span v-if="item.Gender === '1'">女</span><span v-else>男</span><span>{{ item.PhoneNumber | clearNull  }}</span>
          </p>

          <p class="address-info flex-row">
            <span class="address-tag" v-if="item.Tag">{{ item.Tag }}</span>
            <span class="address-detail txt-light txt-over-hide">{{ item.Address1 }}{{item.Address2 | clearNull }}</span>
          </p>
        </div>

        <router-link class="btn-edit" :to="{ name: 'address_edit', params: { addr_info: item } }"></router-link>
      </li>
    </ul>
  </div>

  <div class="address-empty txt-normal" v-else>
    <img class="img-empty" src="../../assets/images/address_empty.png">
    您还没有添加服务地址哦，快去<router-link class="txt-add" :to="{ name: 'address_add' }">新增</router-link>吧
  </div>

  <div class="address-add">
    <router-link class="btn-add" :to="{ name: 'address_add' }"><img class="icon-add" src="../../assets/images/address_add.png">新增地址</router-link>
  </div>

  <m-loading bg-style="1" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'address_list',
  data() {
    return {
      addressList: [],
      isLoading: true,
    }
  },
  mounted() {
    if (window.parent !== window.self) {
      let parentToken = window.parent.GetTokenFromParentWindow();
      this.getAddressList(parentToken);
    } else {
      this.getAddressList();
    }
  },
  activated() {
    this.getAddressList();
  },
  methods: {
    getAddressList(addToken) {
      if(addToken) {
        this.Token = addToken;
        this.$store.commit('SetToken', addToken);
      }
      axios.post(API.GetAddress, qs.stringify({
        Token: addToken || this.Token
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          this.addressList = res.data.Body;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(function(error) {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    routerTo(item) {
      if(window.parent !== window.self) {
        // 如果作为其他页面的内嵌页面，调用父页面方法传值
        window.parent.getDataFromIFrame(item);
      } else {
        // 目前只在下单页用到地址，如果有其他地方也会用到，再另行处理
        this.OrderInfo.Address = item;
        this.$store.commit('SetOrderInfo', this.OrderInfo);
        this.$router.push({
          name: 'order_place'
        });
      }
    }
  },
  computed: {
    ...mapState(['Token','OrderInfo', 'ALERT_MSG'])
  },
  filters: {
    clearNull(val) {
      if(val == null || val == undefined) {
        return '';
      } else {
        return val;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.router-view
{
  background-color: #eef2f5;
}
.txt-normal
{
  color: #333639;
}
.txt-light
{
  color: #999;
}
.address
{
  padding-left: 0.4rem;
  background-color: #fff;
  .address-item
  {
    width: 100%;
    height: 1.6rem;
    &:not(:first-child)
    {
      border-top: 1px solid #e4eaee;
    }
    .address-content
    {
      flex-grow: 1;
      -webkit-flex-grow: 1;
      box-sizing: border-box;
      width: 1px;
      .address-user
      {
        line-height: 0.8rem;
        font-size: 14px;
        span:not(:first-child)
        {
          margin-left: 0.24rem;
        }
      }
      .address-info
      {
        justify-content: flex-start;
        -webkit-justify-content: flex-start;
        .address-tag
        {
          flex-shrink: 0;
          -webkit-flex-shrink: 0;
          margin-right: 0.106667rem;
          padding: 1px 4px;
          border-radius: 2px;
          background-color: #27b8f3;
          color: #fff;
          flex-shrink: 0;
          -webkit-flex-shrink: 0;
        }
        .address-detail
        {
          flex-grow: 1;
          -webkit-flex-grow: 1;
          width: 1px;
        }
      }
    }
    .btn-edit
    {
      flex-shrink: 0;
      -webkit-flex-shrink: 0;
      display: block;
      width: 0.533333rem;
      height: 0.533333rem;
      margin-left: 0.4rem;
      margin-right: 0.4rem;
      background-image: url(../../assets/images/address_edit.png);
      background-repeat: no-repeat;
      background-size: 0.533333rem 0.533333rem;
    }
  }
}
.address-empty
{
  overflow: auto;
  text-align: center;
  font-size: 14px;
  .img-empty
  {
    display: block;
    width: 3.466667rem;
    margin: 5.5rem auto 0.426667rem;
  }
  .txt-add
  {
    color: #27b8f3;
    font-size: 14px;
  }
}
.address-add
{
  position: fixed;
  bottom: 0;
  left: 0;
  transform: translateZ(0);
  width: 100%;
  height: 1.333333rem;
  line-height: 1.333333rem;
  background-color: #fff;
  text-align: center;
  .btn-add
  {
    color: #27b8f3;
    font-size: 16px;
    vertical-align: middle;
    .icon-add
    {
      display: inline-block;
      width: 0.533333rem;
      height: 0.533333rem;
      margin-right: 0.08rem;
      vertical-align: middle;
    }
  }
}
</style>