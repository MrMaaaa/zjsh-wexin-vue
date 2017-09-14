<template>
  <div class="dialog-wrapper" v-show="DialogConfig.IsDialog == '1'">
    <div class="dialog">
      <div class="title">{{ DialogConfig.DialogTitle }}</div>

      <div class="content">{{ DialogConfig.DialogContent }}</div>

      <div class="btns flex-row">
        <a class="btn" :href="DialogConfig.DialogBtnsHref && DialogConfig.DialogBtnsHref[0]" @click="cancel">{{ DialogConfig.DialogBtns[0] }}</a>
        <a class="btn confirm" :href="DialogConfig.DialogBtnsHref && DialogConfig.DialogBtnsHref[1]" v-show="DialogConfig.DialogBtns[1]" @click="confirm">{{ DialogConfig.DialogBtns[1] }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'm-dialog',
  data () {
    return {
      btnCancelText: '取消',
      btnConfirmText: '确认',
    }
  },
  /*
  DialogConfig 对话框配置信息
  {
    IsDialog: '0 | 1', // 是否开启对话框，需在父组件中改变状态才能显示/关闭
    DialogTitle: 'string', // 对话框标题
    DialogContent: 'string', // 对话框内容
    DialogBtns: ['string'], // 对话框按钮文本
    DialogBtnsHref: ['string'], // 按钮的href属性
  }
  */
  props: ['DialogConfig'],
  watch: {
    DialogConfig() {
      this.btnCancelText = this.DialogConfig.DialogBtns[0];
      this.btnConfirmText = this.DialogConfig.DialogBtns[1] || '';
    }
  },
  methods: {
    cancel() {
      this.$emit('dialog-cancel');
    },
    confirm() {
      this.$emit('dialog-confirm');
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
      &.confirm
      {
        position: relative;

        color: #0bb20c;
      }
      &.confirm::after
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
