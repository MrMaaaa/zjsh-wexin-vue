<template>
<div class="textarea-wrapper" @click="onFocus($event)">
  <div class="textarea" :class="[textareaClasses]" :style="textareaStyle" contenteditable="true" ref="textarea" @input="onInput($event)" @focus="onFocus($event)" @blur="onBlur($event)">
  </div>
  <div class="placeholder-wrapper">
    <span class="placeholder" :class="[placeholderClasses]" :style="placeholderStyle" v-if="mPlaceholder && mText === '' && !isFocus">{{ mPlaceholder }}</span>
    <slot class="placeholder" name="placeholder" v-if="mText === '' && !isFocus"></slot>
  </div>
</div>
</template>

<script>
export default {
  name: 'm-textarea',
  data() {
    return {
      isFocus: false
    }
  },
  props: {
    mText: {
      type: [String, Number],
      default: ''
    },
    mPlaceholder: {
      type: [String, Number],
      default: ''
    },
    textareaClasses: String,
    textareaStyle: String,
    placeholderClasses: String,
    placeholderStyle: String
  },
  methods: {
    onInput(event) {
      this.$emit('update:mText', event.target.innerText);
    },
    onFocus(event) {
      let body = document.body;
      this.$refs.textarea.focus();
      window.setTimeout(() => {
        this.$refs.textarea.scrollIntoView(false);
        this.$refs.textarea.scrollIntoViewIfNeeded();
      }, 300);
      this.isFocus = true;
    },
    onBlur(event) {
      this.isFocus = false;
    }
  },
  watch: {
    mText(newValue) {
      // 这里只在非输入状态(一般是点击了清空按钮或者其它情况js修改)的时候才去监听
      if (!this.isFocus) {
        this.$refs.textarea.innerText = newValue;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.textarea-wrapper
{
  position: relative;
  width: 100%;
  .textarea
  {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%) translateZ(0);
    box-sizing: border-box;
    display: block;
    width: 100%;
    max-height: 1.066667rem;
    color: #333639;
    font-size: 15px;
    overflow-y: scroll;
    -webkit-user-modify: read-write-plaintext-only;
    user-modify: read-write-plaintext-only;
    &:focus
    {
      border: none;
      outline: none;
    }
  }
  .placeholder-wrapper
  {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%) translateZ(0);
    width: 100%;
    height: 100%;
    color: #999;
    .placeholder
    {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%) translateZ(0);
    }
  }
}
</style>