<template>
<div class="m-evaluate" v-show="showEvaluate == '1'">
  <div class="wrapper" @click="$emit('confirm-finish')"></div>

  <div class="evaluate-container">
    <header class="container-title">评价本次服务<img class="btn-close" @click="$emit('evaluate-finish')" src="../../assets/images/close2.png"></header>

    <div class="container-main">
      <div class="main-stars">
        <span @click="switchStar(1)">
          <img class="star" src="../../assets/images/star.png">
        </span>
        <span @click="switchStar(2)">
          <img class="star" v-if="star >= 2" src="../../assets/images/star.png">
          <img class="star" v-else src="../../assets/images/star_empty.png">
        </span>
        <span @click="switchStar(3)">
          <img class="star" v-if="star >= 3" src="../../assets/images/star.png">
          <img class="star" v-else src="../../assets/images/star_empty.png">
        </span>
        <span @click="switchStar(4)">
          <img class="star" v-if="star >= 4" src="../../assets/images/star.png">
          <img class="star" v-else src="../../assets/images/star_empty.png">
        </span>
        <span @click="switchStar(5)">
          <img class="star" v-if="star >= 5" src="../../assets/images/star.png">
          <img class="star" v-else src="../../assets/images/star_empty.png">
        </span>
      </div>

      <div class="main-star-txt" v-if="starLevelInfos.length > 0">{{ starLevelInfos[star - 1].Description }}</div>

      <div class="main-tips flex-row" v-if="starLevelInfos.length > 0">
        <span class="tips-item" :class="{ active: tags[index] && tags[index] != '' }" @click="addTag(item, index)" v-for="(item, index) in starLevelInfos[star - 1].Labels">{{ item }}</span>
      </div>

      <div class="main-input">
        <textarea maxlength="40" v-model="content" class="textarea"></textarea>
        <span class="text-limit">{{ 40 - Number(content.length) }}</span>
      </div>
    </div>

    <a class="btn-submit" :class="{ disable: isSubmit == '0' }" @click="submitEvaluate">匿名提交</a>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'm-dialog-evaluate',
  data () {
    return {
      star: 5,
      content: '',
      tags: [], // 用来保存选中了哪些标签
      starLevelInfos: [],
      isSubmit: '1' // 是否允许提交按钮
    }
  },
  props: ['showEvaluate', 'orderCode', 'ServiceTypeId'],
  mounted() {
    this.getStarLevel();
  },
  methods: {
    init() {
      this.star = 5;
      this.content = '';
      this.tags.splice(0);
      this.starLevelInfos.splice(0);
    },
    getStarLevel() {
      axios.post(API.GetStarLevel, qs.stringify({
        Token: this.Token,
        ServiceTypeId: this.ServiceTypeId,
      })).then(res => {
        if (res.data.Meta.ErrorCode === '0') {
          this.starLevelInfos = res.data.Body.StarLevelLabelInfos;
        } else {
          this.alert(res.data.Meta.ErrorMsg, 2000);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
      });
    },
    switchStar(star) {
      this.star = star;
      this.tags.splice(0);
    },
    addTag(txt, index) {
      if (!this.tags[index] || this.tags[index] == '') {
        this.$set(this.tags, index, txt);
      } else {
        this.$set(this.tags, index, '');
      }
    },
    submitEvaluate() {
      if(this.isSubmit == '1') {
        this.isSubmit = '0';
        axios.post(API.SubmitEvaluation, qs.stringify({
          Token: this.Token,
          OrderCode: this.orderCode,
          StarLevel: this.star,
          Content: this.content,
          EvaluatedTag: this.evaluatedTag,
        }), {
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          this.isSubmit = '1';
          if (res.data.Meta.ErrorCode === '0') {
            this.$emit('evaluate-finish', res.data.Meta);
          } else {
            this.alert(res.data.Meta.ErrorMsg, 2000);
          }
        }).catch(err => {
          this.isSubmit = '1';
          this.alert(this.$store.state.IS_DEBUG === '0' ? this.ALERT_MSG.NET_ERROR : err.message);
        });
      }
    },
  },
  computed: {
    ...mapState(['Token', 'ALERT_MSG']),
    evaluatedTag() {
      if(this.tags.length == 0) {
        return '';
      } else {
        var str = '';
        this.tags.map((value, index) => {
          if(value != '') {
            str += value + ',';
          }
        });
        str = str.slice(0, str.length - 1);
        return str;
      }
    }
  },
  watch: {
    orderCode(newValue, oldValue) {
      if (newValue !== oldValue) {
        // 如果两次订单code不一致，清空上一次选择的内容
        this.init();
        this.lastOrderCode = this.orderCode;
        this.getStarLevel();
      }
    },
  },
}
</script>

<style scoped lang="scss">
.m-evaluate
{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  .wrapper
  {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
  }
  .evaluate-container
  {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: 1.333333rem;
    background-color: #fff;
    .container-title
    {
      position: relative;
      line-height: 100%;
      padding: 0.413333rem 0;
      color: #333639;
      font-size: 16px;
      text-align: center;
      .btn-close
      {
        position: absolute;
        left: 0.3rem;
        top: 0.3rem;
        width: 0.333333rem;
      }
    }
    .container-main
    {
      margin-top: 1rem;
      .main-stars
      {
        margin: 0 auto;
        text-align: center;
        .star
        {
          width: 0.8rem;
        }
      }
      .main-star-txt
      {
        margin-top: 0.426667rem;
        color: #f56165;
        text-align: center;
      }
      .main-tips
      {
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
        width: 5.44rem;
        margin: 0.786667rem auto 0;
        .tips-item
        {
          display: block;
          width: 2.613333rem;
          height: 0.8rem;
          line-height: 0.8rem;
          margin: 0.106667rem 0;
          border: 1px solid #fff;
          border-radius: 2px;
          color: #b1b1b1;
          font-size: 14px;
          text-align: center;
          &.active
          {
            border-color: #f56165;
            color: #f56165;
          }
        }
      }
      .main-input
      {
        position: relative;
        width: 8.666667rem;
        height: 1.6rem;
        margin: 0.32rem auto 0;
        .textarea
        {
          box-sizing: border-box;
          display: block;
          width: 100%;
          height: 100%;
          padding: 0.306667rem 0.333333rem;
          border: 1px solid #e7ebee;
          outline: none;
          border-radius: 4px;
          background-color: #f7f9fa;
          color: #ccc;
          resize: none;
        }
        .text-limit
        {
          position: absolute;
          bottom: 0.346667rem;
          right: 0.346667rem;
          color: #ccc;
        }
      }
    }
    .btn-submit
    {
      display: block;
      width: 8.666667rem;
      height: 1.146667rem;
      line-height: 1.146667rem;
      margin: 0.533333rem auto 0.4rem;
      border-radius: 4px;
      background-color: #f56165;
      color: #fff;
      font-size: 16px;
      text-align:center;
      &.disable
      {
        opacity: 0.8;
        pointer-events: none;
      }
    }
  }
}
</style>