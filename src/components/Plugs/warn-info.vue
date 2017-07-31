<template>
  <div class="warn-info-wrapper" v-show="isShow" @click="isShow = false">
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
  props: ['warnMsg', 'isWarn', 'timeout'],
  watch: {
    isWarn() {
      this.isShow = this.isWarn === '1' ? true : false;
      const that = this;
      if (this.timeout > 0) {
        setTimeout(function() {
          that.isShow = false;
        }, this.timeout);
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
