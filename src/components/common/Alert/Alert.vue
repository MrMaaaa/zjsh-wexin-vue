<template>
  <div class="warn-info-wrapper">
    <div class="warn-info">
      <span class="txt">{{ msg }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    msg: {
      type: [String, Number],
      default: ''
    },
    timeout: {
      type: [Number],
      default: 1500
    },
    callback: {
      type: [Function],
      default () {
        return () => {}
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
