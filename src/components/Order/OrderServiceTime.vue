<template>
<div>
  <section class="date">
    <ul class="date-list flex-row">
      <li class="list-item" :class="{ active: index === dateIndex }" @click="dateSelect($event, item, index)" v-for="(item, index) in dateList">
        <p class="item-row">{{ item.Date.split(' ')[1] }}</p>
        <p class="item-row">{{ item.Date.split(' ')[0] }}</p>
      </li>
    </ul>
  </section>

  <section class="time">
    <ul class="time-list flex-row">
      <li class="list-item" :class="{ full: item.IsVacant === '0',active: index === timeIndex }" @click="timeSelect(item, index)" v-for="(item, index) in timeList">
        <p class="time-label">{{ item.Time }}</p>
        <p class="time-full" v-if="item.IsVacant === '0'">约满</p>
      </li>
    </ul>
  </section>

  <section class="btn">
    <a class="btn-submit" @click="dateSubmit">确定选择</a>
  </section>

  <m-loading v-show="isLoading"></m-loading>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'order_service_time',
  data() {
    return {
      dateList: [],
      timeList: [],
      selDate: '',
      selTime: '',
      dateIndex: 0,
      timeIndex: -1,
      isLoading: true,
    }
  },
  mounted() {
    this.getServiceTime();
  },
  methods: {
    getServiceTime() {
      axios.post(API.ServiceTimeStartAt, qs.stringify({
        ServiceId: this.OrderInfo.FourServiceId
      }), {
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.isLoading = false;
        if (res.data.Meta.ErrorCode == '0') {
          this.dateList = res.data.Body.AvailableDate;
          this.timeList = this.dateList[0].TimeRange2;
          this.selDate = this.dateList[0].Date.split(' ')[0];
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(function(error) {
        this.isLoading = false;
        this.alert(this.ALERT_MSG.NET_ERROR);
      });
    },
    dateSelect(event, item, index) {
      event.target.scrollIntoView(false);
      console.log(item);
      this.dateIndex = Number(index);
      this.selDate = item.Date.split(' ')[0];
      this.timeList = this.dateList[index].TimeRange2;
    },
    timeSelect(item, index) {
      if(item.IsVacant === '1') {
        this.timeIndex = index;
        this.selTime = item.Time;
      }
    },
    dateSubmit() {
      if(this.selTime == '') {
        this.alert('请选择服务时间');
      } else {
        this.OrderInfo.DateTime = this.selDate + ' ' + this.selTime;
        this.$store.commit('SetOrderInfo', this.OrderInfo);
        this.$router.go(-1);
      }
    }
  },
  computed: {
    ...mapState(['OrderInfo', 'ALERT_MSG'])
  }
}
</script>

<style scoped lang="scss">
.router-view
{
  background-color: #fff;
}
.date
{
  .date-list
  {
    overflow-x: scroll;
    overflow-y: hidden;
    padding-bottom: 0.226667rem;
    .list-item
    {
      position: relative;
      box-sizing: border-box;
      padding: 0.266667rem 0.133333rem;
      background-color: #eef2f5;
      color: #333639;
      text-align: center;
      font-size: 14px;
      flex-shrink: 0;
      -webkit-flex-shrink: 0;
      &.active
      {
        background-color: #27b8f3;
        color: #fff;
      }
      &.active::after
      {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-top: 0.226667rem solid #27b8f3;
        border-left: 0.226667rem solid transparent;
        border-right: 0.226667rem solid transparent;
        border-bottom: 0.226667rem solid transparent;
      }
      .item-row
      {
        font-size: 13px;
      }
    }
  }
}
.time
{
  .time-list
  {
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    padding: 0 0.266667rem;
    .list-item
    {
      flex-grow: 0;
      box-sizing: border-box;
      width: 25%;
      height: 1.6rem;
      padding-top: 0.4rem;
      border: 1px solid #e0e5e9;
      color: #333639;
      text-align: center;
      font-size: 15px;
      &.active
      {
        border: 1px solid #27b8f3;
      }
      &.full
      {
        background-color: #eaeff3;
        .time-label
        {
          color: #999;
        }
      }
      .time-full
      {
        color: #999;
        font-size: 13px;
      }
    }
  }
}
.btn
{
  position: fixed;
  bottom: 0;
  left: 0;
  transform: translateZ(0);
  width: 100%;
  height: 1.933333rem;
  border-top: 1px solid #eef2f5;
  .btn-submit
  {
    display: block;
    height: 1.146667rem;
    line-height: 1.146667rem;
    margin: 0.4rem 0.666667rem;
    border-radius: 4px;
    background-color: #f66165;
    color: #fff;
    text-align: center;
    font-size: 16px;
  }
}
</style>