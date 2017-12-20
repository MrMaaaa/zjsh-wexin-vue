<template>
<div class="router-view">
  <div class="address">
    <ul class="address-list" ref="addressList">
      <li class="address-item flex-row" v-for="item in addressList">
        <a class="btn-delete" @click="deleteAddress($event, item)">删除</a>

        <div class="address-content" @click="routerTo(item)">
          <div class="address-user">
            <span class="user-name txt-over-hide">{{ item.Contact | clearNull  }}</span><span class="user-gender">({{ item.Gender === '1' ? '女士': '先生' }})</span><span class="user-phone">{{ item.PhoneNumber | clearNull  }}</span>
          </div>

          <div class="address-info flex-row">
            <div class="address-tag">
              <span class="tag-item" v-if="item.Tag">{{ item.Tag }}</span>
            </div>
            <span class="address-detail txt-light txt-over-hide">{{ item.Address1 }}{{item.Address2 | clearNull }}</span>
          </div>
        </div>

        <router-link class="btn-edit" :to="{ name: 'address_edit', params: { addr_info: item } }"></router-link>
      </li>
    </ul>
  </div>

  <div class="address-empty" v-if="addressList.length === 0">
    <img class="img-empty" src="../../assets/images/address_empty.png">
    您还没有添加服务地址哦，快去<router-link class="txt-add" :to="{ name: 'address_add', params: { isAddressAddedInfo: '1' } }">新增</router-link>吧
  </div>

  <div class="address-add">
    <router-link class="btn-add" :to="{ name: 'address_add', params: { isAddressAddedInfo: '1' } }">+&nbsp;新增地址</router-link>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'address_list',
  data() {
    return {
      addressList: [],
      originRoute: '',
      isDelete: false,
      touchStartX: 0,
      touchStartY: 0
    }
  },
  mounted() {
    if (window.parent !== window.self) {
      let parentToken = window.parent.GetTokenFromParentWindow();
      this.getAddressList(parentToken);
    } else {
      this.getAddressList();
    }

    this.$refs.addressList.addEventListener('touchstart', event => {
      // 记录此时的x
      this.touchStartX = event.targetTouches[0].pageX;
      this.touchStartY = event.targetTouches[0].pageY;
    }, false);

    this.$refs.addressList.addEventListener('touchmove', event => {
      if (this.isTouchAcross(Math.abs(event.targetTouches[0].pageY - this.touchStartY), Math.abs(event.targetTouches[0].pageX - this.touchStartX))) {
        event.preventDefault();
        this.isDelete = true;
      }
    }, false);

    this.$refs.addressList.addEventListener('touchend', event => {
      if (this.isDelete) {
        this.isDelete = false;
        if (event.changedTouches[0].clientX - this.touchStartX > 20) {
          event.stopPropagation();
          let items = document.querySelectorAll('.address-list .address-item');
          for (let item of items) {
            item.classList.remove('active');
          }

          let nowNode = event.target;
          let count = 0; // 最大循环次数
          while (nowNode.nodeName.toLowerCase() !== 'li' && count < 5) {
            nowNode = nowNode.parentNode;
            count++;
          }
          nowNode.classList.add('active');
        } else if (this.touchStartX - event.changedTouches[0].clientX > 20) {
          event.stopPropagation();
          let nowNode = event.target;
          let count = 0; // 最大循环次数
          while (nowNode.nodeName.toLowerCase() !== 'li' && count < 5) {
            nowNode = nowNode.parentNode;
            count++;
          }
          nowNode.classList.remove('active');
        }
      }
    }, false);

    document.querySelector('.router-view').addEventListener('click', event => {
      let items = document.querySelectorAll('.address-list .address-item');
      for(let item of items) {
        item.classList.remove('active');
      }
    }, false);
  },
  activated() {
    this.getAddressList();
  },
  methods: {
    isTouchAcross(x, y) {
      x = Math.abs(x);
      y = Math.abs(y);
      var angle = Math.atan2(y, x) * 180 / Math.PI; // 与y轴的夹角
      var touchCritical = 60;
      if(angle >= touchCritical) {
        return true;
      } else {
        return false;
      }
    },
    getAddressList(addToken) {
      if(addToken) {
        this.$store.commit('SetToken', addToken);
      }
      this.$store.dispatch('GetAddress')
        .then(res => {
          this.addressList = res;
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    deleteAddress(event, item) {
      this.$dialog({
        title: '温馨提示',
        msg: '确定要删除该服务地址？',
        btns: [{
          text: '取消'
        }, {
          text: '确定',
          callback: () => {
            this.$loading.open(2);
            this.$store.dispatch('DeleteAddress', {
                AddressId: item.Id
              })
              .then(res => {
                this.$loading.close();
                this.$alert('删除成功');
                this.addressList.forEach((value, index) => {
                  if(value.Id === item.Id) {
                    this.addressList.splice(index, 1);
                  }
                });
              })
              .catch(err => {
                this.$loading.close();
                this.$alert(err.emssage || err.ErrorMsg);
              });
          }
        }]
      });
      event.target.parentNode.classList.remove('active');
    },
    routerTo(item) {
      if (window.parent !== window.self) {
        // 如果作为其他页面的内嵌页面，调用父页面方法传值
        window.parent.getDataFromIFrame(item);
      } else if (this.$route.query.type === '0') {
        // type：点击地址的操作  空表示返回并保存当前地址 0表示进入编辑，
        this.$router.push({
          name: 'address_edit',
          params: {
            addr_info: item
          }
        });
      } else {
        // 设置下单页的默认地址id
        if (this.$route.query.from == 'order_place') {
          this.$store.commit('SetDefaultAddressId', item.Id);
        }
        this.$store.commit('SetSelectedAddress', item);
        this.$router.go(-1);
      }
    }
  },
  computed: {
    ...mapState(['IsLogin', 'OrderInfo', 'ALERT_MSG'])
  },
  filters: {
    clearNull(val) {
      if(val == null || val == undefined) {
        return '';
      } else {
        return val;
      }
    }
  },
  watch: {
    IsLogin(newValue) {
      if(newValue === '1') {
        this.getAddressList();
      }
    }
  }
}
</script>

<style scoped lang="scss">
$color_base_bg: #f7f7ff;
$color_base_red: #f56165;
$color_text_normal: #333639;
$color_text_light: #666;

.router-view
{
  background-color: $color_base_bg;
}
.address
{
  box-sizing: border-box;
  // height: 100%;
  padding-bottom: 1.96rem;
  background-color: $color_base_bg;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .address-list
  {
    overflow: hidden;
    .address-item
    {
      position: relative;
      height: 2.0rem;
      padding: 0 0.533333rem 0 0.306667rem;
      background-color: #fff;
      transition: all .1s;
      &:not(:first-child)
      {
        margin-top: 0.133333rem;
      }
      &.active
      {
        transform: translateX(2.666667rem);
      }
      .btn-delete
      {
        position: absolute;
        top: 0;
        left: -2.666667rem;
        width: 2.666667rem;
        height: 2.0rem;
        line-height: 2.0rem;
        background: $color_base_red;
        color: #fff;
        text-align: center;
        font-size: 16px;
      }
      .address-content
      {
        flex-grow: 1;
        -webkit-flex-grow: 1;
        box-sizing: border-box;
        width: 1px;
        .address-user
        {
          font-size: 15px;
          .user-name
          {
            display: inline-block;
            width: 1.6rem;
            color: $color_text_normal;
            font-size: 16px;
            font-weight: bolder;
            vertical-align: middle;
          }
          .user-gender
          {
            color: $color_text_light;
          }
          .user-phone
          {
            margin-left: 0.186667rem;
            color: $color_text_light;
          }
        }
        .address-info
        {
          justify-content: flex-start;
          -webkit-justify-content: flex-start;
          margin-top: 0.28rem;
          .address-tag
          {
            flex-shrink: 0;
            -webkit-flex-shrink: 0;
            width: 1.6rem;
            .tag-item
            {
              padding: 1px 0.106667rem;
              border: 1px solid $color_base_red;
              border-radius: 3px;
              color: $color_base_red;
              font-size: 11px;
            }
          }
          .address-detail
          {
            flex-grow: 1;
            -webkit-flex-grow: 1;
            width: 100%;
            color: $color_text_light;
            font-size: 15px;
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
        background: url(../../assets/images/address_edit.png) no-repeat;
        background-size: 100% 100%;
      }
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
    margin: 3.5rem auto 0.426667rem;
  }
  .txt-add
  {
    color: $color_base_red;
    font-size: 14px;
  }
}
.address-add
{
  position: fixed;
  bottom: 0;
  left: 0;
  transform: translateZ(0);
  box-sizing: border-box;
  width: 100%;
  padding: 0.4rem 0.666667rem;
  border-top: 1px solid #ccccfb;
  background-color: #fff;
  text-align: center;
  .btn-add
  {
    display: block;
    height: 1.173333rem;
    line-height: 1.173333rem;
    margin: 0 auto;
    border: 1px solid $color_base_red;
    border-radius: 6px;
    color: $color_base_red;
    font-size: 16px;
  }
}
</style>