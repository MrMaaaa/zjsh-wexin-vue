<template>
<div class="m-evaluate">
  <div class="wrapper" @click="close"></div>

  <div class="evaluate-container">
    <header class="container-title">评价本次服务<img class="btn-close" @click="close" src="../assets/images/close2.png"></header>

    <p class="container-desc txt-over-hide">{{ options.PopTitle }}</p>

    <div class="container-main">
      <div class="main-stars">
        <span @click="switchStar(1)">
          <img class="star" src="../assets/images/star.png">
        </span>
        <span @click="switchStar(2)">
          <img class="star" v-if="star >= 2" src="../assets/images/star.png">
          <img class="star" v-else src="../assets/images/star_empty.png">
        </span>
        <span @click="switchStar(3)">
          <img class="star" v-if="star >= 3" src="../assets/images/star.png">
          <img class="star" v-else src="../assets/images/star_empty.png">
        </span>
        <span @click="switchStar(4)">
          <img class="star" v-if="star >= 4" src="../assets/images/star.png">
          <img class="star" v-else src="../assets/images/star_empty.png">
        </span>
        <span @click="switchStar(5)">
          <img class="star" v-if="star >= 5" src="../assets/images/star.png">
          <img class="star" v-else src="../assets/images/star_empty.png">
        </span>
      </div>

      <div class="main-star-txt" v-if="starLevelInfos.length > 0">{{ starLevelInfos[star - 1].Description }}</div>

      <div class="main-tips flex-row" v-if="starLevelInfos.length > 0">
        <span class="tips-item" :class="{ active: tags[index] && tags[index] != '' }" @click="addTag(item, index)" v-for="(item, index) in starLevelInfos[star - 1].Labels">{{ item }}</span>
      </div>

      <div class="main-input">
        <textarea maxlength="40" v-model="content" class="textarea" placeholder="其他想说的（将匿名并延迟告诉师傅）"></textarea>
        <span class="text-limit">{{ 40 - Number(content.length) }}</span>
      </div>
    </div>

    <a class="btn-submit" :class="{ disable: !isSubmit }" @click="submitEvaluate">匿名提交</a>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'm-dialog-evaluate',
  data () {
    return {
      star: 5,
      content: '',
      tags: [], // 用来保存选中了哪些标签
      starLevelInfos: []
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          PopType: '2',
          OrderId: '',
          OrderCode: '',
          PopTitle: '',
          PopDescription: '',
          ServiceTypeId: ''
        }
      }
    }
  },
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
    close() {
      let opt = this.options;
      opt.PopType = '';
      this.$emit('update:options', opt);
    },
    getStarLevel() {
      this.$loading.open();
      this.$store.dispatch('GetStarLevel', {
          ServiceTypeId: this.options.ServiceTypeId
        })
        .then(res => {
          this.$loading.close();
          this.starLevelInfos = res.StarLevelLabelInfos;
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
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
      if(this.isSubmit) {
        this.$loading.open();
        this.$store.dispatch('SubmitEvaluation', {
          OrderCode: this.options.OrderCode,
          StarLevel: this.star,
          Content: this.content,
          EvaluatedTag: this.evaluatedTag
        })
        .then(res => {
          this.$loading.close();
          this.$alert('评价成功');
          this.close();
          this.$emit('complete', res);
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
      }
    },
  },
  computed: {
    ...mapState(['ALERT_MSG']),
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
    },
    isSubmit() {
      return this.evaluatedTag === '' ? false : true;
    }
  }
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
    .container-desc
    {
      padding: 0 0.4rem;
      color: #b1b1b1;
      font-size: 15px;
      text-align: center;
    }
    .container-main
    {
      margin-top: 0.4rem;
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
      transition: all .3s;
      &.disable
      {
        opacity: 0.8;
        pointer-events: none;
        transition: all .3s;
      }
    }
  }
}
</style>