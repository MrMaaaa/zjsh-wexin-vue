<template>
<div>
  <order-item :order-item="orderInfo" v-if="orderInfo"></order-item>

  <m-loading :bg-style="1" v-show="isLoading"></m-loading>
</div>
</template>

<script>
import OrderItem from '../Plugs/order-item';
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'order_pay_status',
  data() {
    return {
      orderInfo: null,
      isLoading: true,
    }
  },
  mounted() {
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail() {
      axios.post(API.GetOrderInfoEx, qs.stringify({
        Token: this.Token,
        OrderId: this.$route.params.orderId,
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        this.isLoading = false;
        this.bgLoading = '2';
        if (res.data.Meta.ErrorCode === '0') {
          this.orderInfo = res.data.Body.Order;
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(error => {
        this.isLoading = false;
        this.txtLoading = '';
        this.bgLoading = '2';
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    }
  },
  computed: {
    ...mapState(['Token']),
  },
  components: {
    OrderItem,
  },
}
</script>