<template>
  <div class="warn-info-wrapper" v-show="isShow && warnMsg != ''" @click="wrapperClick">
    <div class="warn-info">
      <span class="txt">{{ warnMsg }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'warn-info',
  data () {
    return {
      isShow: false
    }
  },
  props: ['warnMsg', 'isWarn', 'timeout', 'callback'],
  methods: {
    wrapperClick() {
      // 如果点击了弹框遮罩，立即关闭弹框，并执行回调
      this.isShow = false;
      this.callback && this.callback();
      this.$store.commit('InitAlertCallback');
    },
  },
  watch: {
    isWarn() {
      this.isShow = this.isWarn === '1' ? true : false;
      const that = this;
      if (this.timeout > 0) {
        // setTimeout(function() {
        //   that.isShow = false;
        // }, this.timeout);
      }
    }
  }
}
</script>

<style scoped>
.warn-info-wrapper
{
  position: fixed;
  top: 0;
  left: 0;
  transform: translateZ(0);
  z-index: 9999999;

  width: 100%;
  height: 100%;
}
.warn-info-wrapper .warn-info
{
  width: 100%;
  height: 100%;
  transform: translateY(65%);

  text-align: center;
}
.warn-info-wrapper .warn-info .txt
{
  display: inline-block;
  max-width: 85%;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;

  background-color: #585858;
  color: #fff;
  font-size: 16px;
}
</style>
