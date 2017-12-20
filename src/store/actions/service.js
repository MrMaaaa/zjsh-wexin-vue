import API from '../../config/backend.js';
import axios from 'axios';
import qs from 'qs';
import Utils from '../../config/utils.js';

export default {
  // 获取服务列表
  AllService({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.AllService, {})
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

    // 获取首页推荐服务
    Recommend({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.Recommend, {})
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

    // 获取首页超级优惠服务
    GetSuperDiscount({
      state,
      commit
    }, {
      IsNewVersion = '1',
      Longitude,
      Latitude
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetSuperDiscount, {
              Token: state.Token,
              IsNewVersion,
              Longitude,
              Latitude
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

    // 获取活动信息(app的首页banner)
    GetAds({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetAds, {
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

    // 获取指定id服务信息
    QueryService({
      state,
      commit
    }, {
      ServiceId,
      IsNewVersion = '1'
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.QueryService, {
              Token: state.Token,
              ServiceId,
              IsNewVersion
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

    // 获取服务价格信息
    QueryServicePrice({
      state,
      commit
    }, {
      ServiceId,
      Longitude,
      Latitude
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.QueryServicePrice, {
              Token: state.Token,
              ServiceId,
              Longitude,
              Latitude
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

    // 获取服务活动价格
    QueryActivityCommonServicePrice({
      state,
      commit
    }, {
      ActivityProductId,
      Longitude,
      Latitude
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.QueryActivityCommonServicePrice, {
              Token: state.Token,
              ActivityProductId,
              Longitude,
              Latitude
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

    // 获取服务活动折扣信息
    GetActivityEx({
      state,
      commit
    }, {
      ServiceId,
      Longitude,
      Latitude
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetActivityEx, {
              Token: state.Token,
              ServiceId,
              Longitude,
              Latitude
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

    // 获取服务可服务时间
    ServiceTimeStartAt({
      state,
      commit
    }, {
      ServiceId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.ServiceTimeStartAt, {
              ServiceId
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

    // 获取跑腿UU价格
    GetPaoTuiPrice({
      state,
      commit
    }, {
      SenderAddressId,
      ReceiverAddressId,
      SubscribeTime
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetPaoTuiPrice, {
              Token: state.Token,
              SenderAddressId,
              ReceiverAddressId,
              SubscribeTime
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
    // 获取跑腿闪送价格
    GetShanSongPrice({
      state,
      commit
    }, {
      SenderAddressId,
      ReceiverAddressId,
      SubscribeTime,
      Weight,
      Goods,
      Remark
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetShanSongPrice, {
              Token: state.Token,
              SenderAddressId,
              ReceiverAddressId,
              SubscribeTime,
              Weight,
              Goods,
              Remark
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