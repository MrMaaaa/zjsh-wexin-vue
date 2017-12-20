import Vue from 'vue';
import Router from 'vue-router';

const Menu = () => import('@/pages/Menu');
const Index = () => import('@/pages/Index/Index');
const Login = () => import('@/pages/Login/Login');
const Activity = () => import('@/pages/Activity/Activity');
const AllService = () => import('@/pages/Service/AllService');
const ServiceDetail = () => import('@/pages/Service/CommonServiceDetail');
const RecommendMoreServiceDetail = () => import('@/pages/Service/CommonRecommendMoreServiceDetail');
const ServiceExpress = () => import('@/pages/Service/ServiceExpress');
const ServiceErrand = () => import('@/pages/Service/ServiceErrand');
const ServiceExpressDetail = () => import('@/pages/Service/ServiceExpressDetail');
const ServiceErrandDetail = () => import('@/pages/Service/ServiceErrandDetail');
const NewUserCoupon = () => import('@/pages/Activity/NewUserCoupon/NewUserCoupon');
const AddressAdd = () => import('@/pages/Address/AddressAdd');
const AddressList = () => import('@/pages/Address/AddressList');
const AddressEdit = () => import('@/pages/Address/AddressEdit');
const AddressSelectInMap = () => import('@/pages/Address/AddressSelectInMap');
const About = () => import('@/pages/Index/About');
const ConnectUs = () => import('@/pages/Index/ConnectUs');
const OrderList = () => import('@/pages/Order/OrderList');
const OrderPlace = () => import('@/pages/Order/OrderPlace');
const OrderDetail = () => import('@/pages/Order/OrderDetail');
const OrderRechargeDetail = () => import('@/pages/Order/OrderRechargeDetail');
const OrderComplaintReason = () => import('@/pages/Order/OrderComplaintReason');
const OrderCancelReason = () => import('@/pages/Order/OrderCancelReason');
const OrderPayStatus = () => import('@/pages/Order/OrderPayStatus');
const OrderAddPay = () => import('@/pages/Order/OrderAddPay');
const OrderPay = () => import('@/pages/Order/OrderPay');
const OrderServiceTime = () => import('@/pages/Order/OrderServiceTime');
const OrderSpecialDemand = () => import('@/pages/Order/OrderSpecialDemand');
const OrderCouponSelect = () => import('@/pages/Order/OrderCouponSelect');
const User = () => import('@/pages/User/User');
const UserCoupon = () => import('@/pages/User/UserCoupon');
const UserInfoEdit = () => import('@/pages/User/UserInfoEdit');
const UserBalance = () => import('@/pages/User/UserBalance');
const UserNickNameEdit = () => import('@/pages/User/UserNickNameEdit');
const UserMessage = () => import('@/pages/User/UserMessage');
const UserMessageDetail = () => import('@/pages/User/UserMessageDetail');
// 活动
const BlackFriday = () => import('@/pages/Activity/BlackFriday/BlackFriday');
const SFActivity = () => import('@/pages/Activity/SFActivity/SFActivity');
const QianNeiZhu = () => import('@/pages/Activity/QianNeiZhu/QianNeiZhu');
const OneRecharge = () => import('@/pages/Activity/OneRecharge/Introduction');
const OneRechargeIndex = () => import('@/pages/Activity/OneRecharge/OneRecharge');

import store from '../store/index';

Vue.use(Router);

// console.log(store.state.AppName);

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
      component: Index,
    }, {
      path: 'activity',
      name: 'activity',
      component: Activity,
    }, {
      path: 'order',
      name: 'order',
      component: OrderList,
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
    path: '/activity/qianneizhu',
    name: 'qianneizhu',
    component: QianNeiZhu,
  }, {
    path: '/activity/one_recharge',
    name: 'one_recharge',
    component: OneRecharge,
  }, {
    path: '/activity/one_recharge/index',
    name: 'one_recharge_index',
    component: OneRechargeIndex,
  }, {
    path: '/menu/index/all_service',
    name: 'all_service',
    component: AllService
  }, {
    path: '/menu/index/detail/:id',
    name: 'service_detail',
    component: ServiceDetail
  }, {
    path: '/service/recommend_more',
    name: 'recommend_more',
    component: RecommendMoreServiceDetail
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/menu/order/order_place',
    name: 'order_place',
    component: OrderPlace
  }, {
    path: '/order/order_detail/:orderId',
    name: 'order_detail',
    component: OrderDetail
  }, {
    path: '/order/order_recharge_detail/:out_trade_no',
    name: 'order_recharge_detail',
    component: OrderRechargeDetail
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
    path: '/order/order_special_demand/:serviceId',
    name: 'order_special_demand',
    component: OrderSpecialDemand
  }, {
    path: '/order/order_coupon_select',
    name: 'order_coupon_select',
    component: OrderCouponSelect
  }, {
    path: '/express',
    name: 'express',
    component: ServiceExpress
  }, {
    path: '/order/express_order_detail/:orderId',
    name: 'express_order_detail',
    component: ServiceExpressDetail
  }, {
    path: '/errand',
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
    path: '/user/user_info_edit',
    name: 'user_info_edit',
    component: UserInfoEdit,
  }, {
    path: '/user/user_balance',
    name: 'user_balance',
    component: UserBalance,
  }, {
    path: '/user/user_info_edit/user_nickname_edit',
    name: 'user_nickname_edit',
    component: UserNickNameEdit,
  }, {
    path: '/user/user_coupon',
    name: 'user_coupon',
    component: UserCoupon,
  }, {
    path: '/user/user_message',
    name: 'user_message',
    component: UserMessage,
  }, {
    path: '/user/user_message/detail',
    name: 'user_message_detail',
    component: UserMessageDetail,
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
  var ROUTER_TO_TITLE = store.state.ROUTER_TO_TITLE;

  // 对不同的路由设置不同的title
  if (document.querySelector('body').classList.contains('easemobim-mobile-body')) {
    // 关闭客服窗口
    document.querySelector('html').classList.remove('easemobim-mobile-html');
    document.querySelector('body').classList.remove('easemobim-mobile-body');
    document.querySelector('iframe.easemobim-chat-panel').classList.add('easemobim-minimized');
    document.querySelector('.easemobim-prompt-wrapper').style.display = 'none';
    next(false);
  } else {
    document.title = ROUTER_TO_TITLE[to.name] || ROUTER_TO_TITLE['index'];
    next();
  }
});

export default router;