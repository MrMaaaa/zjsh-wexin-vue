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
</div>
</template>

<script>
import { mapState } from 'vuex';

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
    }
  },
  activated() {
    this.dateList = [];
    this.timeList = [];
    this.selDate = '';
    this.selTime = '';
    this.dateIndex = 0;
    this.timeIndex = -1;
    this.getServiceTime();
  },
  methods: {
    getServiceTime() {
      this.$loading.open(2);
      this.$store.dispatch('ServiceTimeStartAt', {
          ServiceId: this.OrderInfo.FourServiceId
        })
        .then(res => {
          this.$loading.close();
          this.dateList = res.AvailableDate;
          if (this.OrderInfo.DateTime) {
            // 如果已经选择时间，切换到该时间
            this.dateList.map((value, index) => {
              if (value.Date.indexOf(this.OrderInfo.DateTime.split(' ')[0]) > -1) {
                this.dateIndex = index;
                this.selDate = this.dateList[index].Date.split(' ')[0];
                this.timeList = this.dateList[index].TimeRange2;
                this.timeList.map((val, ind) => {
                  if (val.Time === this.OrderInfo.DateTime.split(' ')[1]) {
                    this.timeIndex = ind;
                    this.selTime = val.Time;
                  }
                });
              }
            })
          } else {
            this.timeList = this.dateList[0].TimeRange2;
            this.selDate = this.dateList[0].Date.split(' ')[0];
          }
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    dateSelect(event, item, index) {
      this.timeIndex = -1;
      event.target.scrollIntoView(false);
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
        this.$router.back();
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
  box-sizing: border-box;
  position: relative;
  padding-bottom: 2rem;
  background-color: #fff;
}
.date
{
  .date-list
  {
    -webkit-justify-content: initial;
    justify-content: initial;
    padding-bottom: 0.226667rem;
    overflow-x: scroll;
    overflow-y: hidden;
    .list-item
    {
      -webkit-flex-shrink: 0;
      flex-shrink: 0;
      position: relative;
      box-sizing: border-box;
      width: 2.133333rem;
      padding: 0.266667rem 0;
      background-color: #eef2f5;
      color: #333639;
      font-size: 14px;
      text-align: center;
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
    justify-content: initial;
    -webkit-justify-content: initial;
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
  background-color: #fff;
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