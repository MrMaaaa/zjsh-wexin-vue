// const wap = "http://192.168.1.191:3001/";
// const wap = "http://copen.homepaas.com/";
const wap = "https://copen.zhujiash.com/";

export default {
  // 检查当前用户手机号
  "CheckClientUser": wap + "api/v3/ClientInfo/CheckClientUser",

  // 新手红包页面获取老用户红包
  "OldUserReceiveRedCoups" : wap + "api/v3/ClientInfo/OldUserReceiveRedCoups",

  // 新手红包页面获取新用户红包
  "NewUserReceiveRedCoups" : wap + "api/v3/ClientInfo/NewUserReceiveRedCoups",

  // 发送验证码
  "SendCaptcha": wap + "api/v3/Helper/SendCaptcha",

  // 通过Token获取用户信息
  "VerifyToken": wap + "api/v3/helper/VerifyToken",

  // 快捷登录
  "QuickLogin": wap + "api/v3/Wap/QuickLogin",

  // 获取首页推荐品类
  "Recommend": wap + "api/v3/Front/Recommend",

  // 获取服务价格
  "QueryServicePrice": wap + "api/v3/Front/QueryServicePrice",

  // 获取活动类服务价格
  "QueryActivityCommonServicePrice": wap + "api/v3/Front/QueryActivityCommonServicePrice",

  // 获取服务时间
  "ServiceTimeStartAt": wap + "api/v3/Front/ServiceTimeStartAt",

  // 获取服务对应活动
  "GetActivityEx": wap + "api/v3/Front/GetActivityEx",

  // 提交订单
  "SubmitOrder": wap + "api/v3/Front/SubmitOrder",

  // 获取订单列表
  "GetOrderListEx": wap + "api/v3/OrderInfo/GetOrderListEx",

  // 获取订单详情
  "GetOrderInfoEx": wap + "api/v3/OrderInfo/GetOrderInfoEx",

  // 微信获取open id
  "GetWxpayOpenId": wap + "api/v3/OrderInfo/GetWxpayOpenId",

  // 微信获取用户信息
  "GetWxUserInfo": wap + "api/v3/Wx/GetWxUserInfo",

  // 微信授权
  "GetAuthUrl": wap + "api/v3/wap/GetAuthUrl",

  // 微信支付接口
  "GetWxpaySign": wap + "api/v3/OrderInfo/GetWxpaySign",

  // 支付宝支付接口
  "GetAlipaySign": wap + "api/v3/OrderInfo/GetAlipaySign",

  // 取消订单
  "CancelOrderEx": wap + "api/v3/OrderInfo/CancelOrderEx",

  // 删除订单
  "RemoveOrderEx": wap + "api/v3/OrderInfo/RemoveOrderEx",

  // 完成订单
  "CompleteOrderEx": wap + "api/v3/OrderInfo/CompleteOrderEx",

  // 获取地址
  "GetAddress": wap + "api/v3/ClientInfo/GetAddress",

  // 获取地址标签
  "GetAddressTags": wap + "api/v3/ClientInfo/GetAddressTags",

  // 增加地址
  "AddAddress": wap + "api/v3/ClientInfo/AddAddress",

  // 删除地址
  "DeleteAddress": wap + "api/v3/ClientInfo/DeleteAddress",

  // 编辑地址
  "EditAddress": wap + "api/v3/ClientInfo/EditAddress",

  // 获取个人信息
  "GetUserInfo": wap + "api/v3/ClientInfo/Index",

  // 获取我的账户
  "MySettlement": wap + "api/v3/ClientInfo/MySettlement",

  // 获取红包列表
  "GetCoupons": wap + "api/v3/User/GetCoupons",
}