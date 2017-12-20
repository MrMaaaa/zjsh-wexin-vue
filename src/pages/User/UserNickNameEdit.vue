<template>
<div>
  <section class="name-input flex-row">
    <span class="name">昵称</span><input class="input" ref="input" type="text" maxlength="10" v-model="newNickName" placeholder="10个字符以内，支持中英文、数字"><img class="input-clr" @click="inputClear" src="../../assets/images/input_delete.png">
  </section>
  <a class="btn" @click="updateNickName">保存修改</a>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'user_nickname_edit',
  data() {
    return {
      newNickName: '',
      isExit: false,
    }
  },
  mounted() {
  },
  activated() {
    this.newNickName = this.$route.query.name;
    this.isExit = false
  },
  beforeRouteLeave(to, from, next) {
    if (this.isExit) {
      next();
    } else {
      next(false);
      this.$dialog({
        title: '温馨提示',
        msg: '昵称未保存，确认退出吗？',
        btns: [{
          text: '取消'
        }, {
          text: '确定',
          callback: () => {
            this.isExit = true;
            this.$router.back();
          }
        }]
      });
    }
  },
  methods: {
    updateNickName() {
      this.$loading.open(2);
      if(this.newNickName !== '') {
        this.$store.dispatch('SetNickName', {
            NickName: this.newNickName
          })
          .then(res => {
            this.$loading.close();
            this.$router.back();
            this.$alert('修改成功');
          })
          .catch(err => {
            this.$loading.close();
            this.$alert(err.message || err.ErrorMsg);
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
    ...mapState(['ALERT_MSG']),
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