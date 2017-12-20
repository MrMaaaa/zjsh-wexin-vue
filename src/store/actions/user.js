import API from '../../config/backend.js';
import axios from 'axios';
import qs from 'qs';
import Utils from '../../config/utils.js';
import DefaultLoginAvatar from '../../assets/images/user_default_login.png';

export default {
  // 登录
  QuickLogin({
      state,
      commit
    }, {
      LoginName,
      Captcha
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.QuickLogin, {
              LoginName,
              Captcha,
              RegisterSource: state.OrderFrom
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                // 登录成功后保存token，进行gio统计
                window._vds.push(['setCS1', 'user_id', res.data.Body.UserId]);
                commit('SetToken', res.data.Body.Token);
                commit('SetUserId', res.data.Body.UserId);
                commit('SetIsLogin', '1');
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

    // 注销
    Logout({
      state,
      commit
    }) {
      window._vds.push(['setCS1', 'user_id', '']);
      commit('SetToken', '');
      commit('SetIsLogin', '0');
      commit('SetUserId', '');
      commit('SetDefaultAddressId', '');
      commit('SetCurrentPosition', '');
    },

    // 验证Token
    VerifyToken({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.VerifyToken, {
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

    // 发送验证码
    SendCaptcha({
      state,
      commit
    }, {
      Phone,
      Type = '4'
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.SendCaptcha, {
              Phone,
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

    // 获取用户信息
    GetUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetUserInfo, {
              Token: state.Token
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                if (!res.data.Body.Info.HqPic) {
                  res.data.Body.Info.HqPic = DefaultLoginAvatar;
                }
                commit('SetUserInfo', res.data.Body.Info);
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

    // 获取用户余额
    MySettlement({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.MySettlement, {
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

    // 获取用户红包
    /**
     * ServiceId: 指定服务id的红包
     * IsPay: 是否是支付页面
     */
    GetCoupons({
      state,
      commit
    }, {
      ServiceId = '',
      IsPay = '0',
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetCoupons, {
              Token: state.Token,
              ServiceId,
              IsPay
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

    // 获取用户中心消息
    GetUserMessage({
      state,
      commit
    }, {
      IsEnablePaging = '1',
      PageIndex = '0',
      PageSize = '10'
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetUserMessage, {
              Token: state.Token,
              IsEnablePaging,
              PageIndex,
              PageSize
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

    // 获取未读消息个数
    GetUnreadMessage({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetUnreadMessage, {
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

    // 消息设为已读
    SetUserMessage({
      state,
      commit
    }, {
      Ids
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.SetUserMessage, {
              Token: state.Token,
              Ids
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

    // 清空消息中心
    ClearUserMessage({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.ClearUserMessage, {
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

    // 获取用户微信信息
    GetWxUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetWxUserInfo, {
              OpenId: state.OpenId
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

    // 设置用户头像
    SetPhoto({
      state,
      commit
    }, {
      photo
    }) {
      var formData = new FormData();
      var json_data = {
        Token: state.Token,
        photo
      };
      formData.append('Token', state.Token);
      formData.append('photo', photo);
      formData.append('json_data', JSON.stringify(json_data));
      return new Promise((resolve, reject) => {
          axios.post(API.SetPhoto, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
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

    // 设置用户昵称
    SetNickName({
      state,
      commit
    }, {
      NickName
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.SetNickName, {
              Token: state.Token,
              NickName
            })
            .then(res => {
              state.UserInfo.NickName = NickName;
              commit('SetUserInfo', state.UserInfo);
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

    // 微信端通过url的code获取用户OpenId
    GetWxpayOpenId({
      state,
      commit
    }, {
      WxCode
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetWxpayOpenId, {
              Token: state.Token,
              WxCode
            })
            .then(res => {
              if (res.data.Meta.ErrorCode === '0') {
                commit('SetOpenId', res.data.Body.OpenId);
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

    // 上传推送信息
    UpdatePushDeviceID({
      state,
      commit
    }, {
      PushDeviceId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.UpdatePushDeviceID, {
              Token: state.Token,
              DeviceType: state.OrderFrom,
              PushDeviceId
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