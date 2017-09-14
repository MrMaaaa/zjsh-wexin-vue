<template>
<div>
  <header id="header">
    <img class="header-img" src="../../../../assets/static/images/hbfx_bg2.jpg">
  </header>

  <div id="container">
    <div class="coupon" v-if="isShowUserStatus === '0'">
      <header class="title-coupon">188</header>

      <input class="phone" v-model="phoneNumber" type="number" maxlength="11" placeholder="请输入手机号">

      <div class="user-captcha flex-row" v-show="isChecked">
        <input class="captcha" v-model="captcha" type="number" ref="inputCaptcha" maxlength="4" placeholder="请输入验证码">

        <button class="btn-captcha" type="button" ref="btnSendCaptcha" @click="sendCaptcha">{{ captchaBtnText }}</button>
      </div>

      <button class="btn-coupon" type="button" v-show="!isChecked" @click="checkUser">立即领取</button>
      <button class="btn-coupon" type="button" v-show="isChecked" @click="drawCoupon">立即领取</button>
    </div>

    <div class="info" :class="{ old: isNewUser === '0' }" v-if="isShowUserStatus === '1'">
      <div class="info-title"><img class="title-line" src="../../../assets/images/hbfx_bg6.png"><span class="txt" v-if="isNewUser === '0'">您已经是助家生活的老朋友啦</span><span class="txt" v-if="isNewUser === '1'">恭喜你领取了</span><img class="title-line" src="../../../assets/images/hbfx_bg7.png"></div>

      <div class="info-content old" v-if="isNewUser === '0'">仅限新用户参与</div>
      <div class="info-content new" v-if="isNewUser === '1'">￥<span class="coupon-price">188</span></div>
      <button class="btn-coupon" type="button" v-if="isNewUser === '0'" @click="$router.go(-1)">回到首页</button>
      <button class="btn-coupon" type="button" v-if="isNewUser === '1'" @click="$router.go(-1)">立即使用</button>
    </div>

    <div class="coupons" v-if="couponList.length > 0">
      <div class="title">你可以使用以下红包下单</div>

      <ul class="coupon-lists">
        <li class="coupon-item flex-row" v-for="item in couponList">
          <div class="left">
            <div class="coupon-price">￥<strong>{{ item.Price }}</strong></div>

            <div class="coupon-limit" v-show="item.Limit != '0'">满{{ item.Limit }}元可用</div>
            <div class="coupon-limit" v-show="item.Limit == '0'">通用券，无门槛</div>
          </div>

          <div class="right flex-row">
            <div class="coupon-info">
              <span class="coupon-range txt-over-hide">{{ item.Range }}</span><span class="coupon-vali-time txt-hide">有效期至{{ item.EndTime | formatDate }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="rule">
      <header class="rule-title">活动规则</header>

      <div class="rule-content">
        <p class="content-line">1.新用户红包可参加其他优惠叠加</p>
        <p class="content-line">2.红包仅限在助家生活最新版客户端使用且选择在线支付时使用</p>
        <p class="content-line">3.使用红包时下单手机号必须为抢红包时手机号</p>
        <p class="content-line">4.如有其它疑问请咨询助家生活客服</p>
      </div>
    </div>

    <m-loading bg-style="0" v-show="isLoading"></m-loading>
  </div>
</div>
</template>

<script>
import MLoading from '../../Plugs/m-loading';
import API from '../../../config/backend';
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'main',
  data() {
    return {
      phoneNumber: '',
      isShowUserStatus: '0', // 该值为1表示显示用户是否满足条件，并隐藏输入手机号的窗口
      isNewUser: '0', // 是否是新用户
      isAllowedSendCaptcha: false,// 是否允许发送验证码，倒计时结束将变化
      captcha: '',// 用户输入的验证码
      captchaBtnText: '',
      isChecked: false,// 是否已经检查过用户类型，true将显示验证码并切换按钮为领取红包
      isDrawCoupon: true,// 是否可以点击领取红包按钮，防止多次点击
      isWarn: false,
      warnMsg: '',
      isLoading: false,
      couponList: [],
      WARN_INFO: {
        PHONE_NUMBER_EMPTY: '请输入手机号',
        PHONE_NUMBER_ERROR: '手机号输入有误，请重新输入',
        CAPTCHA_EMPTY: '请输入验证码',
        NET_ERROR: '网络连接失败，请检查网络'
      }
    }
  },
  methods: {
    checkUser() {
      // 同时判断isWarn是为了防止多次点击
      if(this.checkPhoneNumber()) {
        if(!this.isWarn) {
          this.isLoading = true;
          axios.post(API.CheckClientUser, qs.stringify({
            "PhoneNumber": this.phoneNumber
          })).then(res => {
            this.isLoading = false;
            if (res.data.Meta.ErrorCode == '0') {
              // 无论新老用户均弹出验证码
              if (res.data.Body.IsNewUser == '0') {
                //老用户显示
                this.isNewUser = '0';
                this.isChecked = true;
                this.isAllowedSendCaptcha = true;
                this.sendCaptcha('4');
              } else {
                //新用户弹出注册页面
                this.isNewUser = '1';
                this.isChecked = true;
                this.isAllowedSendCaptcha = true;
                this.sendCaptcha('1');
              }
            } else {
              this.alert(res.data.Meta.ErrorMsg);
            }
          }).catch(err => {
            this.isLoading = false;
            this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
          });
        }
      } else {
        this.alert(this.warnMsg);
      }
    },
    drawCoupon() {
      if (this.checkPhoneNumber()) {
        if (this.captcha == '') {
          this.alert(this.WARN_INFO.CAPTCHA_EMPTY);
        } else {
          if(this.isNewUser == '0') {
            // 老用户直接登录
            this.isLoading = true;
            axios.post(API.QuickLogin, qs.stringify({
              "LoginName": this.phoneNumber,
              "Captcha": this.captcha,
            })).then((res) => {
              this.isLoading = false;
              if (res.data.Meta.ErrorCode === '0') {
                this.isShowUserStatus = '1';
                window._vds.push(['setCS1', 'user_id', res.data.Body.UserId]);
                this.$store.commit('SetToken', res.data.Body.Token);
                this.$store.commit('SetUserId', res.data.Body.UserId);
                this.$store.commit('SetIsLogin', '1');
              } else {
                this.alert(res.data.Meta.ErrorMsg);
              }
            }).catch((error) => {
              this.isLoading = false;
              this.alert(this.ALERT_MSG.NET_ERROR);
            });
          } else if (this.isDrawCoupon) {
            this.isLoading = true;
            this.isDrawCoupon = false;
            axios.post(API.NewUserReceiveRedCoups, qs.stringify({
              "PhoneNumber": this.phoneNumber,
              "Password": '_fjw89odAAB_',
              "Captcha": this.captcha,
              "DeviceId": ""
            })).then((res) => {
              this.isLoading = false;
              this.isDrawCoupon = true;
              //如果成功发送验证码
              if (res.data.Meta.ErrorCode == '0') {
                // 登录
                this.isShowUserStatus = '1';
                window._vds.push(['setCS1', 'user_id', res.data.Body.CouponList[0].UserId]);
                this.$store.commit('SetToken', res.data.Body.Token);
                this.$store.commit('SetUserId', res.data.Body.CouponList[0].UserId);
                this.$store.commit('SetIsLogin', '1');

                // 显示红包
                res.data.Body.CouponList.map((val, index, arr) => {
                  let range = '所有服务通用';
                  if (val.ServiceTypes.length > 0) {
                    range = '限';
                    val.ServiceTypes.map((val, index, arr) => {
                      range += '“' + val.ServiceName + '”';
                      if (index < arr.length - 1) {
                        range += '、';
                      }
                    });
                    range += '服务';
                  }
                  let availableTime = Math.floor((parseInt(val.EndTime + '000') - new Date().getTime()) / 1000 / 60 / 60 / 24);
                  this.couponList.push({
                    Price: val.CouponDetails[0].DiscountAmount,
                    Limit: val.CouponDetails[0].Amount,
                    Range: range,
                    AvaiTime: availableTime,
                    StartTime: val.StartTime,
                    CreateTime: val.CreateTime,
                    EndTime: val.EndTime,
                    ServiceItem: val.ServiceItem,
                    Id: val.Id,
                    UserId: val.UserId
                  });
                });
              } else {
                this.alert(res.data.Meta.ErrorMsg);
              }
            }).catch((err) => {
              this.isLoading = false;
              this.isDrawCoupon = true;
              this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
            });
          }
        }
      } else {
        this.alert(this.warnMsg);
      }
    },
    sendCaptcha(type) {
      if(this.checkPhoneNumber()) {
        //发送验证码
        if(this.isAllowedSendCaptcha) {
          this.isLoading = true;
          axios.post(API.SendCaptcha, qs.stringify({
            "Phone": this.phoneNumber,
            "Type": type
          })).then(res => {
            this.isLoading = false;
            //如果成功发送验证码
            if (res.data.Meta.ErrorCode == '0') {
              var that = this;
              this.isAllowedSendCaptcha = false;
              this.$refs.btnSendCaptcha.classList.toggle('disable', true);
              this.alert(res.data.Meta.ErrorMsg);
              this.$refs.inputCaptcha.focus();
              let count = 60;
              that.captchaBtnText = count + 's';
              let timer = setInterval(function() {
                count -= 1;
                that.captchaBtnText = count + 's';
                if (count == 0) {
                  clearInterval(timer);
                  that.captchaBtnText = '重新获取';
                  that.isAllowedSendCaptcha = true;
                  that.$refs.btnSendCaptcha.classList.toggle('disable', false);
                }
              }, 1000);
            } else {
              this.alert(res.data.Meta.ErrorMsg);
            }
          }).catch((err) => {
            this.isLoading = false;
            this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
          });
        }
      } else {
        this.alert(this.warnMsg);
      }
    },
    getOldUserCouponList() {
      axios.post(API.OldUserReceiveRedCoups, qs.stringify({
        "PhoneNumber": this.phoneNumber
      })).then(res => {
        if (res.data.Meta.ErrorCode == '0') {
          let that = this;
          res.data.Body.CouponList.map(val => {
            let range = '所有服务通用';
            if (val.ServiceTypes.length > 0) {
              range = '限';
              val.ServiceTypes.map((val, index, arr) => {
                range += '“' + val.ServiceName + '”';
                if (index < arr.length - 1) {
                  range += '、';
                }
              });
              range += '服务';
            }
            let availableTime = Math.floor((parseInt(val.EndTime + '000') - new Date().getTime()) / 1000 / 60 / 60 / 24);
            if (availableTime > 0) {
              that.couponList.push({
                Price: val.CouponDetails[0].DiscountAmount,
                Limit: val.CouponDetails[0].Amount,
                Range: range,
                AvaiTime: availableTime,
                StartTime: val.StartTime,
                CreateTime: val.CreateTime,
                EndTime: val.EndTime,
                ServiceItem: val.ServiceItem,
                Id: val.Id,
                UserId: val.UserId
              });
            }
          });
        } else {
          this.alert(res.data.Meta.ErrorMsg);
        }
      }).catch(err => {
        this.alert(this.$store.state.IS_DEBUG === '0' ? this.WARN_INFO.NET_ERROR : err.message);
      });
    },
    checkPhoneNumber() {
      if(this.phoneNumber == '') {
        this.warnMsg = this.WARN_INFO.PHONE_NUMBER_EMPTY;
        return false;
      } else if(!this.isPhoneNumber) {
        this.warnMsg = this.WARN_INFO.PHONE_NUMBER_ERROR;
        return false;
      } else {
        return true;
      }
    },
  },
  computed: {
    isPhoneNumber() {
      //判断手机号是否正确
      return /^1[34578]\d{9}$/.test(this.phoneNumber);
    }
  },
  components: {
    MLoading,
  },
  filters: {
    formatDate(val) {
      let date = new Date(parseInt(val + '000'));
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    },
  },
  watch: {
    isWarn(new_value, old_value) {
      //当warn-info弹出时在1s后关闭
      var that = this;
      if(new_value) {
        setTimeout(function() {
          that.isWarn = false;
        }, 1000);
      }
    }
  },
}
</script>

<style scoped>
.router-view
{
  background-color: #f8d909;
}
#header
{
  width: 100%;
}
#header .header-img
{
  display: block;
  width: 100%;
}
#container
{
  padding-bottom: 1.506667rem;

  background-color: #f8d909;
}
#container .coupon
{
  margin: 0 0.733333rem;
  padding-top: 1.333333rem;
  padding-bottom: 0.4rem;

  background-image: url(../../../assets/images/hbfx_bg2.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
#container .coupon .title-coupon
{
  display: block;
  position: relative;

  height: 1.733333rem;
  line-height: 1.733333rem;
  margin: 0 auto;

  color: #f33;
  font-size: 80px;
  text-align: center;
}
#container .coupon .title-coupon::after
{
  content: '';
  display: block;
  position: absolute;
  right: 1.453333rem;
  top: -0.493333rem;

  width: 0.933333rem;
  height: 0.933333rem;

  background-image: url(../../../assets/images/hbfx_yuan.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
#container .coupon .phone
{
  display: block;
  box-sizing: border-box;

  width: 8.0rem;
  height: 1.2rem;
  margin: 0.48rem auto 0;
  padding-left: 0.44rem;
  border: none;
  border-radius: 4px;
  outline: none;

  background-color: #f0f0f0;
  font-size: 16px;
}
#container .user-captcha
{
  box-sizing: border-box;

  width: 8rem;
  height: 1.2rem;
  margin: 0.48rem auto 0;
}
#container .user-captcha .captcha
{
  display: block;

  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 0 0 0.44rem;
  border: none;
  border-radius: 4px;
  outline: none;

  background-color: #f0f0f0;
  font-size: 16px;
}
#container .user-captcha .btn-captcha
{
  display: block;

  width: 2.466667rem;
  height: 100%;
  border: none;
  border-radius: 4px;
  outline: none;
  margin-left: 0.2rem;

  background-color: #f33;
  color: #fff;
  font-size: 14px;
}
#container .user-captcha .btn-captcha.disable
{
  background-color: #bdbdbd;
}
#container .btn-coupon
{
  display: block;

  width: 8.0rem;
  height: 1.2rem;
  margin: 0.48rem auto 0;
  padding-left: 0.44rem;
  border: none;
  border-radius: 4px;
  outline: none;

  background-color: #f33;
  color: #fff;
  font-size: 16px;
}
#container .info
{
  margin: 0 0.586667rem;
  padding: 0.48rem 0;
  border-radius: 10px;

  background-color: #fff;
}
#container .info.old
{
  padding-bottom: 1.133333rem;
}
#container .info-title
{
  text-align: center;
}
#container .info-title .txt
{
  line-height: 100%;
  margin: 0 0.213333rem;

  font-size: 14px;
  vertical-align: middle;
}
#container .title
{
  margin-top: 0.2rem;
  text-align: center;
  font-size: 14px;
}
#container .title-line
{
  width: 1.2rem;
  vertical-align: middle;
}
#container .info-content
{
  line-height: 100%;
  margin-top: 0.8rem;

  color: #f33;
  text-align: center;
  font-size: 30px;
}
#container .info-content.old
{
  font-size: 16px;
}
#container .info-content .coupon-price
{
  font-size: 60px;
}
#container .coupons
{
  margin-top: 0.533333rem;
}
#container .coupon-lists
{
  margin: 0.533333rem 0.586667rem 0;
}
#container .coupon-lists .title
{
  text-align: center;
  font-size: 14px;
}
#container .rule
{
  margin: 0.506667rem 0.3rem 0;
  padding-top: 0.666667rem;
  padding-bottom: 1.133333rem;

  background-image: url(../../../assets/images/hbfx_bg3.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
#container .rule .rule-title
{
  font-size: 14px;
  text-align: center;
}
#container .rule .rule-content
{
  padding-top: 0.666667rem;
  padding-left: 0.666667rem;
  padding-right: 0.533333rem;
}
#container .rule .rule-content .content-line
{
  line-height: 0.6rem;

  font-size: 14px;
}
.coupon-item
{
  height: 2.133333rem;
  margin-top: 0.2rem;

  background-image: url(../../../assets/images/hbfx_bg4.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.coupon-item .left
{
  width: 2.866667rem;
  height: 100%;

  text-align: center;
  color: #f33;
}
.coupon-item .left .coupon-price
{
  line-height: 100%;
  margin-top: 0.426667rem;

  font-size: 24px;
}
.coupon-item .left .coupon-price strong
{
  font-size: 36px;
}
.coupon-item .left .coupon-limit
{
  line-height: 100%;
  margin-top: 0.2rem;
}
.coupon-item .right
{
  width: 5.933333rem;
  height: 100%;
}
.coupon-item .right .coupon-info
{
  box-sizing: border-box;

  width: 4.2rem;
  height: 100%;
  padding-left: 1rem;
}
.coupon-item .right .coupon-info .coupon-range
{
  display: block;
  width: 3.7rem;

  line-height: 100%;
  margin-top: 0.6rem;

  color: #666;
}
.coupon-item .right .coupon-info .coupon-vali-time
{
  display: block;
  width: 3.7rem;

  line-height: 100%;
  margin-top: 0.266667rem;

  color: #999;
}
.coupon-item .right .coupon-use
{
  width: 1.6rem;
  height: 100%;
}
.coupon-item .right .coupon-use .txt
{
  width: 1rem;

  color: #666;
  font-size: 14px;
}
.coupon-item .right .coupon-use .icon-link
{
  width: 0.2rem;
  height: 0.333333rem;
  margin-right: 0.293333rem;
}
</style>
