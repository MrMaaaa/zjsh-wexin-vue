<template>
<div>
  <i class="icon-header-line"></i>

  <section class="address-section address-main">
    <div class="row flex-row">
      <div class="row-info flex-row">
        <span class="title">联系人</span>
        <input class="address-input" ref="input_contact" type="text" v-model="AddressAddedInfo.Contact" placeholder="您的姓名">
      </div>

      <img class="input-clear" v-show="AddressAddedInfo.Contact !== ''" @click="AddressAddedInfo.Contact = '';$refs.input_contact.focus();" src="../../assets/images/input_delete.png">
    </div>

    <i class="row-split"></i>

    <div class="row flex-row">
      <div class="row-info flex-row">
        <span class="title">&nbsp;</span>

        <div class="address-selector flex-row">
          <div class="selector-item" :class="{ active: AddressAddedInfo.Gender === '0' }" @click="AddressAddedInfo.Gender = '0'">
            <span class="txt-selector">先生</span>
          </div>
          <div class="selector-item" :class="{ active: AddressAddedInfo.Gender === '1' }" @click="AddressAddedInfo.Gender = '1'">
            <span class="txt-selector">女士</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row flex-row">
      <div class="row-info flex-row">
        <span class="title">联系电话</span>
        <input class="address-input" ref="input_phone" type="tel" v-model="AddressAddedInfo.PhoneNumber" maxlength="11" placeholder="您的联系电话">
      </div>

      <img class="input-clear" v-show="AddressAddedInfo.PhoneNumber !== ''" @click="AddressAddedInfo.PhoneNumber = '';$refs.input_phone.focus();" src="../../assets/images/input_delete.png">
    </div>

    <div class="row flex-row">
      <div class="row-info flex-row">
        <span class="title">服务地址</span>

        <a class="address-input default" v-if="!AddressAddedInfo.Address1" @click="selectAddress">小区/写字楼/大厦/学校等</a>
        <a class="address-input txt-over-hide" v-else @click="selectAddress">{{ AddressAddedInfo.Address1 }}</a>
      </div>

      <img class="icon-link address" src="../../assets/images/user_address.png" @click="selectAddress">
    </div>
    <div class="row flex-row">
      <div class="row-info flex-row">
        <span class="title">&nbsp;</span>
        <m-textarea class="address-textarea" :m-text.sync="AddressAddedInfo.Address2" m-placeholder="详细地址（如1单元203室...）" />
      </div>

      <img class="input-clear" v-show="AddressAddedInfo.Address2 !== ''" @click="AddressAddedInfo.Address2 = '';" src="../../assets/images/input_delete.png">
    </div>
  </section>

  <section class="address-section address-tag">
    <div class="row flex-row">
      <div class="row-info flex-row">
        <span class="title">标签</span>

        <div class="address-selector flex-row">
          <div class="selector-item" :class="{ active: AddressAddedInfo.Tag === '无' }" @click="AddressAddedInfo.Tag = '无'">
            <span class="txt-selector">无</span>
          </div>
          <div class="selector-item" :class="{ active: AddressAddedInfo.Tag === item.Name }" @click="AddressAddedInfo.Tag = item.Name" :key="item.Name" v-for="item in addressTagList">
            <span class="txt-selector">{{ item.Name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="address-delete">
    <a class="btn-delete" @click="deleteAddressConfirm">删除地址</a>
  </div>

  <div class="address-add">
    <a class="btn-add" :class="{ disable: !isSaved }" @click="saveAddress">保存地址</a>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import MTextarea from '../../components/common/m-textarea.vue';

export default {
  name: 'address_add',
  data() {
    return {
      addressTagList: [],
      isExit: false
    }
  },
  components: {
    MTextarea
  },
  mounted() {
    if (this.$route.params.addr_info) {
      let editAddrData = this.$route.params.addr_info;

      // 将AddressAddedInfo中存在的信息进行保存
      for (let key in editAddrData) {
        this.AddressAddedInfo[key] = editAddrData[key];
      }
      this.AddressAddedInfo.Gender = this.AddressAddedInfo.Gender == '1' ? this.AddressAddedInfo.Gender : '0';
    }
    this.getAddressTags();
  },
  beforeRouteLeave(to, form, next) {
    if (this.isExit) {
      next();
    } else {
      next(false);
      this.$dialog({
        title: '温馨提示',
        msg: '是否放弃编辑服务地址',
        btns: [{
          text: '取消'
        }, {
          text: '确定',
          callback: () => {
            this.isExit = true;
            this.$router.back();
          }
        }]
      })
    }
  },
  activated() {
    if (this.$route.params.addr_info) {
      let editAddrData = this.$route.params.addr_info;

      // 将AddressAddedInfo中存在的信息进行保存
      for (let key in editAddrData) {
        this.AddressAddedInfo[key] = editAddrData[key];
      }
      this.AddressAddedInfo.Gender = this.AddressAddedInfo.Gender == '1' ? this.AddressAddedInfo.Gender : '0';
    }

    this.isExit = false;
  },
  methods: {
    getAddressTags() {
      this.$store.dispatch('GetAddressTags')
        .then(res => {
          this.addressTagList = res;
        })
        .catch(err => {
          this.$alert(err.emssage || err.ErrorMsg);
        });
    },
    saveAddress() {
      if(this.AddressAddedInfo.Contact === '') {
        this.$alert(this.ALERT_MSG.NAME_EMPTY);
      } else if (this.AddressAddedInfo.PhoneNumber === '') {
        this.$alert(this.ALERT_MSG.PHONE_EMPTY);
      } else if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.AddressAddedInfo.PhoneNumber)) {
        this.$alert(this.ALERT_MSG.PHONE_ERROR);
      } else if (this.AddressAddedInfo.Address1 === '') {
        this.$alert(this.ALERT_MSG.ADDRESS_EMPTY);
      } else if (this.AddressAddedInfo.Address2 === '') {
        this.$alert(this.ALERT_MSG.ADDRESS2_EMPTY);
      } else if(this.isSaved) {
        this.$loading.open(2);
        this.$store.dispatch('EditAddress', {
            Address: this.AddressAddedInfo
          })
          .then(res => {
            this.$loading.close();
            this.$store.commit('SetAddressAddedInfo', {
              Id: '',
              Contact: '',
              Gender: '',
              PhoneNumber: '',
              Address1: '',
              Address1Lng: '',
              Address1Lat: '',
              Address2: '',
              Tag: ''
            });
            this.$alert('地址修改成功');
            this.isExit = true;
            this.$router.back();
          })
          .catch(err => {
            this.$loading.close();
            this.$alert(err.emssage || err.ErrorMsg);
          });
      }
    },
    selectAddress() {
      this.isExit = true;
      this.$router.push({
        name: 'address_select'
      });
    },
    deleteAddressConfirm() {
      this.$dialog({
        title: '删除地址',
        msg: '确定要删除该服务地址吗？',
        btns: [{
          text: '取消'
        }, {
          text: '确定',
          callback: this.deleteAddress
        }]
      });
    },
    deleteAddress() {
      this.$loading.open(2);
      this.$store.dispatch('DeleteAddress', {
          AddressId: this.AddressAddedInfo.Id
        })
        .then(res => {
          this.$loading.close();
          this.$alert('地址删除成功');
          this.isExit = true;
          this.$router.back();
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.emssage || err.ErrorMsg);
        });
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
$row-height: 1.333333rem;
$color_base_bg: #f7f7ff;
$color_base_red: #f56165;
$color_text_normal: #333639;
$color_text_light: #999;

.router-view
{
  background-color: $color_base_bg;
}
.icon-header-line
{
  display: block;
  height: 0.066667rem;
  margin-top: 0.266667rem;
  background: url(../../assets/images/orders_line.png) no-repeat;
  background-size: 100% 100%;
}
.address-input
{
  display: block;
  width: 100%;
  margin: 0;
  border: none;
  outline: none;
  color: #333639;
  font-size: 15px;
  &::-webkit-input-placeholder
  {
    color: $color_text_light;
  }
  &.default
  {
    color: $color_text_light;
  }
}
.address-textarea
{
  width: 5.24rem;
}
.address-section
{
  margin: 0 0.266667rem;
  padding: 0 0.32rem;
  background-color: #fff;
  color: $color_text_normal;
  font-size: 14px;
  &.address-tag
  {
    height: $row-height;
    margin-top: 0.266667rem;
  }
  .row
  {
    height: $row-height;
    .row-info
    {
      width: 7.373333rem;
      -webkit-justify-content: initial;
      justify-content: initial;
      .title
      {
        -webkit-flex-shrink: 0;
        flex-shrink: 0;
        display: inline-block;
        width: 2.133333rem;
        font-weight: bolder;
      }
      .address-selector
      {
        line-height: $row-height;
        .selector-item
        {
          box-sizing: border-box;
          display: inline-block;
          width: 1.333333rem;
          height: 0.8rem;
          line-height: 0.8rem;
          border: 1px solid $color_text_light;
          border-radius: 6px;
          color: $color_text_light;
          text-align: center;
          font-size: 13px;
          &.active
          {
            border: 1px solid $color_base_red;
            color: $color_base_red;
          }
          &:not(:first-child)
          {
            margin-left: 0.266667rem;
          }
        }
      }
    }
    .input-clear
    {
      display: block;
      width: 0.426667rem;
      height: 0.426667rem;
      margin: 0 0.08rem 0 0.44rem;
    }
    .icon-link
    {
      display: block;
      width: 0.2rem;
      margin: 0 0 0 0.44rem;
      vertical-align: middle;
      &.address
      {
        width: 0.586667rem;
      }
    }
  }
  .row-split
  {
    display: block;
    height: 1px;
    background: #eef2f5;
  }
}
.address-delete
{
  height: $row-height;
  line-height: $row-height;
  margin-top: 0.266667rem;
  background-color: #fff;
  font-size: 14px;
  .btn-delete
  {
    display: block;
    height: 100%;
    padding-left: 0.586667rem;
    color: $color_base_red;
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
    background-color: $color_base_red;
    color: #fff;
    text-align: center;
    font-size: 16px;
  }
}
</style>