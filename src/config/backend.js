// const wap = "http://192.168.1.191:3001/api/v3/";
// const wap = "http://copen.homepaas.com/api/v3/";
const wap = "https://copen.zhujiash.com/api/v3/";

export default {
  // 检查当前用户手机号
  "CheckClientUser": wap + "ClientInfo/CheckClientUser",

  // 新手红包页面获取老用户红包
  "OldUserReceiveRedCoups": wap + "ClientInfo/OldUserReceiveRedCoups",

  // 新手红包页面获取新用户红包
  "NewUserReceiveRedCoups": wap + "ClientInfo/NewUserReceiveRedCoups",

  // 获取消息中心
  "GetUserMessage": wap + "ClientMessage/Count",

  // 获取未读消息个数
  "GetUnreadMessage": wap + "ClientMessage/UnreadCount",

  // 消息设为已读
  "SetUserMessage": wap + "ClientMessage/SetState",

  // 清空消息
  "ClearUserMessage": wap + "ClientMessage/Clear",

  // 发送验证码
  "SendCaptcha": wap + "Helper/SendCaptcha",

  // 验证Token是否有效
  "VerifyToken": wap + "helper/VerifyToken",

  // 更新推送
  "UpdatePushDeviceID": wap + "ClientInfo/UpdatePushDeviceID",

  // 快捷登录
  "QuickLogin": wap + "Wap/QuickLogin",

  // 设置昵称
  "SetNickName": wap + "ClientInfo/SetNickName",

  // 设置头像
  "SetPhoto": wap + "ClientInfo/SetPhoto",

  // 获取活动列表
  "GetAds": wap + "Provider/GetAds",

  // 首页弹窗
  "FirstOpenAppInfo": wap + "Order/FirstOpenAppInfo",

  // 获取首页推荐品类
  "Recommend": wap + "Front/Recommend",

  // 获取首页推荐品类“更多”对应的服务
  "QueryService": wap + "Front/QueryService",

  // 获取超级优惠
  "GetSuperDiscount": wap + "Front/GetSuperDiscount",

  // 获取全部分类
  "AllService": wap + "Front/AllService",

  // 获取服务价格
  "QueryServicePrice": wap + "Front/QueryServicePrice",

  // 获取活动类服务价格
  "QueryActivityCommonServicePrice": wap + "Front/QueryActivityCommonServicePrice",

  // 获取服务时间
  "ServiceTimeStartAt": wap + "Front/ServiceTimeStartAt",

  // 获取服务对应活动
  "GetActivityEx": wap + "Front/GetActivityEx",

  // 提交订单
  "SubmitOrder": wap + "Front/SubmitOrder",

  // 获取订单列表
  "GetOrderListEx": wap + "OrderInfo/GetOrderListEx",

  // 获取订单列表页弹框
  "GetOrderListPop": wap + "Order/GetOrderListPop",

  // 获取订单详情
  "GetOrderInfoEx": wap + "OrderInfo/GetOrderInfoEx",

  // 跟踪订单状态
  "TrackOrderStatus": wap + "Order/TrackOrderStatus",

  // 微信获取open id
  "GetWxpayOpenId": wap + "OrderInfo/GetWxpayOpenId",

  // 微信获取用户信息
  "GetWxUserInfo": wap + "Wx/GetWxUserInfo",

  // 微信授权
  "GetAuthUrl": wap + "wap/GetAuthUrl",

  // 余额支付
  "BalancePay": wap + "OrderInfo/BalancePay",

  // 支付宝支付
  "GetAlipaySign": wap + "OrderInfo/GetAlipaySign",

  // 微信支付
  "GetWxpaySign": wap + "OrderInfo/GetWxpaySign",

  // 增项-余额支付
  "IodOfBalancePay": wap + "Order/IodOfBalancePay",

  // 增项-支付宝支付
  "IodOfAlipay": wap + "Order/IodOfAlipay",

  // 增项-微信支付
  "IodOfWxpay": wap + "Order/IodOfWxpay",

  // 获取活动充值列表
  "GetRechargeListEx": wap + "Recharge/GetRechargeListEx",

  // 获取活动充值列表
  "GetReChargeListResponse": wap + "Recharge/GetReChargeListResponse",

  // 获取充值信息
  "GetRechargeInfoByRechargeCode": wap + "Recharge/GetRechargeInfoByRechargeCode",

  // 判断是否满足一元首充条件
  "IsFirstRecharge": wap + "wap/IsFirstRecharge",

  // 支付宝充值
  "GetAlipaySignForWeb": wap + "Recharge/GetAlipaySignForWeb",

  // 微信充值
  "GetWxpaySignForWeb": wap + "Recharge/GetWxpaySignForWeb",

  // 取消订单（仅用于支付页倒计时结束后自动取消订单）
  "CancelOrderEx": wap + "OrderInfo/CancelOrderEx",

  // 取消订单（带取消理由）
  "OrderCancel": wap + "OrderInfo/OrderCancel",

  // 获取订单取消原因
  "GetOrderCancelReasonList": wap + "Order/GetOrderCancelReasonList",

  // 删除订单
  "RemoveOrderEx": wap + "OrderInfo/RemoveOrderEx",

  // 完成订单
  "CompleteOrderEx": wap + "OrderInfo/CompleteOrderEx",

  // 评价订单
  "SubmitEvaluation": wap + "Order/SubmitEvaluation",

  // 获取投诉原因
  "GetOrderComplaintsReasonList": wap + "Order/GetOrderComplaintsReasonList",

  // 提交投诉
  "SubmitApplyComplaints": wap + "Order/SubmitApplyComplaints",

  // 获取评价标签
  "GetStarLevel": wap + "Order/GetStarLevel",

  // 获取地址
  "GetAddress": wap + "ClientInfo/GetAddress",

  // 获取地址标签
  "GetAddressTags": wap + "ClientInfo/GetAddressTags",

  // 增加地址
  "AddAddress": wap + "ClientInfo/AddAddress",

  // 删除地址
  "DeleteAddress": wap + "ClientInfo/DeleteAddress",

  // 编辑地址
  "EditAddress": wap + "ClientInfo/EditAddress",

  // 获取个人信息
  "GetUserInfo": wap + "ClientInfo/Index",

  // 获取我的账户
  "MySettlement": wap + "ClientInfo/MySettlement",

  // 获取红包列表
  "GetCoupons": wap + "User/GetCoupons",

  // 创建快递订单
  "CreateKdEOrder": wap + "Front/CreateKdEOrder",

  // 获取跑腿/快递订单详情
  "GetExpressDetail": wap + "Express/GetExpressDetail",

  // 获取快递进度信息
  "GetKdTrackInfo": wap + "Front/GetKdTrackInfo",

  // 获取跑腿服务UU价格
  "GetPaoTuiPrice": wap + "Express/GetPaoTuiPrice",

  // 获取跑腿服务闪送价格
  "GetShanSongPrice": wap + "Express/GetShanSongPrice",

  // 创建跑腿订单
  "CreatePaoTuiOrder": wap + "Express/CreateOrder",

  // 超级星期五活动
  "BlackFridayEx": wap + "Activity/BlackFridayEx",
};