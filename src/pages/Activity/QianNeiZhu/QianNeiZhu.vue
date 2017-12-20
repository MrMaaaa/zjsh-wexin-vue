<template>
<div>
  <div class="wrapper">
    <img class="bg-main" src="../../../../assets/static/images/activity/qnz_bg.png">

    <div class="click" @click="checkPhoneNumber"></div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'qianneizhu',
  mounted() {
  },
  activated() {
    if(this.$route.params.selfLink) {
      this.checkPhoneNumber();
    } else if(window.history && window.history.length < 2) {
      this.checkPhoneNumber();
    }
  },
  methods: {
    checkPhoneNumber() {
      this.$store.dispatch('VerifyToken')
        .then(res => {
          this.getUserInfo();
        })
        .catch(err => {
          if (err.ErrorCode === '2004') {
            this.$router.push({
              name: 'login',
              params: {
                callback: () => {
                  window.setTimeout(() => {
                    this.getUserInfo();
                  }, 50);
                }
              }
            });
          } else {
            this.$alert(err.message || err.ErrorMsg);
          }
        });
    },
    getUserInfo() {
      this.$loading.open(1);
      this.$store.dispatch('GetUserInfo')
        .then(res => {
          this.$loading.close();
          this.linkToQNZ(res.Info.PhoneNumber);
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    linkToQNZ(phone) {
      window.location.href = 'https://www.qianneizhu.com/promotion/index.html?code=zhujia&phone=' + phone;
    }
  },
  computed: {
    ...mapState(['ALERT_MSG'])
  }
}
</script>

<style scoped lang="scss">
.wrapper
{
  position: relative;
  .bg-main
  {
    display: block;
    width: 100%;
  }
  .click
  {
    position: absolute;
    top: 7.733333rem;
    left: 0;
    width: 100%;
    height: 8.0rem;
  }
}
</style>