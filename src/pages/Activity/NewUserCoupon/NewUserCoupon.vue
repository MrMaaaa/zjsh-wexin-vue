<template>
<div>
  <header id="header">
    <img class="header-img" src="../../../../assets/static/images/hbfx_bg2.jpg">
  </header>

  <div id="container">
    <div class="coupon" v-if="isShowUserStatus === '0'">
      <header class="title-coupon">188</header>

      <input class="phone" v-model="phoneNumber" type="tel" maxlength="11" placeholder="请输入手机号">

      <div class="user-captcha flex-row" v-show="isChecked">
        <input class="captcha" v-model="captcha" type="tel" ref="inputCaptcha" maxlength="4" placeholder="请输入验证码">

        <button class="btn-captcha" :class=" { disable: !isAllowedSendCaptcha }" type="button" @click="sendCaptcha">{{ captchaBtnText }}</button>
      </div>

      <button class="btn-coupon" type="button" v-show="!isChecked" @click="checkUser">立即领取</button>
      <button class="btn-coupon" type="button" v-show="isChecked" @click="drawCoupon">立即领取</button>
    </div>

    <div class="info" :class="{ old: isNewUser === '0' }" v-if="isShowUserStatus === '1'">
      <div class="info-title"><img class="title-line" src="../../../assets/images/hbfx_bg6.png"><span class="txt" v-if="isNewUser === '0'">您已经是助家生活的老朋友啦</span><span class="txt" v-if="isNewUser === '1'">恭喜你领取了</span><img class="title-line" src="../../../assets/images/hbfx_bg7.png"></div>

      <div class="info-content old" v-if="isNewUser === '0'">仅限新用户参与</div>
      <div class="info-content new" v-if="isNewUser === '1'">￥<span class="coupon-price">188</span></div>
      <router-link class="btn-coupon" :to="{ name: 'index' }">{{ isNewUser === '0' ? '回到首页' : '立即使用' }}</router-link>
    </div>

    <div class="coupons" v-if="couponList.length > 0">
      <div class="title">你可以使用以下红包下单</div>

      <ul class="coupon-lists">
        <li class="coupon-item flex-row" v-for="item in couponList">
          <div class="left">
            <div class="coupon-price">￥<strong>{{ item.Price }}</strong></div>

            <div class="coupon-limit" v-if="item.Limit != '0'">满{{ item.Limit }}元可用</div>
            <div class="coupon-limit" v-else>通用券，无门槛</div>
          </div>

          <div class="right flex-row" @click="useCoupon(item)">
            <div class="coupon-info">
              <span class="coupon-range txt-over-hide">{{ item.Range }}</span><span class="coupon-vali-time txt-hide">有效期至{{ item.EndTime | formatDate }}</span>
            </div>

            <div class="coupon-use flex-row">
              <span class="txt">立即使用</span>
              <img class="icon-link" src="../../../assets/images/link.png">
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
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'new_user_coupon',
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
      timer: null,
      couponList: [],
    }
  },
  methods: {
    checkUser() {
      if(this.checkPhoneNumber()) {
        this.$loading.open(2);
        this.$store.dispatch('CheckClientUser', {
          PhoneNumber: this.phoneNumber
        })
        .then(res => {
          this.$loading.close();
          if (res.IsNewUser === '0') {
            //老用户
            this.isNewUser = '0';
          } else {
            //新用户
            this.isNewUser = '1';
          }
          this.isChecked = true;
          this.isAllowedSendCaptcha = true;
          this.sendCaptcha();
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
      }
    },
    drawCoupon() {
      if (this.checkPhoneNumber()) {
        if (this.captcha == '') {
          this.$alert(this.ALERT_MSG.CAPTCHA_EMPTY);
        } else {
          if(this.isNewUser === '0') {
            // 老用户直接登录
            this.$loading.open(2);
            this.$store.dispatch('QuickLogin', {
              LoginName: this.phoneNumber,
              Captcha: this.captcha,
            })
            .then(res => {
              this.$loading.close();
              this.isShowUserStatus = '1';
            })
            .catch(err => {
              this.$loading.close();
              this.$alert(err.message || err.ErrorMsg);
            });
          } else if (this.isDrawCoupon) {
            this.isDrawCoupon = false;
            this.$loading.open(2);
            this.$store.dispatch('NewUserReceiveRedCoups', {
                PhoneNumber: this.phoneNumber,
                Captcha: this.captcha
              })
              .then(res => {
                this.$loading.close();
                this.isShowUserStatus = '1';
                window._vds.push(['setCS1', 'user_id', res.CouponList[0].UserId]);
                this.$store.commit('SetToken', res.Token);
                this.$store.commit('SetUserId', res.CouponList[0].UserId);
                this.$store.commit('SetIsLogin', '1');

                // 显示红包
                res.CouponList.map((val, index, arr) => {
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
              })
              .catch(err => {
                this.$loading.close();
                this.isDrawCoupon = true;
                this.$alert(err.message || err.ErrorMsg);
              });
          }
        }
      }
    },
    sendCaptcha() {
      if(this.checkPhoneNumber()) {
        //发送验证码
        if(this.isAllowedSendCaptcha) {
          this.$loading.open(2);
          this.$store.dispatch('SendCaptcha', {
              Phone: this.phoneNumber,
              Type: this.isNewUser === '0' ? '4' : '1'
            })
            .then(res => {
              this.$loading.close();
              this.isAllowedSendCaptcha = false;
              this.$alert('验证码发送成功');
              this.$refs.inputCaptcha.focus();
              let count = 60;
              this.captchaBtnText = count + 's';
              window.clearInterval(this.timer);
              this.timer = window.setInterval(() => {
                count -= 1;
                this.captchaBtnText = count + 's';
                if (count <= 0) {
                  window.clearInterval(this.timer);
                  this.captchaBtnText = '重新获取';
                  this.isAllowedSendCaptcha = true;
                }
              }, 1000);
            })
            .catch(err => {
              this.$loading.close();
              this.$alert(err.message || err.ErrorMsg);
            });
        }
      }
    },
    getOldUserCouponList() {
      this.$store.dispatch('OldUserReceiveRedCoups', {
          PhoneNumber: this.phoneNumber
        })
        .then(res => {
          res.CouponList.map(val => {
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
            }
          });
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    checkPhoneNumber() {
      if(this.phoneNumber == '') {
        this.$alert(this.ALERT_MSG.PHONE_EMPTY);
        return false;
      } else if(!this.isPhoneNumber) {
        this.$alert(this.ALERT_MSG.PHONE_ERROR);
        return false;
      } else {
        return true;
      }
    },
    useCoupon(item) {
      if (item.couponTypeByVue == '0') {
        if (item.ServiceItem) {
          this.$router.push({
            name: 'service_detail',
            query: {
              id: item.ServiceItem.ServiceId,
            },
            params: {
              id: item.ServiceItem.ServiceId,
              url: item.ServiceItem.DetailUrl,
              img: item.ServiceItem.LogoUrl ? item.ServiceItem.LogoUrl[0] : '',
            }
          });
        } else {
          this.$router.push({
            name: 'index'
          });
        }
      }
    },
  },
  computed: {
    ...mapState(['ALERT_MSG']),
    isPhoneNumber() {
      //判断手机号是否正确
      return /^1[345789]\d{9}$/.test(this.phoneNumber);
    }
  },
  filters: {
    formatDate(val) {
      let date = new Date(parseInt(val + '000'));
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    },
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
  line-height: 1.2rem;
  margin: 0.48rem auto 0;
  padding-left: 0.44rem;
  border: none;
  border-radius: 4px;
  outline: none;

  background-color: #f33;
  color: #fff;
  text-align: center;
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
