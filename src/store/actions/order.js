import API from '../../config/backend.js';
import axios from 'axios';
import qs from 'qs';
import Utils from '../../config/utils.js';

export default {
  // 获取订单列表
  /**
   * Type
   * 6:当前订单 7:历史订单
   */
  GetOrderListEx({
      state,
      commit
    }, {
      PageIndex,
      PageSize = '10',
      Type
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetOrderListEx, {
              Token: state.Token,
              PageIndex,
              PageSize,
              Type
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

    // 获取订单详情
    GetOrderInfoEx({
      state,
      commit
    }, {
      OrderId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetOrderInfoEx, {
              Token: state.Token,
              OrderId
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

    // 获取订单进度
    TrackOrderStatus({
      state,
      commit
    }, {
      OrderId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.TrackOrderStatus, {
              Token: state.Token,
              OrderId
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

    // 获取订单推送
    GetOrderListPop({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetOrderListPop, {
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

    // 提交快递订单
    CreateKdEOrder({
      state,
      commit
    }, {
      SenderAddressId,
      ReceiverAddressId,
      GoodsName,
      PayType,
      ServiceTime,
      GoodsWeight
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.CreateKdEOrder, {
              Token: state.Token,
              OrderFrom: state.OrderFrom,
              SenderAddressId,
              ReceiverAddressId,
              GoodsName,
              PayType,
              ServiceTime,
              GoodsWeight
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

    // 提交跑腿订单
    CreatePaoTuiOrder({
      state,
      commit
    }, {
      OrderType = '2',
      PayType = '1',
      Note,
      PriceOrdeId,
      SenderAddressId,
      ReceiverAddressId,
      GoodsName,
      ServiceTime,
      GoodsWeight
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.CreatePaoTuiOrder, {
              Token: state.Token,
              OrderType,
              PayType,
              OrderFrom: state.OrderFrom,
              Note,
              PriceOrdeId,
              SenderAddressId,
              ReceiverAddressId,
              GoodsName,
              ServiceTime,
              GoodsWeight
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

    // 获取快递/跑腿订单详情
    GetExpressDetail({
      state,
      commit
    }, {
      OrderId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetExpressDetail, {
              Token: state.Token,
              OrderId
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

    // 获取快递/跑腿进度信息
    GetKdTrackInfo({
      state,
      commit
    }, {
      LogisticCode,
      ShipperCode
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetKdTrackInfo, {
              LogisticCode,
              ShipperCode
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

    // 通过code获取支付信息
    GetRechargeInfoByRechargeCode({
      state,
      commit
    }, {
      RechargeCode
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetRechargeInfoByRechargeCode, {
              Token: state.Token,
              RechargeCode
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

    // 删除订单
    RemoveOrderEx({
      state,
      commit
    }, {
      OrderId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.RemoveOrderEx, {
              Token: state.Token,
              OrderId
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

    // 确认订单完成
    CompleteOrderEx({
      state,
      commit
    }, {
      OrderId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.CompleteOrderEx, {
              Token: state.Token,
              OrderId
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

    // 取消订单
    OrderCancel({
      state,
      commit
    }, {
      OrderId,
      CancelReason
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.OrderCancel, {
              Token: state.Token,
              OrderId,
              CancelReason
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

    // 提交订单评价
    SubmitEvaluation({
      state,
      commit
    }, {
      OrderCode,
      StarLevel,
      Content,
      EvaluatedTag
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.SubmitEvaluation, {
              Token: state.Token,
              OrderCode,
              StarLevel,
              Content,
              EvaluatedTag
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

    // 订单投诉
    SubmitApplyComplaints({
      state,
      commit
    }, {
      OrderId,
      Indexs,
      Titles,
      Reason
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.SubmitApplyComplaints, {
              Token: state.Token,
              OrderId,
              Indexs,
              Titles,
              Reason
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

    // 获取订单评价等级
    GetStarLevel({
      state,
      commit
    }, {
      ServiceTypeId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetStarLevel, {
              Token: state.Token,
              ServiceTypeId
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

    // 获取订单取消理由列表
    GetOrderCancelReasonList({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetOrderCancelReasonList, {
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

    // 获取订单投诉理由列表
    GetOrderComplaintsReasonList({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetOrderComplaintsReasonList, {
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

    // 提交订单
    SubmitOrder({
      state,
      commit
    }, {
      ServiceId,
      SpecialType,
      ServiceAddressId,
      Total,
      ServiceStartAt,
      Price,
      SellType,
      ServiceContent,
      IsClaims
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.SubmitOrder, {
              Token: state.Token,
              OrderFrom: state.OrderFrom,
              ServiceId,
              SpecialType,
              ServiceAddressId,
              Total,
              ServiceStartAt,
              Price,
              SellType,
              ServiceContent,
              IsClaims
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