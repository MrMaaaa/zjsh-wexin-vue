<template>
<div>
  <header class="complaint-title">选择取消原因，我们将第一时间为您处理</header>

  <div class="complaint-list">
    <p class="list-item flex-row" @click="switchReason(item, index)" v-for="(item, index) in reasonList">
      <span class="item-txt">{{ item }}</span>

      <img class="item-icon" v-show="index == selectedIndex" src="../../assets/images/orders_pitch_on.png">
      <img class="item-icon" v-show="index != selectedIndex" src="../../assets/images/orders_choose.png">
    </p>
  </div>

  <div class="complaint-custom" v-show="isCustomReason == '1'">
    <textarea class="custom-input" v-model="customReason" placeholder="请对我们的服务提出建议"></textarea>
  </div>

  <div class="btn">
    <a class="btn-submit" :class="{ disable: !isSubmit }" @click="submitComplaint">提交</a>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'order_complaint_reason',
  data () {
    return {
      orderId: '',
      reasonList: [],
      selectedIndex: -1,
      cancelReason: '',
      customReason: '',
      isCustomReason: '0',
    }
  },
  activated() {
    this.orderId = this.$route.params.orderId;
    this.selectedIndex = -1;
    this.customReason = '';
    this.getReasonList();
  },
  methods: {
    getReasonList() {
      this.$loading.open(1);
      this.$store.dispatch('GetOrderCancelReasonList')
      .then(res => {
        this.$loading.close();
        this.reasonList = res.List;
      })
      .catch(err => {
        this.$loading.close();
        this.$alert(err.message || err.ErrorMsg);
      });
    },
    switchReason(item, index) {
      this.selectedIndex = index;
      this.cancelReason = item;
      if(item == '其他') {
        this.isCustomReason = '1';
      } else {
        this.isCustomReason = '0';
      }
    },
    submitComplaint() {
      this.$loading.open(2);
      this.$store.dispatch('OrderCancel', {
        OrderId: this.orderId,
        CancelReason: this.cancelReason == '其他' ? this.customReason : this.cancelReason
      })
      .then(res => {
        this.$loading.close();
        this.$alert('取消成功');
        this.$router.back();
      })
      .catch(err => {
        this.$loading.close();
        this.$alert(err.message || err.ErrorMsg);
      });
    },
  },
  computed: {
    ...mapState(['ALERT_MSG']),
    isSubmit() {
      if(this.cancelReason == '' || this.cancelReason == '其他' && this.customReason == '') {
        return false;
      } else {
        return true;
      }
    },
  },
}
</script>

<style scoped lang="scss">
.router-view
{
  box-sizing: border-box;
  padding-bottom: 1.946667rem;
}
.complaint-title
{
  line-height: 100%;
  padding: 0.4rem 0;
  background-color: #fff;
  font-size: 16px;
  text-align: center;
}
.complaint-list
{
  margin-top: 0.2rem;
  background-color: #fff;
  .list-item
  {
    line-height: 100%;
    padding: 0.333333rem 0.4rem;
    .item-txt
    {
      color: #333639;
      font-size: 14px;
    }
    .item-icon
    {
      width: 0.466667rem;
    }
  }
}
.complaint-custom
{
  padding: 0.266667rem 0.4rem;
  background-color: #fff;
  .custom-input
  {
    box-sizing: border-box;
    width: 100%;
    height: 3.0rem;
    padding: 0.2rem;
    border: none;
    outline: none;
    background-color: #eef2f5;
    resize: none;
  }
}
.btn
{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.946667rem;
  border-top: 1px solid #eef2f5;
  background-color: #fff;
  .btn-submit
  {
    display: block;
    height: 1.146667rem;
    line-height: 1.146667rem;
    margin: 0.4rem 0.426667rem;
    border-radius: 4px;
    background-color: #f56165;
    color: #fff;
    text-align: center;
    font-size: 16px;
    &.disable
    {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}
</style>