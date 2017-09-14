<template>
<div>
  <section class="service flex-row" v-for="item in services" @click="routeTo(item)">
    <div class="service-icon">
      <img :src="item.IconUrl || defaultIcon">
    </div>

    <div class="service-info">
      <header class="info-title">{{ item.ServiceName }}</header>
      <div class="info-desc">{{ item.Description }}</div>
    </div>
  </section>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'recommend_more',
  data() {
    return {
      serviceId: '',
      services: [],
      defaultIcon: require('../../assets/images/service_detail_default.png'),
    }
  },
  activated() {
    let oldId = this.serviceId;
    this.serviceId = this.$route.query.id;
    if(oldId !== this.serviceId) {
      this.getServiceMore();
    }
  },
  methods: {
    getServiceMore() {
      this.services.splice(0);
      axios.post(API.QueryService, qs.stringify({
        Token: this.Token,
        ServiceId: this.serviceId,
        IsNewVersion: '1',
      })).then(res => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode === '0') {
          this.services = res.data.Body.Items;
          document.title = res.data.Body.Title;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    routeTo(item) {
      if(item.ServiceId == '21') {
        // 顺丰速运
        this.$router.push({
          name: 'express'
        });
      } else if(item.ServiceId == '59') {
        // 快递跑腿
        this.$router.push({
          name: 'errand'
        });
      } else {
        this.$router.push({
          name: 'service_detail',
          query: {
            id: item.ServiceId
          },
          params: {
            url: item.DetailUrl,
            img: '',
          }
        });
      }
    }
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
  }
}
</script>

<style scoped lang="scss">
$text-normal: #333639;
$text-light: #666;
.service
{
  margin-top: 0.266667rem;
  background-color: #fff;
  .service-icon
  {
    position: relative;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.453333rem;
    border-radius: 50%;
    background-color: #96a7f9;
    text-align: center;
    img
    {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      width: 50%;
    }
  }
  .service-info
  {
    flex: 1;
    box-sizing: border-box;
    width: 1px;
    padding-right: 0.453333rem;
    .info-title
    {
      line-height: 100%;
      color: $text-normal;
      font-size: 16px;
    }
    .info-desc
    {
      margin-top: 0.2rem;
      color: $text-light;
      font-size: 12px;
    }
  }
}
</style>