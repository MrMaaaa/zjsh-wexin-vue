import API from '../../config/backend.js';
import axios from 'axios';
import qs from 'qs';
import Utils from '../../config/utils.js';

export default {
  // 获取用户地址
  GetAddress({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetAddress, {
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

    // 获取地址标签
    GetAddressTags({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.GetAddressTags, {})
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

    // 添加地址
    AddAddress({
      state,
      commit
    }, {
      Address
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.AddAddress, {
              Token: state.Token,
              Address
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

    // 修改地址
    EditAddress({
      state,
      commit
    }, {
      Address
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.EditAddress, {
              Token: state.Token,
              Address
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

    // 删除地址
    DeleteAddress({
      state,
      commit
    }, {
      AddressId
    }) {
      return new Promise((resolve, reject) => {
          axios.post(API.DeleteAddress, {
              Token: state.Token,
              AddressId
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