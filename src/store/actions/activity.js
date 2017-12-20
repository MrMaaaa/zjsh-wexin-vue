import API from '../../config/backend.js';
import axios from 'axios';
import qs from 'qs';
import Utils from '../../config/utils.js';

export default {
  // 首页弹窗
  FirstOpenAppInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.FirstOpenAppInfo, {
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

  // 超级星期五
  BlackFridayEx({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.BlackFridayEx)
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

    // 判断是否为新用户
    CheckClientUser({
      state,
      commit
    }, {
      PhoneNumber
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.CheckClientUser, {
              PhoneNumber
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

    // 新手红包活动-新用户领取红包列表
    NewUserReceiveRedCoups({
      state,
      commit
    }, {
      PhoneNumber,
      Password = '123456',
      Captcha,
      DeviceId = ''
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.NewUserReceiveRedCoups, {
              PhoneNumber,
              Password,
              Captcha,
              DeviceId
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

    // 新手红包活动-老用户领取红包列表
    OldUserReceiveRedCoups({
      state,
      commit
    }, {
      PhoneNumber
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.OldUserReceiveRedCoups, {
              PhoneNumber
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

    // 判断是否为首充用户
    IsFirstRecharge({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.IsFirstRecharge, {
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
}