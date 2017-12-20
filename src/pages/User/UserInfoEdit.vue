<template>
<div>
  <section class="user-group">
    <div class="user-section flex-row">
      <input class="input-file" type="file" @change="onFileChange" accept="image/jpg,image/jpeg,image/png">
      <span class="section-name">头像</span>

      <div class="flex-row">
        <img class="user-avatar" id="avatar" :src="userInfo.HqPic">

        <img class="section-icon-link" src="../../assets/images/link.png">
      </div>
    </div>

    <div class="section-split"></div>

    <router-link class="user-section flex-row" :to="{ name: 'user_nickname_edit', query: { name: userInfo.NickName ? userInfo.NickName : '' } }">
      <div class="flex-row">
        <span class="section-name">昵称</span>
      </div>

      <div class="flex-row">
        <span class="section-name" v-if="userInfo.NickName">{{ userInfo.NickName }}</span>
        <span class="section-tips" v-else>10个字符以内，支持中英文、数字</span>

        <img class="section-icon-link" src="../../assets/images/link.png">
      </div>
    </router-link>

    <div class="section-split"></div>

    <router-link class="user-section flex-row" :to="{ name: 'address_list', query: { type: '0' } }">
      <div class="flex-row">
        <span class="section-name">地址</span>
      </div>

      <img class="section-icon-link" src="../../assets/images/link.png">
    </router-link>
  </section>

  <section class="user-group">
    <div class="user-section flex-row">
      <div class="flex-row">
        <span class="section-name">手机号</span>
        <img class="section-icon" @click="openPhoneAlert" src="../../assets/images/orders_alert.png">
      </div>

      <div class="flex-row">
        <span class="section-name">{{ userInfo.PhoneNumber }}</span>
      </div>
    </div>
  </section>

  <a class="logout" @click="logout">退出当前账号</a>
</div>
</template>

<script>
import { mapState } from 'vuex';
import defaultAvatar from '../../assets/images/user_default_login.png';

export default {
  name: 'user_info_edit',
  data() {
    return {
      userInfo: {
        HqPic: defaultAvatar
      }
    }
  },
  mounted() {
  },
  activated() {
    this.getUserInfo();
  },
  methods: {
    openPhoneAlert() {
      this.$dialog({
        title: '温馨提示',
        msg: '手机号是您账户的唯一标识，如需更换号码，请联系客服。',
        btns: [{
          text: '我知道了'
        }]
      });
    },
    getUserInfo() {
      this.$loading.open(1);
      this.$store.dispatch('GetUserInfo')
        .then(res => {
          this.$loading.close();
          this.userInfo = res.Info;
          this.userInfo.HqPic = this.userInfo.HqPic || defaultAvatar;
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    onFileChange(event) {
      let file = event.target.files || event.dataTransfer.files;
      this.updateUserAvatar(file[0]);
    },
    updateUserAvatar(file) {
      this.$loading.open(2);
      this.$store.dispatch('SetPhoto', {
          photo: file
        })
        .then(res => {
          this.$loading.close();
          this.userInfo.HqPic = res.ImgPath;
          this.$alert('头像修改成功');
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    logout () {
      this.$dialog({
        title: '温馨提示',
        msg: '确定要退出登录吗？',
        btns: [{
          text: '取消'
        }, {
          text: '确定',
          callback: () => {
            this.$store.dispatch('Logout');
            this.$router.go(-1);
          }
        }]
      });
    },
  },
  computed: {
    ...mapState(['ALERT_MSG']),
  },
}
</script>

<style scoped lang="scss">
.user-group
{
  margin-top: 0.373333rem;
  background-color: #fff;
  .user-section
  {
    position: relative;
    padding: 0.226667rem 0.4rem 0.226667rem 0.426667rem;
    color: #333639;
    font-size: 17px;
    .input-file
    {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      display: block;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .user-avatar
    {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
    }
    .section-icon
    {
      display: block;
      width: 0.4rem;
      height: 0.4rem;
      margin-left: 0.12rem;
    }
    .section-tips
    {
      color: #ccc;
      font-size: 15px;
    }
    .section-icon-link
    {
      display: inline-block;
      width: 0.213333rem;
      margin-left: 0.266667rem;
    }
    .section-name
    {
      display: block;
    }
    .input
    {
      color: #888;
      text-align: right;
    }
  }
  .user-section.logout
  {
    display: block;
    padding: 0.226667rem 0.4rem;
    color: #000;
    text-align: center;
    font-size: 18px;
  }
  .section-split
  {
    transform-origin: 0 0;
    transform: scaleY(0.5);
    margin-left: 0.426667rem;
    height: 1px;
    background-color: #e5e5e5;
  }
}
.logout
{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.146667rem;
  line-height: 1.146667rem;
  background-color: #fff;
  color: #f56165;
  text-align: center;
  font-size: 17px;
}
</style>