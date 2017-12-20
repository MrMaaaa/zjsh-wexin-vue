module.exports = {
  read(key) {
    if (!key) return false;
    if (window.localStorage) {
      return window.localStorage.getItem(key) || '';
    } else {
      if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(key + "=");
        let c_end = null;
        if (c_start != -1) {
          c_start = c_start + key.length + 1;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1) c_end = document.cookie.length;
          return unescape(document.cookie.substring(c_start, c_end)) || '';
        }
      }
      return "";
    }
  },
  write(key, value = '', expire = 30, path = '/') {
    if (!key) return false;
    if (window.localStorage) {
      window.localStorage.setItem(key, value);
    } else {
      let exdate = new Date();
      exdate.setDate(exdate.getDate() + expire);
      document.cookie = key + "=" + encodeURIComponent(value) + ((expire == null) ? "" : ";expires=" + exdate.toUTCString()) + ((path == null) ? "" : ";path=" + path);
    }
  },
  typeof(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  },
  generateRandId(len = 16) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < len; i++) {
      let r = Math.floor(Math.random() * (62));
      id += str.substring(r, r + 1);
    }
    return id;
  },
  valueFromUrl(key) {
    let url = window.location.search;
    let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    let result = url.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : '';
  },
  urlToRoute(url = '') {
    // 将传给app的活动url转为对应的路由name
    url = url.toLowerCase();
    if (url.indexOf('qianneizhu') > -1) {
      return 'qianneizhu';
    } else if (url.indexOf('blackfriday') > -1) {
      return 'black_friday';
    } else if (url.indexOf('usercoupon') > -1) {
      return 'new_user_coupon';
    } else if (url.indexOf('recharge') > -1) {
      return 'one_recharge';
    } else if (url.indexOf('sfactivity') > -1) {
      return 'sf_activity';
    }
  },
  // formatDate(timestamp, format = 'yy-mm-dd hh:mm:ss') {
  //   if (window.isNaN(timestamp)) return '';
  //   const date = new Date(window.parseInt(timestamp));
  //   let year = date.getFullYear();
  //   let month = date.getMonth() + 1;
  //   let day = date.getDate();
  //   let hour = date.getHours();
  //   let minute = date.getMinutes();
  //   let second = date.getSeconds();

  //   month = month < 10 ? '0' + month : month;
  //   day = day < 10 ? '0' + day : day;
  //   hour = hour < 10 ? '0' + hour : hour;
  //   minute = minute < 10 ? '0' + minute : minute;
  //   second = second < 10 ? '0' + second : second;

  //   return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  // },
  formatDate(date, format = 'yyyy-mn-dd hh:mm:ss') {
    if (!date) {
      return '';
    }

    let d = new Date(window.parseInt(date));
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = d.getDate();
    day = day < 10 ? '0' + day : day;
    let hour = d.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    let minute = d.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    let second = d.getSeconds();
    second = second < 10 ? '0' + second : second;

    format = format.replace('yyyy', year);
    format = format.replace('mn', month);
    format = format.replace('dd', day);
    format = format.replace('hh', hour);
    format = format.replace('mm', minute);
    format = format.replace('ss', second);

    return format;
  },
}