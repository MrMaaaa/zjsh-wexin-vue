<template>
<div>
  <section class="name-input flex-row">
    <span class="name">昵称</span><input class="input" ref="input" type="text" v-model="newNickName" placeholder="10个字符以内，支持中英文、数字"><img class="input-clr" @click="inputClear" src="../../assets/images/input_delete.png">
  </section>
  <a class="btn" @click="updateNickName">保存修改</a>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'user_nickname_edit',
  data() {
    return {
      newNickName: ''
    }
  },
  mounted() {
  },
  activated() {
    this.newNickName = this.$route.query.name;
  },
  methods: {
    updateNickName() {
      if(this.newNickName != '') {
        axios.post(API.SetNickName, qs.stringify({
          Token: this.Token,
          NickName: this.newNickName,
        })).then(res => {
          if (res.data.Meta.ErrorCode === '0') {
            this.UserInfo.NickName = this.newNickName;
            this.$store.commit('SetUserInfo', this.UserInfo);
            this.alert('修改成功', () => {
              this.$router.go(-1);
            });
          } else {
            this.alert(res.data.Meta.ErrorMsg);
          }
        }).catch(err => {
          this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
        });
      } else {
        this.alert('请输入1-10个中文或英文作为昵称');
      }
    },
    inputClear() {
      this.newNickName = '';
      this.$refs.input.focus();
    }
  },
  computed: {
    ...mapState(['Token', 'UserInfo', 'ALERT_MSG']),
  },
}
</script>

<style scoped lang="scss">
.name-input
{
  position: relative;
  margin-top: 0.253333rem;
  padding: 0 0.426667rem;
  background-color: #fff;
  .name
  {
    line-height: 100%;
    color: #333639;
    font-size: 17px;
  }
  .input
  {
    display: block;
    width: 1px;
    -webkit-flex: 1;
    flex: 1;
    margin-left: 0.106667rem;
    padding: 0.266667rem 0;
    font-size: 17px;
  }
  .input-clr
  {
    position: absolute;
    right: 0.426667rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.586667rem;
    height: 0.586667rem;
  }
}
.btn
{
  display: block;
  height: 1.146667rem;
  line-height: 1.146667rem;
  margin: 0.533333rem 0.426667rem 0;
  border-radius: 4px;
  background-color: #f56165;
  color: #fff;
  font-size: 17px;
  text-align: center;
}
</style>