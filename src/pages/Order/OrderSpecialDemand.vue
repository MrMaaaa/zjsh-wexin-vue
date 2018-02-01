<template>
<div class="router-view" v-if="demand">
  <section class="demand" v-for="item in demand.demand" :key="item.title">
    <header class="demand-title">{{ item.title }}</header>

    <div class="demand-list flex-row" :class="{ multiple:  item.isMultiple }">
      <a class="list-item" :class="{ active: value.isSelected, datetime: value.isDatetime }" v-for="(value, key) in item.contentList" :key="key" @click="selected(value, item.contentList, item.isMultiple)">
        <span class="item-name" v-if="value.isDatetime">
          <span class="date year">{{ value.name.split('-')[0] }}年</span>
          <span class="date month">{{ value.name.split('-')[1] }}月</span>
        </span>
        <span class="item-name" v-if="!value.isDatetime">{{ value.name }}</span>
        <img class="icon-select selected" src="../../assets/images/order_selected.png">
        <img class="icon-select no-select" src="../../assets/images/orders_choose.png">
      </a>
    </div>
  </section>

  <section class="demand">
    <header class="demand-title">备注留言</header>

    <textarea class="demand-remarks" v-model="demand.customeRemarks" :placeholder="demand.remarks"></textarea>
  </section>

  <div class="btn">
     <a class="btn-confirm" @click="confirm">确认</a>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import specialDemand from '../../config/specialDemand.js';

export default {
  name: 'order_special_demand',
  data() {
    return {
      demand: {}
    }
  },
  activated() {
    this.demand = specialDemand[this.$route.params.serviceId];
    this.demand.customeRemarks = '';
  },
  methods: {
    selected(item, list, isMultiple = false) {
      if (isMultiple) {
        item.isSelected = !item.isSelected;
      } else {
        list.map(value => {
          value.isSelected = item.name === value.name ? true : false;
        });
      }
    },
    isConfirm() {
      if (!this.demand) return false;
      // 如果一个子数组中包含至少一个isSelected值为true,li拼接1,否则拼接0
      // 根据最后li中是否包含0来判断是否已经全部都至少选中一个
      let li = '';
      this.demand.demand.map(value => {
        let itemOk = false;
        value.contentList.map(val => {
          if (val.isSelected) {
            itemOk = true;
          }
        });
        li += itemOk ? '1' : '0';
      });
      return li.indexOf('0') > -1 ? false : true;
    },
    confirm() {
      if (!this.isConfirm()) {
        this.$alert('请选择主要需求');
      } else {
        let remarks = '';
        this.demand.demand.map(value => {
          remarks += value.mtitle + '：';
          value.contentList.map((val, index) => {
            if (val.isSelected) {
              remarks += index === 0 ? '' : ' ';
              remarks += val.name;
            }
          });
          remarks += '；';
        });
        remarks += '备注留言：' + (this.demand.customeRemarks ? this.demand.customeRemarks : '无');
        this.OrderInfo.ServiceContent = remarks;
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
$color_base_bg: #f7f7ff;
$color_base_red: #f56165;
$color_base_blue: #27B8F3;
$color_text_normal: #333639;
$color_text_light: #666;

.router-view
{
  box-sizing: border-box;
  padding-bottom: 2.266667rem;
  background: #fff;
  overflow: auto;
}
.demand
{
  margin-top: 0.4rem;
  .demand-title
  {
    padding-left: 0.426667rem;
    color: $color_text_normal;
    font-size: 14px;
  }
  .demand-list
  {
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-justify-content: initial;
    justify-content: initial;
    margin-top: 0.133333rem;
    padding: 0 0.426667rem;
    &.multiple
    {
      .list-item
      {
        .no-select
        {
          display: block;
        }
      }
    }
    .list-item
    {
      position: relative;
      box-sizing: border-box;
      display: block;
      width: 2.8rem;
      height: 1.066667rem;
      line-height: 1.066667rem;
      margin: 0.133333rem 0;
      border: 1px solid #e7ebee;
      border-radius: 0.533333rem;
      color: $color_text_light;
      font-size: 15px;
      text-align: center;
      &.datetime
      {
        line-height: 0.533333rem;
        .date
        {
          display: block;
          line-height: 100%;
          &.year
          {
            margin-top: 0.16rem;
            font-size: 12px;
          }
          &.month
          {
            margin-top: 0.026667rem;
          }
        }
      }
      &:not(:nth-child(3n+1))
      {
        margin-left: 0.373333rem;
      }
      &.active
      {
        border: 1px solid $color_base_blue;
        color: $color_base_blue;
        .selected
        {
          display: block;
        }
        .no-select
        {
          display: none;
        }
      }
      .item-name
      {
        display: block;
        overflow: auto;
      }
      .icon-select
      {
        position: absolute;
        top: 0;
        right: 0;
        width: 0.56rem;
        height: 0.56rem;
      }
      .selected
      {
        display: none;
      }
      .no-select
      {
        display: none;
      }
    }
  }
  .demand-remarks
  {
    box-sizing: border-box;
    display: block;
    width: 9.146667rem;
    height: 2.706667rem;
    margin: 0.266667rem auto 0;
    padding: 0.266667rem;
    border-radius: 4px;
    background: #f7f9fa;
    color: $color_text_normal;
    font-size: 14px;
    resize: none;
  }
}
.btn
{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  transform: translateZ(0);
  width: 100%;
  height: 1.946667rem;
  background: #fff;
  .btn-confirm
  {
    display: block;
    width: 8.666667rem;
    height: 1.146667rem;
    line-height: 1.146667rem;
    margin: 0.44rem auto 0;
    border-radius: 6px;
    background: $color_base_red;
    color: #fff;
    text-align: center;
    font-size: 16px;
  }
}
</style>