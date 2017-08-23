function getCookie(c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + "=");
    let c_end = null;
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
};

function setCookie(c_name, value, expiredays, path) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + encodeURIComponent(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString()) + ((path == null) ? "" : ";path=" + path);
};

//获取url参数
function getvl(name) {
  var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
  if (reg.test(location.href)) return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
  return "";
};

export default {
  getCookie: getCookie,
  setCookie: setCookie,
  getvl: getvl
};