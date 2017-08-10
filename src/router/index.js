import Vue from 'vue';
import Router from 'vue-router';

import Menu from '@/components/Menu';
import Index from '@/components/Index/Index';
import ServiceDetail from '@/components/Index/ServiceDetail';
import ServiceExpress from '@/components/Activity/SFExpress/ServiceExpress';
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
import OrderPayStatus from '@/components/Order/OrderPayStatus';
import OrderPay from '@/components/Order/OrderPay';
import OrderServiceTime from '@/components/Order/OrderServiceTime';
import OrderCouponSelect from '@/components/Order/OrderCouponSelect';
import User from '@/components/User/User';
import UserCoupon from '@/components/User/UserCoupon';

Vue.use(Router);

// 路由-标题映射表
const ROUTER_TO_TITLE = {
  '/menu/index': '搜上门服务，用助家生活',
  '/menu/index/detail': '服务详情',
  '/menu/order': '订单列表',
  '/menu/order/order_place': '下单页',
  '/menu/order/order_pay_status': '订单信息',
  '/menu/order/order_pay': '订单支付',
  '/menu/order/order_service_time': '选择服务时间',
  '/menu/order/order_coupon_select': '使用红包',
  '/menu/user': '我的信息',
  '/menu/user/user_coupon': '我的红包',
  '/menu/about': '关于助家生活',
  '/menu/connect_us': '联系我们',
  '/address/address_list': '服务地址',
  '/address/address_add': '添加服务地址',
  '/address/address_edit': '修改服务地址',
  '/address/address_select': '修改服务地址',
}

var router = new Router({
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
      path: 'order',
      name: 'order',
      component: OrderList
    }, {
      path: 'user',
      name: 'user',
      component: User,
    }]
  }, {
    path: '/menu/index/detail/:id',
    name: 'service_detail',
    component: ServiceDetail
  }, {
    path: '/menu/order/order_place',
    name: 'order_place',
    component: OrderPlace
  }, {
    path: '/menu/order/order_pay_status',
    name: 'order_pay_status',
    component: OrderPayStatus
  }, {
    path: '/menu/order/order_pay',
    name: 'order_pay',
    component: OrderPay
  }, {
    path: '/menu/order/order_service_time',
    name: 'order_service_time',
    component: OrderServiceTime
  }, {
    path: '/menu/order/order_coupon_select',
    name: 'order_coupon_select',
    component: OrderCouponSelect
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/express',
    name: 'express',
    component: ServiceExpress
  }, {
    path: '/new_user_coupon',
    name: 'new_user_coupon',
    component: NewUserCoupon
  }, {
    path: '/menu/about',
    name: 'user_about',
    component: About,
  }, {
    path: '/menu/connect_us',
    name: 'user_connect_us',
    component: ConnectUs,
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
  }, {
    path: '/menu/user/user_coupon',
    name: 'user_coupon',
    component: UserCoupon,
  }],
});

router.beforeEach((to, from, next) => {
  // 对不同的路由设置不同的title
  var login = document.getElementById('module_login');
  if(login && login.classList.contains('active')) {
    login && login.classList.remove('active');
    document.title = ROUTER_TO_TITLE[from.path] || ROUTER_TO_TITLE['/menu/index'];

    // input失去焦点
    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].blur();
    }

    // 阻止路由跳转
    next(false);
  } else {
    if(to.path === '/menu/index/detail' && from.path === '/menu/index/detail') {
      next({
        name: '/menu/index'
      });
    } else {
      document.title = ROUTER_TO_TITLE[to.path] || ROUTER_TO_TITLE['/menu/index'];
      next();
    }
  }
})

export default router;