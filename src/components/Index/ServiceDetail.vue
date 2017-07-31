<template>
<div>
<iframe class="iframe-detail-page" frameborder="no" border="0" marginwidth="0" marginheight="0" :src="detail_url"></iframe>
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
      this.detail_url = this.$route.params.detail_url;
      this.service_id = this.$route.query.service_id;
      window.setDataToDetailPage = () => {
        return this.service_id;
      }
      window.getDataFromDetailPage = data => {
        this.setServiceData(data);
        this.routerTo({ name: 'order_place' }, true);
      }
    } else {
      this.routerTo({ name: 'order_place' }, true);
    }
  },
  methods: {
    setServiceData(data) {
      this.$store.commit('SetThreeServiceId', data.id);
      this.$store.commit('SetThreeServiceName', data.name);
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
</style>