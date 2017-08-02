<template>
  <section>
    <header class="header-img">
        <img :src="pageData.headImg">
    </header>

    <div class="container">
        <table class="price-table" cellpadding="0" cellspacing="0">
          <thead id="header_table">
            <tr>
              <td>类型</td>
              <td>订金</td>
              <td>价格</td>
            </tr>
          </thead>

          <tbody id="content_table">
            <tr v-for="item in serviceList">
              <td>{{ item.ServiceName }}</td>
              <td>{{ item.DepositAmount | clearDeposit }}</td>
              <td>{{ item.Price }}元</td>
            </tr>
          </tbody>
        </table>
    </div>

    <div class="region" v-if="pageData.standard">
        <div class="region-title">服务标准</div>
        <p v-if="typeof pageData.standard == 'string'">{{ pageData.standard }}</p>
        <p v-else>
          <span v-for="item in pageData.standard">{{ item }}</span>
        </p>
    </div>

    <div class="section section-no-mt" v-if="pageData.introduce">
        <div class="section-header">
          <span class="header-title">服务介绍</span>
        </div>

        <div class="section-intro">
          <span class="intro-txt">{{ pageData.introduce.title }}</span>

          <img class="intro-img intro-img-br" :src="pageData.introduce.img">
        </div>
    </div>

    <div class="section-content" v-if="pageData.range && pageData.range.length > 0" style="padding: 0 20px;">

      <div class="section-header">
          <span class="header-title">服务范围</span>
        </div>

        <div class="content-row flex-row"v-for="val in pageData.range">
            <div class="row-item" v-for="v in val">
              <img class="item-img" :src="v.img">
              <span class="item-info">{{ v.title }}</span>
            </div>
        </div>

    </div>

    <div class="section" v-if="pageData.price">
        <div class="section-header">
          <span class="header-title">服务价格</span>
        </div>

        <div class="section-intro">
          <img class="intro-img" :src="pageData.price">
        </div>
    </div>

      <div class="section" v-if="pageData.process">
        <div class="section-header">
          <span class="header-title">服务流程</span>
        </div>

        <div class="section-intro">
          <img class="intro-img" :src="pageData.process">
        </div>
    </div>

    <div class="region" v-if="pageData.warn && pageData.warn.length > 0">
        <div class="region-title">注意事项</div>

        <p>
          <span class="region-warn-txt" v-for="item in pageData.warn">{{ item }}</span>
        </p>
    </div>

    <div class="region">
        <div class="region-title">服务保障</div>

        <div class="region-content flex-row">
          <div class="content-icon">
              <img src="/assets/static/images/heart.png">
          </div>


            <div class="content-info">
              <span class="info-title">{{ pageData.assurance[0].t }}</span>

              <span class="info-intro">{{ pageData.assurance[0].c }}</span>
            </div>
        </div>

        <div class="region-content flex-row">
            <div class="content-icon">
                <img src="/assets/static/images/safe.png">
            </div>

            <div class="content-info">
                <span class="info-title">隐私保障</span>
              <span class="info-intro">服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！</span>
          </div>

      </div>
    </div>

    <div class="btn-wrapper">
       <button type="button" class="order-button btn btn-warn" @click="subumitForWx">立即预约</button>
    </div>
  </section>
</template>

<script>
import data from "../../config/detail";
import { mapState } from 'vuex';
import API from '../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: "service_detail",
  data() {
    return {
      pageData: data[this.$route.params.id],
      serviceList: [],
    }
  },
  mounted() {
    document.title = data[this.$route.params.id].title;

    axios.post(API.QueryServicePrice, qs.stringify({
      ServiceId: this.$route.params.id
    }), {
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      this.isLoading = false;
      this.txtLoading = '';
      this.bgLoading = '2';
      if (res.data.Meta.ErrorCode === '0') {
        res.data.Body.Service.SubItems.map(value => {
          this.serviceList.push(value);
        })
      } else {
        this.alert(res.data.Meta.ErrorMsg);
      }
    }).catch(error => {
      this.isLoading = false;
      this.txtLoading = '';
      this.bgLoading = '2';
      this.alert(this.ALERT_MSG.NET_ERROR);
    });
  },
  methods: {
    subumitForWx() {
      // ios下会导致iframe中的fixed元素不相对于父页面来定位，因此在详情页下方放置一个按钮用来填补缺失
      // 使用此按钮就无需在iframe中添加调用父页面方法

      // 如果已经登录才进行跳转
      if(this.IsLogin === '1') {
        this.routerTo({ name: 'order_place' }, false);
      } else {
        document.getElementById('module_login').classList.add('active');
        var WVJBIframe = document.createElement('iframe');
        document.title = '登录';
        WVJBIframe.style.display = 'none';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
          document.documentElement.removeChild(WVJBIframe)
        }, 0);
      }
    },
    routerTo(option={'name':'order_place'}, isReplace=false) {
      if (isReplace) {
        this.$router.replace(option);
      } else {
        this.$router.push(option);
      }
    },
  },
  computed: {
    ...mapState(['IsLogin', 'ALERT_MSG']),
  },
  filters: {
    clearDeposit(str) {
      return str ? str : '/';
    }
  }
}
</script>

<style scoped>
.router-view
{
  height: auto;
  padding-bottom: 75px;
  font-size: 14px;
}
html, body, p, span, input, button, ul, li,table, thead, tbody, tr, td, img
{
  margin: 0;
  padding: 0;

  outline: none;
  font-size: 14px;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
a, button
{
  star:expression_r(this.onFocus=this.blur());
}
div[style *= "fixed"],
a[style *= "fixed"],
button[style *= "fixed"],
p[style *= "fixed"],
span[style *= "fixed"]
{
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
}
img
{
  width: 100%;
}
body
{
  padding-bottom: 75px;

  background-color: #eaeff3;
}
#app
{
  width: 100%;
  height: 100%!important;
  overflow: scroll;
  background-color: #eaeff3;
}
.section
{
  margin-top: 14px;
  padding: 0 20px;
  background-color: #fff;
}
.section-header
{
  height: 20px;
  line-height: 20px;
  padding: 15px 0;

  text-align: center;
}
.section-header .header-title
{
  display: inline-block;
  position: relative;

  height: 20px;
  line-height: 20px;

  color: #333639;
  text-align: center;
}
.section-header .header-title::before,
.section-header .header-title::after
{
  content: '';

  display: block;
  position: absolute;
  top: 9px;

  width: 80px;
  height: 1px;

  background-color: #eef2f5;
  vertical-align: middle;
}
.section-header .header-title::before
{
  left: 120%;
  left: calc(100% + 14px);
}
.section-header .header-title::after
{
  right: 120%;
  right: calc(100% + 14px);
}
.section-block
{
  width: 100%;
}
.section-block img
{
  display: block;
  width: 100%;
}
.section-content
{
  box-sizing: border-box;
  /* border: 1px solid #eef2f5; */
  border-top-width: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #fff;
}
.section-content > img
{
  display: block;

  width: 100%;
}
.section-content .row-item:first-child
{
  margin-right: 15px;
}
.row-item .item-img
{
  display: block;

  width: 100%;
}
.row-item .item-info
{
  display:block;

  width: 100%;
  padding-top: 12px;
  padding-bottom: 16px;

  color: #666;
  text-align: center;
  font-size: 12px;
}

.section .header-img
{
  display: block;

  width: 100%;
  padding-bottom: 15px;
  border: none;

  background-color: #fff;
}

.header-img > p
{
  color: #666;
  text-align: center;
}

.header-img img
{
  display: block;

  width: 100%;
}

.container
{
  margin-bottom: 15px;
  padding: 0 15px;

  background-color: #fff;
  overflow: hidden;
}

.price-table
{
  width: 100%;
  margin: 15px 0;
  border: 1px solid #eaeff3;
  border-radius: 3px;

  background-color: #fff;
  table-layout: fixed;
}

.price-table td
{
  width: auto;
  padding: 6px 0;

  color: #333639;
  text-align: center;
}

.price-table thead
{
  background-color: #eaeff3;
}

.price-table tbody
{
  border-left: 1px solid #eaeff3;
  border-right: 1px solid #eaeff3;
  border-bottom: 1px solid #eaeff3;
}

.price-table tbody td:not(:first-child)
{
  border-left: 1px solid #eaeff3;
}

.price-table tbody tr:not(:first-child) td
{
  border-top: 1px solid #eaeff3;
}

.region
{
  margin-top: 15px;
  padding: 15px;

  background-color: #fff;
}
.region > p
{
  margin: 0;
  padding: 12px;
  border: 1px solid #eaeff3;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  color: #666;
  overflow: auto;
}
.region > p > span
{
  display: block;
}
.region > p .region-warn-txt
{
  display: block;
  margin: 10px 0;
}
.region > p .region-warn-txt:first-child
{
  margin-top: 0;
}
.region > p .region-warn-txt:last-child
{
  margin-bottom: 0;
}
.region-title
{
  box-sizing:border-box;

  height: 40px;
  line-height: 40px;
  padding-left: 16px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  background-color: #eaeff3;
  color: #333639;
}
.region-txt
{
  padding: 0 10px;

  color: #666;
}
.region-content
{
  position: relative;

  padding-bottom: 6px;
  border-left: 1px solid #eaeff3;
  border-right: 1px solid #eaeff3;
}
.region-content:last-child
{
  border-bottom: 1px solid #eaeff3;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.region-content .content-icon
{
  position: absolute;
  left: 20px;
  top: 35px;

  display: block;
  height: 100%;
}
.region-content .content-icon img
{
  display: block;

  width: 28px;
  height: auto;
}
.region-content .content-info
{
  padding-left: 68px;
  padding-right: 13px;

  overflow: hidden;
}
.region-content .content-info .info-title
{
  display:block;

  line-height:150%;
  margin-top: 12px;

  color: #333639;
}
.region-content .content-info .info-intro
{
  display:block;

  line-height:150%;

  color: #ccc;
}
.section .section-intro
{
  padding-bottom: 15px;
}

.btn-wrapper
{
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;
  padding: 15px 25px;
  border-top: 1px solid #eaeff3;

  background-color: #fff;
}

.btn
{
  width: 100%;
  height: 43px;
  line-height: 43px;
  border: none;
  border-radius: 6px;

  color: #fefeff;
  font-size: 14px;
  text-align: center;
}

.btn-warn
{
  background-color: #f56165;
}
</style>