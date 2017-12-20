<template>
  <div class="dialog-wrapper">
    <div class="dialog">
      <div class="title">{{ title }}</div>

      <div class="content">{{ msg }}<slot name="message"></slot></div>

      <div class="btns flex-row">
        <a class="btn" v-for="(item, key) in btns" :key="key" @click="close(item.callback || null)">{{ item.text }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    title: {
      type: [String, Number],
      default: ''
    },
    msg: {
      type: [String, Number],
      default: ''
    },
    btns: {
      type: Array,
      default: () => {
        return [{
          text: '确定',
          callback: null
        }]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-wrapper
{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  .dialog
  {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 85%;
    transform: translate(-50%, -50%);

    border-radius: 3px;

    background-color: #fff;
    text-align: center;
    font-size: 14px;
    .title
    {
      padding: 0.48rem 0.533333rem 0.213333rem;

      font-size: 16px;
    }
    .content
    {
      padding: 0 0.533333rem;

      color: #888;
      text-align: left;
    }
    .btns
    {
      position: relative;

      height: 1.12rem;
      line-height: 1.12rem;
      margin-top: 0.533333rem;

      text-align: center;
      &::before
      {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        transform: scaleY(0.5);

        width: 100%;
        height: 1px;

        background-color: #d5d5d6;
      }
    }
    .btn
    {
      flex-grow: 1;
      -webkit-flex-grow: 1;

      color: #353535;
      font-size: 16px;
      &:last-child
      {
        position: relative;

        color: #f56165;
      }
      &:last-child::after
      {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 0 0;
        transform: scaleX(0.5);
        width: 1px;
        height: 100%;
        background-color: #d5d5d6;
      }
    }
  }
}
</style>
