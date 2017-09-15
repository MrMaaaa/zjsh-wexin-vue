<template>
<div>
  <a class="icon-customer-service" onclick='easemobim.bind({configId: "e88edf52-a792-46ce-9af4-a737d4e9bd43"})'></a>
  <div class="service-detail" v-if="pageData">
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
              <td>{{ item.DepositAmount | formatDeposit }}</td>
              <td>{{ item.Price }}元/{{ item.Unit }}</td>
            </tr>
          </tbody>
        </table>
    </div>

    <div class="region" v-if="pageData.standard && pageData.standard.length > 0">
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

    <div class="section" v-for="item in pageData.custom">
      <div class="section-header">
        <span class="header-title">{{ item.title }}</span>
      </div>

      <div class="header-img">
        <p v-for="info in item.content">
          <img v-if="/\.(png|jpg)/.test(info)" :src="info">
          <span v-else>{{ info }}</span>
        </p>
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
              <img :src="imgUrl + 'heart.png'">
          </div>


            <div class="content-info">
              <span class="info-title">{{ pageData.assurance[0].t }}</span>

              <span class="info-intro">{{ pageData.assurance[0].c }}</span>
            </div>
        </div>

        <div class="region-content flex-row">
            <div class="content-icon">
                <img :src="imgUrl + 'safe.png'">
            </div>

            <div class="content-info">
                <span class="info-title">隐私保障</span>
              <span class="info-intro">服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！</span>
          </div>
      </div>
    </div>
  </div>

  <div class="btn-wrapper">
     <button type="button" class="order-button btn btn-warn" @click="subumitForWx">立即预约</button>
  </div>
</div>
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
      imgUrl: data.imgUrl,
      pageData: null,
      threeId: '',
      serviceList: [],
    }
  },
  activated() {
    let that = this;
    window.easemobim = window.easemobim || {};
    window.easemobim.config = {
      configId: 'e88edf52-a792-46ce-9af4-a737d4e9bd43',
      hideKeyboard: true,
      visitor: {
        trueName: '',
        qq: '',
        phone: this.$store.state.UserInfo.PhoneNumber,
        companyName: '',
        userNickname: this.$store.state.UserInfo.NickName,
        description: '',
        email: ''
      },
      onready: function() {
        var img = that.$route.params.img || '';
        var url = that.$route.params.url || '';
        window.easemobim.sendExt({
          ext: {
            "imageName": "abc.png",
            //custom代表自定义消息，无需修改
            "type": "custom",
            "msgtype": {
              "track": {
                "title": '我正在看',
                "price": "",
                "desc": that.pageData.title,
                "img_url": img,
                "item_url": url,
              }
            }
          }
        });
      },
    };
    // 当服务id不同时刷新数据
    let oldId = this.threeId;
    this.threeId = this.$route.query.id;
    document.title = data[this.threeId].title;
    this.pageData = data[this.threeId];
    if(oldId !== this.threeId) {
      this.serviceList.splice(0);
      this.getServicePrice();
    }
  },
  methods: {
    getServicePrice() {
      axios.post(API.QueryServicePrice, qs.stringify({
        ServiceId: this.threeId
      })).then(res => {
        this.isLoading = false;
        this.txtLoading = '';
        this.bgLoading = '2';
        this.serviceList.splice(0);
        if (res.data.Meta.ErrorCode === '0') {
          res.data.Body.Service.SubItems.map(value => {
            this.serviceList.push(value);
          })
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.isLoading = false;
        this.txtLoading = '';
        this.bgLoading = '2';
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    subumitForWx() {
      // ios下会导致iframe中的fixed元素不相对于父页面来定位，因此在详情页下方放置一个按钮用来填补缺失
      // 使用此按钮就无需在iframe中添加调用父页面方法

      // 如果已经登录才进行跳转
      if(this.IsLogin === '1') {
        this.routerTo({
          name: 'order_place',
          params: {
            fromDetailPage: '1',
          },
          query: {
            id: this.threeId,
          }
        }, false);
      } else {
        this.openLogin();
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
    formatDeposit(str) {
      return str ? str + '元' : '/';
    }
  }
}
</script>

<style scoped>
.router-view
{
  position: relative;
  box-sizing: border-box;
  font-size: 14px;
}
.service-detail
{
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 2.2rem;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.icon-customer-service
{
  position: fixed;
  top: 0.266667rem;
  right: 0.266667rem;
  z-index: 10;
  display: block;
  width: 0.533333rem;
  height: 0.533333rem;
  border: 5px solid #fff;
  border-radius: 4px;
  background-image: url(../../assets/images/customer_service.png);
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: 100%;
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
  padding: 6px;

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
.section .section-intro .intro-img
{
  width: 100%;
}

.btn-wrapper
{
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  transform: translateZ(0);

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