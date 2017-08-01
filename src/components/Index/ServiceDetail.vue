<template>
<div class="wrapper">
<iframe class="iframe-detail-page" scrolling="yes" id="iframe" frameborder="no" border="0" marginwidth="0" marginheight="0" :src="detail_url"></iframe>

<div class="subumit">
  <a class="btn-submit" @click="subumitForWx">立即预约</a>
</div>
</div>
</template>

<script>
export default {
  name: 'service_detail',
  data() {
    return {
      detail_url: '',
      detailData: {
        id: '',
        name: ''
      }
    }
  },
  mounted() {
    if(this.$route.query && this.$route.params) {
      // 该方法已被替换，但为避免兼容问题，仍然保留这些内容↓↓↓↓↓↓↓↓↓↓
      this.detail_url = this.$route.params.detail_url;
      this.service_id = this.$route.query.service_id;
      window.setDataToDetailPage = () => {
        return this.service_id;
      }
      window.getDataFromDetailPage = data => {
        this.setServiceData(data);
        this.routerTo({ name: 'order_place' }, true);
      }
      // 该方法已被替换，但为避免兼容问题，仍然保留这些内容↑↑↑↑↑↑↑↑↑↑
    } else {
      this.$router.go(-1);
    }

    var iframe = document.getElementById("iframe");

    iframe.onload = () => {
      document.getElementById("iframe").contentWindow.document.getElementById('now_submit').style.visibility = 'hidden';
    }
  },
  methods: {
    setServiceData(data) {
      this.$store.commit('SetThreeServiceId', data.id);
      this.$store.commit('SetThreeServiceName', data.name);
    },
    subumitForWx() {
      // ios下会导致iframe中的fixed元素不相对于父页面来定位，因此在详情页下方放置一个按钮用来填补缺失
      // 使用此按钮就无需在iframe中添加调用父页面方法
      this.routerTo({ name: 'order_place' }, true);
    },
    routerTo(option={'name':'order_place'}, isReplace=false) {
      if (isReplace) {
        this.$router.replace(option);
      } else {
        this.$router.push(option);
      }
    }
  }
}
</script>

<style scoped>
.iframe-detail-page
{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}
.wrapper
{
  position: relative;
}
.subumit
{
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
  padding: 15px 25px;
  border-top: 1px solid #eaeff3;

  background-color: #fff;
}
.btn-submit
{
  display: block;
  width: 100%;
  height: 43px;
  line-height: 43px;
  border: none;
  border-radius: 6px;
  background-color: #f56165;

  color: #fefeff;
  font-size: 14px;
  text-align: center;
}
</style>