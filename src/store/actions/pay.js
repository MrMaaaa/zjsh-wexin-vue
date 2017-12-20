import API from '../../config/backend.js';
import axios from 'axios';
import qs from 'qs';

export default {
  // 是否是首充用户
  IsFirstRecharge({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.IsFirstRechargeIsFirstRecharge, {
              Token: state.Token
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },

    // 获取充值列表
    GetRechargeListEx({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetRechargeListEx)
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },

    // 获取 一元首充 充值列表
    GetReChargeListResponse({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetReChargeListResponse)
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },

    // 支付宝充值
    GetAlipaySignForWeb({
      state,
      commit
    }, {
      NeedPay,
      TotalMoney,
      ActivityId,
      Activity
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetAlipaySignForWeb, {
              Token: state.Token,
              NeedPay,
              TotalMoney,
              ActivityId,
              Activity
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },

    // 微信充值
    GetWxpaySignForWeb({
      state,
      commit
    }, {
      NeedPay,
      TotalMoney,
      ActivityId,
      Activity
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetWxpaySignForWeb, {
              Token: state.Token,
              TradeType: state.OpenId === '' ? 'MWEB' : 'JSAPI',
              OpenId: state.OpenId,
              NeedPay,
              TotalMoney,
              ActivityId,
              Activity
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },

    // 余额支付
    BalancePay({
      state,
      commit
    }, {
      OrderId,
      CouponId = '',
      BalancePay
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.BalancePay, {
              Token: state.Token,
              OrderId,
              CouponId,
              BalancePay
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },

    // 微信支付
    /**
     * PayFrom: 0:微信公众号 1:app
     */
    GetWxpaySign({
      state,
      commit
    }, {
      OrderId,
      WxPay,
      BalancePay = '0',
      CouponId = ''
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetWxpaySign, {
              Token: state.Token,
              OpenId: state.OpenId,
              PayFrom: '0',
              OrderId,
              WxPay,
              BalancePay,
              CouponId
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },

    // 支付宝支付
    /**
     * SignType: 'web':默认 '2':增项支付
     */
    GetAlipaySign({
      state,
      commit
    }, {
      SignType = 'web',
      OrderId,
      CouponId = '',
      Alipay,
      BalancePay = '0'
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetAlipaySign, {
              Token: state.Token,
              SignType,
              OrderId,
              CouponId,
              Alipay,
              BalancePay
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },

    // 增项余额支付
    IodOfBalancePay({
      state,
      commit
    }, {
      OrderId,
      BalancePay
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.IodOfBalancePay, {
              Token: state.Token,
              OrderId,
              BalancePay
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                resolve(res.data.Body);
              } else {
                reject(res.data.Meta);
              }
            })
            .catch(err => {
              reject({
                ErrorCode: '-101',
                ErrorMsg: state.ALERT_MSG.NET_ERROR
              });
            });
        })
        .catch(err => {
          throw err;
        });
    },
}