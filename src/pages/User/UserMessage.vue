<template>
<div class="router-view">
  <ul class="message-list">
    <li class="list-item" v-for="(item, key) in messageList" :key="item.Id" @click="linkTo(item, key)">
      <p class="item-datetime">{{ item.Date | formatDate }}</p>
      <div class="item-info">
        <header class="info-title flex-row txt-over-hide">
          <i class="title-icon" :class="{ spot: !item.IsRead }"></i>
          <span>{{ item.Title }}</span>
        </header>

        <div class="info-content txt-over-hide">{{ item.Content }}</div>

        <p class="info-link">点击查看详情>></p>
      </div>
    </li>

    <li>
      <infinite-loading @infinite="getUserMessage" ref="infiniteLoading">
        <span class="no-result" slot="no-more">没有更多消息了</span>
        <span class="no-result" slot="no-results">暂无消息</span>
      </infinite-loading>
    </li>
  </ul>

  <div class="btn-delete" v-if="messageList.length > 0" @click="clearMessage">全部删除</div>
</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { mapState } from 'vuex';
import Utils from '../../config/utils.js';

export default {
  name: 'user_message',
  data() {
    return {
      isMounted: true,
      messageIndex: 1,
      messageList: []
    }
  },
  components: {
    InfiniteLoading,
  },
  mounted() {
  },
  activated() {
    if (!this.isMounted) {
      this.messageIndex = 1;
      this.getUserMessage();
    } else {
      this.isMounted = false;
    }
  },
  methods: {
    getUserMessage() {
      this.$store.dispatch('GetUserMessage', {
          PageIndex: this.messageIndex + ''
        })
        .then(res => {
          if (this.messageIndex === 1) {
            this.messageList.splice(0);
          }
          if (res.Messages.length > 0) {
            this.messageIndex++;
            this.messageList = this.messageList.concat(res.Messages);
            this.$refs.infiniteLoading.stateChanger.loaded();
          } else {
            this.$refs.infiniteLoading.stateChanger.complete();
          }
        })
        .catch(err => {
          this.$refs.infiniteLoading.stateChanger.complete();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    linkTo(item, index) {
      // 设置消息已读
      item.IsRead = true;
      this.$set(this.messageList, index, item);
      this.$store.dispatch('SetUserMessage', {
        Ids: [item.Id]
      })
      .then()
      .catch();

      // 处理消息跳转
      if (!item.JumpParam) {
        // 没有该参数作为消息详情页
        this.$router.push({
          name: 'user_message_detail',
          params: {
            title: item.Title,
            content: item.Content
          }
        });
      } else if (item.MessageType === '1') {
        // 跳转活动url
        this.$router.push({
          name: Utils.urlToRoute(item.JumpParam.Url)
        });
      } else if (item.MessageType === '2') {
        // 跳转其他页面
        switch (item.JumpParam.AppViewId) {
          // 订单支付
          case '10015':
            this.$router.push({
              name: 'order_pay',
              params: {
                orderId: item.JumpParam.Order.OrderId
              }
            });
            break;
          // 订单详情
          case '10017':
            this.$router.push({
              name: 'order_detail',
              params: {
                orderId: item.JumpParam.Order.OrderId
              }
            });
            break;
          default:
            break;
        }
      }
    },
    clearMessage() {
      this.$dialog({
        title: '温馨提示',
        msg: '是否删除所有消息？删除后不可恢复',
        btns: [{
          text: '取消'
        }, {
          text: '删除',
          callback: () => {
            this.$store.dispatch('ClearUserMessage')
              .then(res => {
                this.$alert('删除成功');
                this.messageIndex = 1;
                this.messageList.splice(0);
                this.getUserMessage();
              })
              .catch(err => {
                this.$alert(err.message || err.ErrorMsg);
              });
          }
        }]
      });
    }
  },
  computed: {
    ...mapState(['ALERT_MSG']),
  },
  filters: {
    formatDate(val) {
      val = parseInt(val + '000');
      var date = new Date(val);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      // month = month.toString().padStart(2, '0');
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      // day = day.toString().padStart(2, '0');
      return year + '-' + month + '-' + day;
    }
  }
}
</script>

<style scoped lang="scss">
$color_base_bg: #f7f7ff;
$color_base_red: #f56165;
$color_text_normal: #333639;
$color_text_very_light: #b2b2b2;
$color_text_light: #666;

.router-view
{
  background: #f6f6f6;
}

.message-list
{
  box-sizing: border-box;
  background: #fff;
  padding-bottom: 1.333333rem;
  height: 100%;
  background: #f6f6f6;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  .list-item
  {
    border-bottom: 1px solid #e0dfe2;
    background: #fff;
    .item-datetime
    {
      padding: 0.333333rem 0 0.133333rem 0;
      background: #f6f6f6;
      color: $color_text_very_light;
      text-align: center;
      font-size: 10px;
    }
    .item-info
    {
      padding: 0.32rem 0;
      border-top: 1px solid #efeff0;
      overflow: auto;
      .info-title
      {
        -webkit-justify-content: initial;
        justify-content: initial;
        padding: 0.053333rem 0;
        color: $color_text_normal;
        font-size: 16px;
        font-weight: bolder;
        .title-icon
        {
          position: relative;
          display: inline-block;
          width: 0.533333rem;
          height: 0.533333rem;
          margin: 0 0.2rem;
          background: url(../../assets/images/icon_messge.png) no-repeat;
          background-size: 100% 100%;
          vertical-align: middle;
          &.spot::after
          {
            position: absolute;
            top: -0.053333rem;
            right: -0.053333rem;
            content: '';
            display: block;
            width: 0.213333rem;
            height: 0.213333rem;
            border-radius: 0.106667rem;
            background: #f00;
          }
        }
      }
      .info-content
      {
        margin: 0.266667rem 0.266667rem 0 0.933333rem;
        color: $color_text_light;
        font-size: 14px;
      }
      .info-link
      {
        margin: 0.266667rem 0.266667rem 0 0.933333rem;
        color: #a6a5b5;
        text-align: right;
      }
    }
  }
}

.btn-delete
{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  transform: translateZ(0);
  width: 100%;
  height: 1.146667rem;
  line-height: 1.146667rem;
  border-top: 1px solid #e0dfe2;
  background: #fff;
  color: $color_base_red;
  text-align: center;
  font-size: 16px;
}
</style>