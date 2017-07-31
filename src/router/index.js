import Vue from 'vue';
import Router from 'vue-router';

import Menu from '@/components/Menu';
import Index from '@/components/Index/Index';
import ServiceDetail from '@/components/Index/ServiceDetail';
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

export default new Router({
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
      component: User
    }]
  }, {
    path: '/menu/index/detail',
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
  }]
});