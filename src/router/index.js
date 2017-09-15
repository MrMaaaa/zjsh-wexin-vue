import Vue from 'vue';
import Router from 'vue-router';

import Menu from '@/components/Menu';
import Index from '@/components/Index/Index';
import Activity from '@/components/Activity/Activity';
import ServiceDetail from '@/components/Service/CommonServiceDetail';
import RecommendMoreServiceDetail from '@/components/Service/CommonRecommendMoreServiceDetail';
import ServiceExpress from '@/components/Service/ServiceExpress';
import ServiceErrand from '@/components/Service/ServiceErrand';
import ServiceExpressDetail from '@/components/Service/ServiceExpressDetail';
import ServiceErrandDetail from '@/components/Service/ServiceErrandDetail';
import NewUserCoupon from '@/components/Activity/NewUserCoupon/NewUserCoupon';
import AddressAdd from '@/components/Address/AddressAdd';
import AddressList from '@/components/Address/AddressList';
import AddressEdit from '@/components/Address/AddressEdit';
import AddressSelectInMap from '@/components/Address/AddressSelectInMap';
import Login from '@/components/Login/Login';
import About from '@/components/Index/About';
import ConnectUs from '@/components/Index/ConnectUs';
import OrderList from '@/components/Order/OrderList';
import OrderPlace from '@/components/Order/OrderPlace';
import OrderDetail from '@/components/Order/OrderDetail';
import OrderComplaintReason from '@/components/Order/OrderComplaintReason';
import OrderCancelReason from '@/components/Order/OrderCancelReason';
import OrderPayStatus from '@/components/Order/OrderPayStatus';
import OrderAddPay from '@/components/Order/OrderAddPay';
import OrderPay from '@/components/Order/OrderPay';
import OrderServiceTime from '@/components/Order/OrderServiceTime';
import OrderCouponSelect from '@/components/Order/OrderCouponSelect';
import User from '@/components/User/User';
import UserCoupon from '@/components/User/UserCoupon';
// 活动
import BlackFriday from '@/components/Activity/BlackFriday/BlackFriday';
import SFActivity from '@/components/Activity/SFActivity/SFActivity';

import store from '../store/index';

Vue.use(Router);

// console.log(store.state.AppName);

// // 路由-标题映射表
// const ROUTER_TO_TITLE = {
//   index: '助家生活',
//   activity: '活动列表',
//   order: '订单列表',
//   user: '我的信息',
//   black_friday: '‘折’就是爱',
//   sf_activity: '一字不写发快递',
//   service_detail: '服务详情',
//   recommend_more: '更多',
//   order_place: '提交订单',
//   order_detail: '订单详情',
//   order_complaint_reason: '投诉理由',
//   order_cancel_reason: '取消理由',
//   order_pay_status: '订单状态',
//   order_add_pay: '增加服务',
//   order_pay: '订单支付',
//   order_service_time: '选择服务时间',
//   order_coupon_select: '使用红包',
//   login: '登录',
//   express: '快递上门',
//   express_order_detail: '订单详情',
//   errand: '同城跑腿',
//   errand_order_detail: '订单详情',
//   new_user_coupon: '新手红包',
//   user_about: '关于我们',
//   user_connect_us: '联系我们',
//   user_coupon: '我的红包',
//   address_list: '服务地址',
//   address_add: '添加服务地址',
//   address_edit: '修改服务地址',
//   address_select: '选择你的位置',
// }

let router = new Router({
  routes: [{
    path: '',
    redirect: '/menu/index'
  }, {
    path: '/',
    redirect: '/menu/index'
  }, {
    path: '/menu',
    name: 'menu',
    component: Menu,
    children: [{
      path: 'index',
      name: 'index',
      component: Index
    }, {
      path: 'activity',
      name: 'activity',
      component: Activity,
    }, {
      path: 'order',
      name: 'order',
      component: OrderList
    }, {
      path: 'user',
      name: 'user',
      component: User,
    }]
  }, {
    path: '/activity/black_friday',
    name: 'black_friday',
    component: BlackFriday,
  }, {
    path: '/activity/sf_activity',
    name: 'sf_activity',
    component: SFActivity,
  }, {
    path: '/service/detail/',
    name: 'service_detail',
    component: ServiceDetail
  }, {
    path: '/service/recommend_more',
    name: 'recommend_more',
    component: RecommendMoreServiceDetail
  }, {
    path: '/order/order_place',
    name: 'order_place',
    component: OrderPlace
  }, {
    path: '/order/order_detail/:orderId',
    name: 'order_detail',
    component: OrderDetail
  }, {
    path: '/order/order_complaint_reason/:orderId',
    name: 'order_complaint_reason',
    component: OrderComplaintReason
  }, {
    path: '/order/order_cancel_reason/:orderId',
    name: 'order_cancel_reason',
    component: OrderCancelReason
  }, {
    path: '/order/order_pay_status',
    name: 'order_pay_status',
    component: OrderPayStatus
  }, {
    path: '/order/order_add_pay/:orderId',
    name: 'order_add_pay',
    component: OrderAddPay
  }, {
    path: '/order/order_pay/:orderId',
    name: 'order_pay',
    component: OrderPay
  }, {
    path: '/order/order_service_time',
    name: 'order_service_time',
    component: OrderServiceTime
  }, {
    path: '/order/order_coupon_select',
    name: 'order_coupon_select',
    component: OrderCouponSelect
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/service/express',
    name: 'express',
    component: ServiceExpress
  }, {
    path: '/order/express_order_detail/:orderId',
    name: 'express_order_detail',
    component: ServiceExpressDetail
  }, {
    path: '/service/errand',
    name: 'errand',
    component: ServiceErrand
  }, {
    path: '/order/errand_order_detail/:orderId',
    name: 'errand_order_detail',
    component: ServiceErrandDetail
  }, {
    path: '/activity/new_user_coupon',
    name: 'new_user_coupon',
    component: NewUserCoupon
  }, {
    path: '/about',
    name: 'user_about',
    component: About,
  }, {
    path: '/connect_us',
    name: 'user_connect_us',
    component: ConnectUs,
  }, {
    path: '/user/user_coupon',
    name: 'user_coupon',
    component: UserCoupon,
  }, {
    path: '/address',
    redirect: '/address/address_list'
  }, {
    path: '/address/address_add',
    name: 'address_add',
    component: AddressAdd
  }, {
    path: '/address/address_list',
    name: 'address_list',
    component: AddressList
  }, {
    path: '/address/address_edit',
    name: 'address_edit',
    component: AddressEdit
  }, {
    path: '/address/address_select',
    name: 'address_select',
    component: AddressSelectInMap
  }],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
});

router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  // 设置微信分享
  // wx.config({
  //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  //   appId: '', // 必填，公众号的唯一标识
  //   timestamp: '', // 必填，生成签名的时间戳
  //   nonceStr: '', // 必填，生成签名的随机串
  //   signature: '', // 必填，签名，见附录1
  //   jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  // });
  // // 分享到朋友圈
  // wx.onMenuShareTimeline({
  //   title: '我已经领取了188元红包，你还没领吗', // 分享标题
  //   link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf88cbf4dba349e56&redirect_uri=https%3A%2F%2Fwap.zhujiash.com%2Fpaylinks%2Findex.html&response_type=code&scope=snsapi_base#wechat_redirect', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  //   imgUrl: '', // 分享图标
  //   success: function() {
  //     // 用户确认分享后执行的回调函数
  //     store.dispatch('SetAlert', {
  //       alertMsg: '分享成功',
  //       alertTimeout: 1000,
  //     });
  //   },
  //   cancel: function() {
  //     // 用户取消分享后执行的回调函数
  //   }
  // });
  // wx.onMenuShareAppMessage({
  //   title: '我已经领取了188元红包，你还没领吗', // 分享标题
  //   desc: '小时工，新房开荒，家电拆洗，同城跑腿…全品类生活服务极速上门，不满意包退！', // 分享描述
  //   link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf88cbf4dba349e56&redirect_uri=https%3A%2F%2Fwap.zhujiash.com%2Fpaylinks%2Findex.html&response_type=code&scope=snsapi_base#wechat_redirect', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  //   imgUrl: '', // 分享图标
  //   type: '', // 分享类型,music、video或link，不填默认为link
  //   dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
  //   success: function() {
  //     // 用户确认分享后执行的回调函数
  //     store.dispatch('SetAlert', {
  //       alertMsg: '分享成功',
  //       alertTimeout: 1000,
  //     });
  //   },
  //   cancel: function() {
  //     // 用户取消分享后执行的回调函数
  //   }
  // });
  var ROUTER_TO_TITLE = store.state.ROUTER_TO_TITLE;

  // 对不同的路由设置不同的title
  var login = document.getElementById('module_login');
  if (login && login.classList.contains('active')) {
    login && login.classList.remove('active');
    document.title = ROUTER_TO_TITLE[from.name] || ROUTER_TO_TITLE['/menu/index'];

    // input失去焦点
    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].blur();
    }

    // 阻止路由跳转
    next(false);
  } else if(document.querySelector('body').classList.contains('easemobim-mobile-body')) {
    document.querySelector('html').classList.remove('easemobim-mobile-html');
    document.querySelector('body').classList.remove('easemobim-mobile-body');
    document.querySelector('iframe.easemobim-chat-panel').classList.add('easemobim-minimized');
    next(false);
  } else {
    document.title = ROUTER_TO_TITLE[to.name] || ROUTER_TO_TITLE['/menu/index'];
    next();
  }
});

export default router;