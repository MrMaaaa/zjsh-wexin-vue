<template>
<div>
  <section class="user-group">
    <div class="user-section flex-row">
      <input class="input-file" type="file" @change="onFileChange" accept="image/jpg,image/jpeg,image/png">
      <!-- <input class="input-file" type="file" @change="onFileChange" accept="image/*"> -->
      <span class="section-name">头像</span>

      <div class="flex-row">
        <img class="user-avatar" id="avatar" :src="userInfo.HqPic">

        <img class="section-icon-link" src="../../assets/images/link.png">
      </div>
    </div>

    <div class="section-split"></div>

    <router-link class="user-section flex-row" :to="{ name: 'user_nickname_edit', query: { name: userInfo.NickName } }">
      <div class="flex-row">
        <span class="section-name">昵称</span>
      </div>

      <div class="flex-row">
        <span class="section-name" v-if="userInfo.NickName">{{ userInfo.NickName }}</span>
        <span class="section-tips" v-else>10个字符以内，支持中英文、数字</span>

        <img class="section-icon-link" src="../../assets/images/link.png">
      </div>
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

  <a class="logout" @click="logoutConfirm">退出当前账号</a>

  <m-dialog :dialog-config="DialogConfig" @dialog-cancel="closeDialog" @dialog-confirm="logout"></m-dialog>

  <m-loading bg-style="0" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';
import defaultAvatar from '../../assets/images/user_default_login.png';

export default {
  name: 'user_info_edit',
  data() {
    return {
      userInfo: {
        HqPic: defaultAvatar
      },
      // rotate: '', // 上传图片的旋转方式
      // imgType: '',
      DialogConfig: { //对话框配置信息
        IsDialog: '0', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
        DialogTitle: '', // 对话框标题
        DialogContent: '', // 对话框内容
        DialogBtns: ['取消'], // 对话框按钮文本
      },
      isLoading: false,
    }
  },
  mounted() {
    this.isLoading = true;
  },
  activated() {
    this.getUserInfo();
  },
  methods: {
    openPhoneAlert() {
      this.DialogConfig = {
        IsDialog: '1',
        DialogTitle: '',
        DialogContent: '手机号是您账户的唯一标识，如需更换号码，请联系客服。',
        DialogBtns: ['我知道了'],
      };
    },
    closeDialog() {
      this.DialogConfig.IsDialog = '0';
    },
    getUserInfo() {
      axios.post(API.GetUserInfo, qs.stringify({
        Token: this.Token
      })).then(res => {
        this.isLoading = false;
        if(res.data.Meta.ErrorCode === '0') {
          this.userInfo = res.data.Body.Info;
          this.userInfo.HqPic = this.userInfo.HqPic || defaultAvatar;
        } else {
          res.data.Meta.ErrorCode != '2004' && this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    onFileChange(event) {
      // let that = this;
      let file = event.target.files || event.dataTransfer.files;
      this.updateUserAvatar(file[0]);
      // this.imgType = file[0].type;
      // this.getEXIFOrientation(file[0], (orientation) => {
      //   this.setOrientation(orientation);
      //   var reader = new FileReader();
      //   reader.readAsDataURL(file[0]);

      //   var result_img = new Image();
      //   reader.onload = function(e) {
      //     result_img.src = this.result;
      //     result_img.onload = function() {
      //       //显示压缩后图片大小
      //       console.log(file[0]);
      //       var result = that.getBase64Image(this, 1, that.rotate, that.imgType);
      //       document.getElementById('avatar').src = result;
      //       var blob = that.dataURLToBlob(result);
      //       var finishFile = that.blobToFile(blob, file[0]);
      //       that.updateUserAvatar(finishFile);
      //       //that.userInfo.avatar = result;

      //       console.log(result.length / 1024 + 'KB');
      //     }
      //   }
      // });
    },
    // getEXIFOrientation(file, callback) {
    //   var reader = new FileReader()
    //   reader.onload = e => {
    //     var view = new DataView(e.target.result)
    //     if (view.getUint16(0, false) !== 0xFFD8) {
    //       return callback(-2)
    //     }
    //     var length = view.byteLength
    //     var offset = 2
    //     while (offset < length) {
    //       var marker = view.getUint16(offset, false)
    //       offset += 2
    //       if (marker === 0xFFE1) {
    //         if (view.getUint32(offset += 2, false) !== 0x45786966) {
    //           return callback(-1)
    //         }
    //         var little = view.getUint16(offset += 6, false) === 0x4949
    //         offset += view.getUint32(offset + 4, little)
    //         var tags = view.getUint16(offset, little)
    //         offset += 2
    //         for (var i = 0; i < tags; i++) {
    //           if (view.getUint16(offset + (i * 12), little) === 0x0112) {
    //             return callback(view.getUint16(offset + (i * 12) + 8, little))
    //           }
    //         }
    //       } else if ((marker & 0xFF00) !== 0xFF00) {
    //         break
    //       } else {
    //         offset += view.getUint16(offset, false)
    //       }
    //     }
    //     return callback(-1)
    //   }
    //   reader.readAsArrayBuffer(file.slice(0, 65536))
    // },
    // setOrientation(orientation) {
    //   this.rotate = false;
    //   if (orientation === 8) {
    //     this.rotate = -Math.PI / 2;
    //   } else if (orientation === 6) {
    //     this.rotate = Math.PI / 2;
    //   } else if (orientation === 3) {
    //     this.rotate = -Math.PI;
    //   }
    // },
    // getBase64Image(img, rate, direction, type) {
    //   var canvas = document.createElement("canvas");
    //   canvas.style.display = 'none';
    //   document.getElementById('app').appendChild(canvas);
    //   var ctx = canvas.getContext("2d");

    //   canvas.width = img.width * rate;
    //   // canvas.height = img.height * rate;
    //   canvas.height = img.width * rate;

    //   if (direction) {
    //     canvas.width = img.height * rate;
    //     canvas.height = img.width * rate;
    //     ctx.translate(img.height * rate, 0);
    //     ctx.rotate(direction);
    //   }

    //   ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * rate, img.height * rate);

    //   console.log(type);
    //   var dataURL = canvas.toDataURL(type, rate);

    //   document.getElementById('app').removeChild(canvas);
    //   return dataURL;
    // },
    // dataURLToBlob(dataurl) {
    //   var arr = dataurl.split(','),
    //     mime = arr[0].match(/:(.*?);/)[1],
    //     bstr = atob(arr[1]),
    //     n = bstr.length,
    //     u8arr = new Uint8Array(n);
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    //   }
    //   return new Blob([u8arr], {
    //     type: mime
    //   });
    // },
    updateUserAvatar(file) {
      var formData = new FormData();
      var json_data = {
        Token: this.Token,
        photo: file
      };
      formData.append('Token', this.Token);
      formData.append('photo', file);
      formData.append('json_data', JSON.stringify(json_data));
      axios.post(API.SetPhoto, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if(res.data.Meta.ErrorCode === '0') {
          document.getElementById('avatar').src = res.data.Body.ImgPath;
          this.alert('头像修改成功');
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    logoutConfirm() {
      this.DialogConfig = { //对话框配置信息
        IsDialog: '1', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
        DialogTitle: '温馨提示', // 对话框标题
        DialogContent: '确定要退出登录吗？', // 对话框内容
        DialogBtns: ['取消', '确定'], // 对话框按钮文本
      };
    },
    logout() {
      this.DialogConfig.IsDialog = '0';
      window._vds.push(['setCS1', 'user_id', '']);
      this.$store.commit('SetToken', '');
      this.$store.commit('SetIsLogin', '0');
      this.$store.commit('SetUserId', '0');
      this.$router.go(-1);
    },
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
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