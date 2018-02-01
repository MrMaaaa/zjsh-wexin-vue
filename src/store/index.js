import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import {
  read,
  write
} from '../config/utils.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    zjsh_version: '3.5.3',

    AppName: '助家生活', // 当前web app的名称 // 微信下名称为助家生活

    IS_DEBUG: '1', // 是否开启debug模式，该模式下会显示正常报错（而不是“网络错误”），其他功能待添加

    IsIos: browser.versions.iPhone || browser.versions.iPad || browser.versions.ios,
    IsAndroid: browser.versions.android,

    Token: '',
    UserId: '',
    OpenId: '', // 微信用户标识

    // 首页小红点
    Spots: {
      Index: false,
      Activity: false,
      Order: false,
      User: false
    },

    // 环信客服发送客户数据
    UserInfo: {
    },

    // 位置信息
    CurrentPosition: {
      Longitude: '',
      Latitude: ''
    },

    // 是否登录，该属性会在登陆成功后、接口未返回2004时设为1，主动登出设为0，需要注意，由于该参数需要在verifyToken接口返回数据后才会修改，因此在某些页面中该参数将未必能及时修改状态，因此不要全部依赖该参数来进行登录状态的判断
    IsLogin: '0',

    // 是否是自动跳转到登录页
    AutoToLogin: '1',

    // 下单页选择的地址
    DefaultAddressId: '',

    // 订单来源
    OrderFrom: '210',

    // 下单页提交订单信息
    OrderInfo: {
      FourServiceId: '', // 四级服务id
      Amount: '', // 服务数量
      Price: '', // 服务单价
      SellType: '', // 1:定价类型 2:面议类型
      SpecialType: '0',
      OrderFrom: '210', // 210:微信
      ServiceContent: '', // 备注
      DateTime: '', // 订单预约时间
      IsClaims: '1', // 是否使用1元保险
      Address: {
        Id: '', // 服务地址id
      },
      IsActivity: '0', // 是否是活动id
    },

    // 被选中红包信息
    CouponSelected: {
      NoUse: '1',
    },

    // 顺丰、跑腿选中的地址
    SelectedAddress: {

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

    IsLinkToLogin: true, // 是否在接口返回未登录后跳转到登录页

    // 错误&提示信息
    ALERT_MSG: {
      NET_ERROR: '网络连接异常，请检查您的网络',
      SEND_CAPTCHA: '验证码发送成功，请注意查收',
      PAY_SUCCESS: '支付成功',
      PAY_ERROR: '支付失败',
      AMOUNT_ERROR: '请输入正确的金额',
      POSITION_ERROR: '定位失败，请开启定位或检查网络',
      CAPTCHA_EMPTY: '请输入验证码',
      ADDRESS_EMPTY: '请选择服务地址',
      DEMAND_EMPTY: '请选择您的需求',
      DATETIME_EMPTY: '请选择服务时间',
      NAME_EMPTY: '请填写您的姓名',
      SEX_EMPTY: '请选择您的性别',
      PHONE_EMPTY: '请填写你的手机号',
      PHONE_ERROR: '请填写正确的手机号',
      ADDRESS2_EMPTY: '请填写您的详细地址',
      USER_COUPON_NO_LOGIN: '登录后，才能看到红包情况',
    },

    // 路由-标题映射表
    ROUTER_TO_TITLE: {
      index: '',
      activity: '活动列表',
      order: '订单列表',
      user: '我的',
      black_friday: '超级星期五',
      sf_activity: '一字不写发快递',
      qianneizhu: '钱内助',
      all_service: '全部分类',
      service_detail: '服务详情',
      recommend_more: '更多',
      order_place: '提交订单',
      order_detail: '订单详情',
      order_complaint_reason: '投诉理由',
      order_cancel_reason: '取消理由',
      order_pay_status: '支付信息',
      order_recharge_detail: '充值信息',
      order_add_pay: '增加服务',
      order_pay: '订单支付',
      order_service_time: '选择服务时间',
      order_special_demand: '选择您的需求',
      order_coupon_select: '使用红包',
      login: '登录',
      express: '顺丰速运',
      express_order_detail: '订单详情',
      errand: '同城跑腿',
      errand_order_detail: '订单详情',
      new_user_coupon: '新手红包',
      user_info_edit: '我的信息',
      user_nickname_edit: '修改昵称',
      user_about: '关于我们',
      user_connect_us: '联系我们',
      user_coupon: '我的红包',
      user_message: '消息中心',
      user_message_detail: '消息详情',
      address_list: '服务地址',
      address_add: '添加服务地址',
      address_edit: '修改服务地址',
      address_select: '选择你的位置'
    },
  },
  mutations: {
    SetIsWxBrowser(state, data) {
      return state.IsWxBrowser = data;
    },
    SetAppName(state, data = '助家生活') {
      write('ZJSH_WX_AppName', encodeURIComponent(data));
      return state.AppName = data;
    },
    SetToken(state, data = '') {
      write('ZJSH_WX_Token', data);
      return state.Token = data;
    },
    SetUserId(state, data = '') {
      write('ZJSH_WX_UserId', data);
      return state.UserId = data;
    },
    SetOpenId(state, data = '') {
      write('ZJSH_WX_OpenId', data, 1, '/');
      return state.OpenId = data;
    },
    SetSpots(state, data = {}) {
      Object.keys(data).forEach(value => {
        state.Spots[value] = data[value];
      });
      return state.Spots;
    },
    SetDefaultAddressId(state, data = '') {
      data = data + '';
      write('ZJSH_WX_DefaultAddressId', data);
      return state.DefaultAddressId = data;
    },
    SetUserInfo(state, data = {}) {
      return state.UserInfo = data;
    },
    SetCurrentPosition(state, data = '') {
      write('ZJSH_WX_Position', encodeURIComponent(JSON.stringify(data)));
      if (data && data.Longitude && data.Latitude) {
        state.CurrentPosition.Longitude = data.Longitude || '';
        state.CurrentPosition.Latitude = data.Latitude || '';
      }
      return state.CurrentPosition;
    },
    SetIsLogin(state, data = '0') {
      return state.IsLogin = data;
    },
    SetAutoToLogin(state, data = '0') {
      return state.AutoToLogin = data;
    },
    SetOrderFrom(state, data = '助家生活') {
      var orderFrom = '210';
      if (data == '助家生活') {
        orderFrom = '210';
      } else if (data == '同城家政') {
        orderFrom = '215';
      } else if (data == '快递上门') {
        orderFrom = '211';
      } else if (data == '曹操家政') {
        orderFrom = '212';
      } else if (data == '同城到家') {
        orderFrom = '213';
      }
      return state.OrderFrom = orderFrom;
    },
    SetOrderInfo(state, data) {
      return state.OrderInfo = data;
    },
    SetCouponSelected(state, data) {
      return state.CouponSelected = data;
    },
    SetSelectedAddress(state, data) {
      return state.SelectedAddress = data;
    },
    SetAddressAddedInfo(state, data) {
      return state.AddressAddedInfo = data;
    },
    SetIsLinkToLogin(state, data) {
      return state.IsLinkToLogin = !!data;
    },
    SetROUTER_TO_TITLE(state, data) {
      return state.ROUTER_TO_TITLE = data;
    },
  },
  actions
});