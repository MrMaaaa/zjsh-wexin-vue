import Vue from 'vue';
import Vuex from 'vuex';
import Common from '../config/Common';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zjsh_version: '3.5.0',

    AppName: '助家生活', // 当前web app的名称

    IS_DEBUG: '1', // 是否开启debug模式，该模式下会显示正常报错（而不是“网络错误”），其他功能待添加

    // 是否在微信浏览器环境下
    IsWxBrowser: '0',

    // 这个字符串中的路由的name不会被拦截器拦截
    interceptorsExceptList: 'user index service_detail new_user_coupon express errand user_about user_connect_us',

    Token: '',
    UserId: '',
    OpenId: '',// 微信用户标识
    PhoneNumber: '',

    // 是否登录，该属性会在登陆成功后、接口未返回2004时设为1，主动登出设为0
    IsLogin: '0',

    // 是否弹出登录窗口
    IsOpenLogin: '0',

    // 详情页url，避免后退导致详情页无法加载
    DetailUrlForDetailPage: '',

    // 获取默认地址，默认为上一次下单地址（未生效）
    // 目前获取第一条地址即可，因此该参数暂时无效
    DefaultAddressId: '',

    ThreeServiceId: '', // 详情页跳转下单页对应服务三级id
    ThreeServiceName: '', // 详情页跳转下单页对应服务三级name
    OrderIdForPay: '', // 支付页面的订单id
    OrderInfo: { // 下单页提交订单信息
      FourServiceId: '', // 四级服务id
      Amount: '', // 服务数量
      Price: '', // 服务单价
      SellType: '', // 1:定价类型 2:面议类型
      SpecialType: '0',
      OrderFrom: '210', // 订单来源 0:android 1:ios 210:微信
      ServiceContent: '', // 备注
      DateTime: '', // 订单预约时间
      IsClaims: '1', // 是否使用1元保险
      Address: {
        Id: '', // 服务地址id
      },
      // 被选中的红包信息
      CouponSelected: {
        NoUse: '1',
      },
    },

    // 地址增加&修改时的地址信息
    AddressAddedInfo: {
      Id: '',
      Contact: '',
      Gender: '',
      PhoneNumber: '',
      Address1: '',
      Address1Lng: '',
      Address1Lat: '',
      Address2: '',
      Tag: ''
    },

    // 错误&提示信息
    ALERT_MSG: {
      NET_ERROR: '网络连接异常，请检查您的网络',
      SEND_CAPTCHA: '验证码发送成功，请注意查收',
      PAY_SUCESS: '支付成功',
      PAY_ERROR: '支付失败',
      ADDRESS_ERROR: {
        NAME_EMPTY: '请填写您的姓名',
        SEX_EMPTY: '请选择您的性别',
        PHONE_EMPTY: '请填写你的手机号',
        PHONE_ERROR: '请填写正确的手机号',
        ADDRESS_EMPTY: '请填写您的详细地址',
      },
      USER_COUPON_NO_LOGIN: '登录后，才能看到红包情况',
    },

    // 如何使用下面的两个过滤列表：ThreeServiceIdFilterList.indexOf(' ' + id + ' ')
    // 注意：必须加上id前后的空格才能保证正确判断
    ThreeServiceIdFilterList: ' 2 3 4 12 13 15 ', // 首页对应的三级服务id
    FourServiceIdFilterList: ' 5 733 734 735 316 317 297 298 299 300 301 302 307 308 815 814 642 643 644 162 26 137 156 ', // 首页对应的四级服务id

    // 全局弹框配置
    AlertMsg: '', // 弹出信息
    AlertTimeout: '1000', // 弹框持续时间
    AlertStatus: '0', // 弹框状态：0:隐藏，1:显示
  },
  mutations: {
    SetIsWxBrowser(state, data) {
      return state.IsWxBrowser = data;
    },
    SetAppName(state, data) {
      return state.AppName = data;
    },
    // SetAPI(state, data) {
    //   let api = '';
    //   if(data === '0') {
    //     api = 'http://192.168.1.191:3001/';
    //   } else if(data === '1') {
    //     api = 'http://copen.homepaas.com/';
    //   } else if(data === '2') {
    //     api = 'https://copen.zhujiash.com/';
    //   } else if(data === '3') {
    //     api = 'http://copen.zhujiash.com/';
    //   }
    //   return state.API = api;
    // },
    SetToken(state, data = '') {
      Common.setCookie('ZJSH_WX_Token', data, 30, '/');
      return state.Token = data;
    },
    SetUserId(state, data = '') {
      Common.setCookie('ZJSH_WX_UserId', data, 30, '/');
      return state.UserId = data;
    },
    SetOpenId(state, data = '') {
      Common.setCookie('ZJSH_WX_OpenId', data, 1, '/');
      return state.OpenId = data;
    },
    SetDefaultAddressId(state, data = '') {
      Common.setCookie('ZJSH_WX_DefaultAddressId', data, 30, '/');
      return state.DefaultAddressId = data;
    },
    SetPhoneNumber(state, data = '') {
      return state.PhoneNumber = data;
    },
    SetIsLogin(state, data = '') {
      return state.IsLogin = data;
    },
    SetIsOpenLogin(state, data = '') {
      return state.IsOpenLogin = data;
    },
    SetDetailUrlForDetailPage(state, data = '') {
      return state.DetailUrlForDetailPage = data;
    },
    SetThreeServiceId(state, data = '') {
      Common.setCookie('ZJSH_WX_ThreeServiceId', data, 1, '/');
      return state.ThreeServiceId = data;
    },
    SetThreeServiceName(state, data = '') {
      Common.setCookie('ZJSH_WX_ThreeServiceName', encodeURIComponent(data), 1, '/');
      return state.ThreeServiceName = data;
    },
    SetOrderIdForPay(state, data = '') {
      Common.setCookie('ZJSH_WX_OrderIdForPay', data, 1, '/');
      return state.OrderIdForPay = data;
    },
    SetOrderInfo(state, data) {
      Common.setCookie('ZJSH_WX_OrderInfo', encodeURIComponent(JSON.stringify(data)), 30, '/');
      return state.OrderInfo = data;
    },
    SetAddressAddedInfo(state, data) {
      return state.AddressAddedInfo = data;
    },
    SetCouponList(state, data) {
      return state.CouponList = data;
    },
  },
  actions: {
    SetAlert(context, data) {
      context.state.AlertMsg = data.alertMsg;
      context.state.AlertTimeout = Number(data.alertTimeout);
      context.state.AlertStatus = '1';
      setTimeout(() => {
        context.state.AlertStatus = '0';
      }, context.state.AlertTimeout);
    }
  }
});