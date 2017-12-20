<template>
<div class="message">
  <header class="title">{{ title }}</header>

  <section class="content">{{ content }}</section>
</div>
</template>

<script>

export default {
  name: 'user_message_detail',
  data() {
    return {
      title: '',
      content: ''
    }
  },
  activated() {
    if (!this.$route.params.title || !this.$route.params.content) {
      this.$router.replace({
        name: 'user_message'
      });
    } else {
      this.title = this.$route.params.title;
      this.content = this.$route.params.content;
    }
  },
}
</script>

<style scoped lang="scss">
.message
{
  background: #fff;
  .title
  {
    padding: 0.4rem 0 0.2rem;
    font-size: 18px;
    text-align: center;
  }
  .content
  {
    padding: 0.4rem;
    font-size: 16px;
  }
}
</style>