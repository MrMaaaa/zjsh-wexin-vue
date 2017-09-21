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

  // 验证Token是否有效
  "VerifyToken": wap + "api/v3/helper/VerifyToken",

  // 快捷登录
  "QuickLogin": wap + "api/v3/Wap/QuickLogin",

  // 获取活动列表
  "GetAds": wap + "api/v3/Provider/GetAds",

  // 获取首页推荐品类
  "Recommend": wap + "api/v3/Front/Recommend",

  // 获取首页推荐品类“更多”对应的服务
  "QueryService": wap + "api/v3/Front/QueryService",

  // 获取超级优惠
  "GetSuperDiscount": wap + "api/v3/Front/GetSuperDiscount",

  // 获取全部分类
  "AllService": wap + "api/v3/Front/AllService",

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

  // 获取订单列表页弹框
  "GetOrderListPop": wap + "api/v3/Order/GetOrderListPop",

  // 获取订单详情
  "GetOrderInfoEx": wap + "api/v3/OrderInfo/GetOrderInfoEx",

  // 跟踪订单状态
  "TrackOrderStatus": wap + "api/v3/Order/TrackOrderStatus",

  // 微信获取open id
  "GetWxpayOpenId": wap + "api/v3/OrderInfo/GetWxpayOpenId",

  // 微信获取用户信息
  "GetWxUserInfo": wap + "api/v3/Wx/GetWxUserInfo",

  // 微信授权
  "GetAuthUrl": wap + "api/v3/wap/GetAuthUrl",

  // 余额支付
  "BalancePay": wap + "api/v3/OrderInfo/BalancePay",

  // 支付宝支付
  "GetAlipaySign": wap + "api/v3/OrderInfo/GetAlipaySign",

  // 微信支付
  "GetWxpaySign": wap + "api/v3/OrderInfo/GetWxpaySign",

  // 增项-余额支付
  "IodOfBalancePay": wap + "api/v3/Order/IodOfBalancePay",

  // 增项-支付宝支付
  "IodOfAlipay": wap + "api/v3/Order/IodOfAlipay",

  // 增项-微信支付
  "IodOfWxpay": wap + "api/v3/Order/IodOfWxpay",

  // 充值列表
  "GetReChargeListResponse": wap + "api/v3/Recharge/GetReChargeListResponse",

  // 获取充值信息
  "GetRechargeInfoByRechargeCode": wap + "api/v3/Recharge/GetRechargeInfoByRechargeCode",

  // 判断是否满足一元首充条件
  "IsFirstRecharge": wap + "api/v3/wap/IsFirstRecharge",

  // 支付宝充值
  "GetAlipaySignForWeb": wap + "api/v3/Recharge/GetAlipaySignForWeb",

  // 微信充值
  "GetWxpaySignForWeb": wap + "api/v3/Recharge/GetWxpaySignForWeb",

  // 取消订单（仅用于支付页倒计时结束后自动取消订单）
  "CancelOrderEx": wap + "api/v3/OrderInfo/CancelOrderEx",

  // 取消订单（带取消理由）
  "OrderCancel": wap + "api/v3/OrderInfo/OrderCancel",

  // 获取订单取消原因
  "GetOrderCancelReasonList": wap + "api/v3/Order/GetOrderCancelReasonList",

  // 删除订单
  "RemoveOrderEx": wap + "api/v3/OrderInfo/RemoveOrderEx",

  // 完成订单
  "CompleteOrderEx": wap + "api/v3/OrderInfo/CompleteOrderEx",

  // 评价订单
  "SubmitEvaluation": wap + "api/v3/Order/SubmitEvaluation",

  // 获取投诉原因
  "GetOrderComplaintsReasonList": wap + "api/v3/Order/GetOrderComplaintsReasonList",

  // 提交投诉
  "SubmitApplyComplaints": wap + "api/v3/Order/SubmitApplyComplaints",

  // 获取评价标签
  "GetStarLevel": wap + "api/v3/Order/GetStarLevel",

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

  // 创建快递订单
  "CreateKdEOrder": wap + "api/v3/Front/CreateKdEOrder",

  // 获取跑腿/快递订单详情
  "GetExpressDetail": wap + "api/v3/Express/GetExpressDetail",

  // 获取快递进度信息
  "GetKdTrackInfo": wap + "api/v3/Front/GetKdTrackInfo",

  // 获取跑腿服务价格
  "GetPaoTuiPrice": wap + "api/v3/Express/GetPaoTuiPrice",

  // 创建跑腿订单
  "CreatePaoTuiOrder": wap + "api/v3/Express/CreateOrder",

  // 超级星期五活动
  "BlackFridayEx": wap + "api/v3/Activity/BlackFridayEx",
};