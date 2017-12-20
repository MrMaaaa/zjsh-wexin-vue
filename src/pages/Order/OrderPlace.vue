<template>
<div :class="{ 'name-tcjz': AppName === '同城家政' }">
  <div class="router-view-inner">
    <section class="section address flex-row" @click="routeTo({ name: 'address_list', query: { from: 'order_place' } })">
      <div class="left flex-row">
        <img class="icon-header" src="../../assets/images/order_addr.png">

        <p v-if="!OrderInfo.Address || !OrderInfo.Address.Id" class="txt-light">请选择一个服务地址</p>

        <p v-else class="address-info txt-normal">
          <span class="address txt-bolder txt-over-hide">{{ OrderInfo.Address.Address1 }} {{ OrderInfo.Address.Address2 }}</span>
          <span class="info">{{ OrderInfo.Address.Contact }}&nbsp;{{ OrderInfo.Address.PhoneNumber }}</span>
        </p>
      </div>

      <img class="icon-link" src="../../assets/images/link.png">
    </section>

    <section class="section type flex-row">
      <span class="txt-normal txt-bolder">请选择{{ serviceName }}类型</span>
    </section>

    <ul class="type-list">
      <li class="list-item flex-row" v-for="(item,index) in serviceList" @click="selectType(item, index)">
        <img class="type-img" :src="item.IconUrl">

        <div class="flex-row list-right">
          <div class="type-info">
            <p class="info-name">{{ item.ServiceName }}</p>
            <p class="info-price" v-if="!item.DepositAmount || item.DepositAmount == 0">{{ item.Price }}元/{{ item.Unit }}</p>
            <p class="info-price" v-else>{{ item.DepositAmount }}元订金</p>
          </div>

          <img class="icon-selector" v-show="typeIndex != index" src="../../assets/images/address_unselected.png">
          <img class="icon-selector" v-show="typeIndex == index" src="../../assets/images/orders_pitch_on.png">
        </div>
      </li>
    </ul>

    <section class="section amount flex-row" v-if="!isSpecialService">
      <span class="txt-normal txt-bolder">服务数量</span>

      <div class="flex-row">
        <img class="icon-amount" v-show="isReduce" @click="amountReduce" src="../../assets/images/orders_reduce.png">
        <img class="icon-amount" v-show="!isReduce" src="../../assets/images/orders_reduce_disable.png">
        <span class="amount-value" v-show="!isMaunalInput">{{ OrderInfo.Amount }}</span>
        <input class="amount-value" type="text" @input="inputFilter" @blur="inputBlurCheck" :value="OrderInfo.Amount" v-show="isMaunalInput">
        <img class="icon-amount" v-show="isAdd" @click="amountAdd" src="../../assets/images/orders_add.png">
        <img class="icon-amount" v-show="!isAdd" src="../../assets/images/orders_add_disable.png">
      </div>
    </section>

    <section class="section amount flex-row" v-else @click="routeTo({ name: 'order_special_demand', params: { serviceId } })">
      <span class="txt-normal txt-bolder">主要需求</span>

      <div class="flex-row">
        <span class="txt-light" v-if="OrderInfo.ServiceContent === ''">请选择您的需求</span>
        <span class="txt-normal" v-else>需求已确认</span>
        <img class="icon-link" src="../../assets/images/link.png">
      </div>
    </section>

    <section class="section time flex-row" @click="routeTo({ name: 'order_service_time' })">
      <span class="txt-normal txt-bolder">服务时间</span>

      <div class="flex-row">
        <span class="txt-light" v-if="OrderInfo.DateTime === ''">请选择服务时间</span>
        <span class="txt-normal" v-else>{{ OrderInfo.DateTime }}</span>
        <img class="icon-link" src="../../assets/images/link.png">
      </div>
    </section>

    <!-- 无订金 -->
    <section class="section statistics" v-if="!isShowDeposit">
      <i class="split-dotted"></i>
      <ul v-if="activityList.length > 0">
        <li class="section discount-item flex-row" v-for="item in activityList">
          <span>{{ item.Title }}</span>
          <span class="txt-price">-￥{{ discountAmount }}</span>
        </li>
      </ul>

      <div class="section coupon flex-row" @click="routeTo({ name: 'order_coupon_select', query: { totalPrice: totalPrice, serviceId: OrderInfo.FourServiceId, isPay: '0' } })">
        <span class="txt-normal">红包</span>

        <div class="flex-row">
          <span class="txt-price" v-if="CouponSelected.NoUse === '0'">-￥{{ couponAmount | formatAmount }}</span>
          <span class="txt-price" v-else-if="CouponSelected.NoUse === '1' && couponList.length > 0">不使用红包</span>
          <span class="txt-price" v-else>暂无可用红包</span>
          <img class="icon-link" src="../../assets/images/link.png">
        </div>
      </div>

      <i class="split-dotted"></i>

      <p class="section amount-detail" v-if="CouponSelected.NoUse === '0'">
        <span class="txt-light discount">已优惠￥{{ discountAmount + couponAmount | formatAmount }}</span>
        <span class="txt-normal total"><span class="name">小计</span><span class="txt-normal txt-bolder amount">￥{{ payAmount | formatAmount }}</span></span>
      </p>
      <p class="section amount-detail" v-else>
        <span class="txt-light discount" v-if="discountAmount > 0">已优惠￥{{ discountAmount | formatAmount }}</span>
        <span class="txt-normal total"><span class="name">小计</span><span class="txt-normal txt-bolder amount">￥{{ payAmount | formatAmount }}</span></span>
      </p>
    </section>

    <!-- 有订金 -->
    <section class="section statistics" v-else>
      <i class="split-dotted"></i>

      <!-- <div class="section flex-row">
        <span class="txt-normal">订金</span>

        <div class="flex-row">
          <span class="txt-price">￥{{ payAmount | formatAmount }}</span>
        </div>
      </div> -->

      <div class="section coupon flex-row">
        <span class="txt-normal">红包</span>

        <div class="flex-row">
          <span class="txt-price">订金不可用红包</span>
          <img class="icon-link" src="../../assets/images/link.png">
        </div>
      </div>

      <i class="split-dotted"></i>

      <p class="section amount-detail">
        <span class="txt-normal total"><span class="name">小计</span><span class="txt-normal txt-bolder amount">￥{{ payAmount | formatAmount }}</span></span>
      </p>
    </section>

    <section class="section one-safe flex-row" v-if="oneSafe.isShow">
      <div class="flex-row">
        <span class="txt-normal txt-bolder">1元保险：迟到、爽约赔付</span>
        <img class="icon-one-safe" @click="oneSafeAlert" src="../../assets/images/orders_alert.png">
      </div>

      <div class="selector" :class="{ active: oneSafe.isUsed }" @click="toggleOneSafe">
        <div class="toggle"></div>
      </div>
    </section>

    <section class="section remark flex-row" v-if="!isSpecialService">
      <span class="txt-normal txt-bolder">备注留言：</span>
      <div class="remark-input" style="position: relative;">
        <m-textarea style="height: 100%;" textareaStyle="position: absolute; top: 50%; transform: translateY(-50%); left: 0;padding-right: 0.533333rem;" :m-text.sync="OrderInfo.ServiceContent" m-placeholder="选填" />

        <img class="input-clear" v-if="OrderInfo.ServiceContent !== ''" @click="OrderInfo.ServiceContent = '';" src="../../assets/images/input_delete.png">
      </div>
    </section>
  </div>

  <section class="bottom-button flex-row">
    <p class="amount-detail flex-row" v-if="CouponSelected.NoUse === '0'">
      <span class="txt-light discount">已优惠￥{{ discountAmount + couponAmount | formatAmount }}</span>
      <span class="txt-normal total"><span class="name">合计</span><span class="txt-normal amount">￥{{ payAmount | formatAmount }}</span></span>
    </p>
    <p class="amount-detail flex-row" v-else>
      <span class="txt-light discount" v-if="discountAmount > 0">已优惠￥{{ discountAmount | formatAmount }}</span>
      <span class="txt-normal total flex-row"><span class="name">合计</span><span class="txt-normal amount">￥{{ payAmount | formatAmount }}</span></span>
    </p>

    <a class="btn-submit txt-bolder" @click="orderSubmit">提交订单</a>
  </section>

  <section class="one-safe-alert" v-if="oneSafe.isOpenAlert">
    <div class="wrapper" @click="oneSafe.isOpenAlert=false"></div>

    <div class="content">
      <div class="title">{{ oneSafe.title }}</div>
      <div class="split-line"></div>
      <p class="info">{{ oneSafe.content }}</p>
      <div class="split-line"></div>
      <p class="tips">轻触下方的“好的”按钮，即表示你同意<a class="safe-url" :href="oneSafe.url" target="_blank">《保险协议》</a></p>
      <div class="split-line"></div>
      <a class="btn-ok" @click="oneSafe.isOpenAlert=false">好的</a>
    </div>
  </section>
</div>
</template>

<script>
import { mapState } from 'vuex';
import Utils from '../../config/utils.js';
import MTextarea from '../../components/common/m-textarea.vue';

export default {
  name: 'order_place',
  data() {
    return {
      serviceId: '',
      serviceName: '',
      isActivity: '0',
      serviceList: [],
      lastAddressId: '',
      ServiceTypeRules: [], // 原始活动数据
      activityList: [], // 清洗后的活动数据
      couponList: [],
      countStep: 0,
      maxCount: -1,
      minCount: -1,
      isAdd: false,
      isReduce: false,
      typeIndex: -1,
      unitPrice: 0,
      isMaunalInput: false, // 是否允许手动输入数量
      isShowDeposit: false, // 是否显示订金
      isSpecialService: false, // 是否为特殊服务品类,指需要填写需求的保姆、育儿嫂、保姆、老人看护、病患看护
      oneSafe: {
        title: '',
        content: '',
        url: '',
        isShow: false,
        isOpenAlert: false,
        isUsed: true
      },
    }
  },
  components: {
    MTextarea
  },
  activated() {
    // 从订单页进来重置服务时间与备注
    if (this.$route.params.from === 'service_detail' || this.$route.params.from === 'login') {
      this.OrderInfo.DateTime = '';
      this.OrderInfo.ServiceContent = '';
    }

    this.lastAddressId = this.OrderInfo.Address ? this.OrderInfo.Address.Id + '' : '';
    this.getUserAddress(() => {
      // 从app活动页分享到微信等会带有ServiceId的参数
      let threeIdFromUrl = Utils.valueFromUrl('ServiceId');
      if (threeIdFromUrl) {
        this.serviceId = threeIdFromUrl;
        this.isSpecialService = ' 5 6 7 8 9 '.indexOf(' ' + this.serviceId + ' ') > -1 ? true : false;
        this.serviceName = Utils.valueFromUrl('ServiceName');

        this.CouponSelected.NoUse = '1';
        this.$store.commit('SetCouponSelected', this.CouponSelected);
        this.serviceList.splice(0);
        this.couponList.splice(0);
        this.getActivityServiceDetail();
      } else {
        let oldId = this.serviceId;
        let oldIsActivity = this.isActivity;
        this.serviceId = this.$route.query.id || oldId;
        this.isSpecialService = ' 5 6 7 8 9 '.indexOf(' ' + this.serviceId + ' ') > -1 ? true : false;
        this.isActivity = this.$route.query.isActivity || '0';

        // serviceId或isActivity或address id不同则重新获取价格信息
        if (oldId !== this.serviceId || oldIsActivity !== this.isActivity || (this.lastAddressId && this.lastAddressId != this.DefaultAddressId) || this.serviceList.length == 0) {
          // 判断是否为活动id
          if (this.isActivity == '1') {
            this.getActivityServiceDetail();
          } else {
            this.getServiceDetail();
          }
        }
      }
    });
  },
  methods: {
    oneSafeAlert() {
      this.oneSafe.isOpenAlert = true;
    },
    getServiceDetail() {
      this.serviceList.splice(0);
      this.$loading.open({
        type: 2,
        bottomMsg: '正在获取服务信息……'
      });
      this.$store.dispatch('QueryServicePrice', {
          ServiceId: this.serviceId,
          Longitude: this.OrderInfo.Address ? this.OrderInfo.Address.Address1Lng || '' : this.CurrentPosition.Longitude || '',
          Latitude: this.OrderInfo.Address ? this.OrderInfo.Address.Address1Lat || '' : this.CurrentPosition.Latitude || ''
        })
        .then(res => {
          this.$loading.close();
          this.serviceList = res.Service.SubItems;
          this.serviceName = res.Service.ServiceName;

          // 给rangePrices数组增加一条默认价格的数据用来存储原始价格
          this.serviceList.map(value => {
            if (!value.OriginPrice) {
              value.OriginPrice = value.Price;
            }
          });

          // 如果之前已经选择过对应服务的四级服务，显示之，否则显示第一个服务品类
          if (this.OrderInfo.FourServiceId) {
            this.typeIndex = -1;
            let isMatch = false;
            res.Service.SubItems.map((value, index) => {
              if (value.ServiceId === this.OrderInfo.FourServiceId) {
                isMatch = true;
                this.selectType(this.serviceList[index], index);
              }
            });
            if (!isMatch) {
              this.selectType(this.serviceList[0], 0);
            }
          } else {
            this.selectType(this.serviceList[0], 0);
          }
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    getActivityServiceDetail() {
      this.serviceList.splice(0);
      this.$loading.open({
        type: 2,
        bottomMsg: '正在获取服务信息……'
      });
      this.$store.dispatch('QueryActivityCommonServicePrice', {
          ActivityProductId: this.serviceId,
          Longitude: this.OrderInfo.Address ? this.OrderInfo.Address.Address1Lng || '' : this.CurrentPosition.Longitude || '',
          Latitude: this.OrderInfo.Address ? this.OrderInfo.Address.Address1Lat || '' : this.CurrentPosition.Latitude || ''
        })
        .then(res => {
          this.$loading.close();
          this.serviceList = res.Service.SubItems;
          this.serviceName = res.Service.ServiceName;

          // 如果之前已经选择过对应服务的四级服务，显示之，否则显示第一个服务品类
          if (this.OrderInfo.FourServiceId) {
            this.typeIndex = -1;
            let isMatch = false;
            res.Service.SubItems.map((value, index) => {
              if (value.ServiceId === this.OrderInfo.FourServiceId) {
                isMatch = true;
                this.selectType(this.serviceList[index], index);
              }
            });
            if (!isMatch) {
              this.selectType(this.serviceList[0], 0);
            }
          } else {
            this.selectType(this.serviceList[0], 0);
          }
        })
        .catch(err => {
          this.$loading.close();
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    // 切换服务品类时重新获取活动
    getServiceActivity() {
      // 初始化折扣信息与折扣金额
      this.$store.dispatch('GetActivityEx', {
          ServiceId: this.OrderInfo.FourServiceId,
          Longitude: this.OrderInfo.Address ? this.OrderInfo.Address.Address1Lng || '' : this.CurrentPosition.Longitude || '',
          Latitude: this.OrderInfo.Address ? this.OrderInfo.Address.Address1Lat || '' : this.CurrentPosition.Latitude || ''
        })
        .then(res => {
          // 活动信息清洗
          this.activityList.splice(0);
          this.ServiceTypeRules.splice(0);
          this.ServiceTypeRules = res.ServiceTypeRules;
          this.ServiceTypeRules.map(value => {
            value.Details.map(val => {
              let maxUpper = 0;
              let maxDis = null;
              val.Rules.map(v => {
                // 遍历每一条优惠信息（无论是否满足）
                if (v.Upper <= this.totalPrice && v.Upper >= maxUpper) {
                  maxUpper = v.Upper;
                  maxDis = {
                    Title: val.Title,
                    Upper: Number(v.Upper),
                    Minus: Number(v.Minus)
                  };
                }
              });
              if(maxDis !== null) {
                this.activityList.push(maxDis);
              }
            });
          });
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    getCouponList(ServiceId) {
      this.$store.dispatch('GetCoupons', {
        ServiceId
      })
        .then(res => {
          // 红包分类
          let date = new Date();
          this.couponList.splice(0);
          let d = new Date().getTime();
          res.CouponList.forEach((value, index) => {
            if (Number(value.EndTime + '000') > d && value.IsUsed === '0') {
              this.couponList.push(value);
            }
          });
          this.getCouponMaxAmount(this.totalPrice);
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    getCouponMaxAmount(originPrice) {
      let maxDisCoupon = null;
      let maxDis = 0;
      this.couponList.map(value => {
        if (Number(maxDis) <= Number(value.CouponDetails[0].DiscountAmount) && originPrice >= Number(value.CouponDetails[0].Amount)) {
          maxDisCoupon = value;
          maxDis = Number(value.CouponDetails[0].DiscountAmount);
        }
      });

      // 选择最大红包
      if (maxDisCoupon && !this.isShowDeposit) {
        maxDisCoupon.NoUse = '0';
        this.$store.commit('SetCouponSelected', maxDisCoupon);
      } else {
        this.$store.commit('SetCouponSelected', {
          NoUse: '1',
        });
      }
    },
    getUserAddress(callback) {
      this.$store.dispatch('GetAddress')
        .then(res => {
          if (res.length >= 1) {
            var avail = false;
            var addr = null;
            res.forEach(value => {
              // 两次判断，一次判断缓存保存的id，一次检索vuex中的id
              if (this.DefaultAddressId == value.Id) {
                avail = true;
                addr = value;
              }
            });
            // 如果检索出对应id的地址，保存到订单信息中，否则默认取第一条
            if (avail) {
              this.OrderInfo.Address = addr;
            } else {
              this.OrderInfo.Address = res[0];
            }
            this.$store.commit('SetDefaultAddressId', this.OrderInfo.Address.Id);
          } else {
            this.OrderInfo.Address = null;
          }
          callback && callback();
        })
        .catch(err => {
          this.$alert(err.message || err.ErrorMsg);
        });
    },
    amountReduce() {
      this.OrderInfo.Amount -= this.countStep;
      this.amountCheck();
    },
    amountAdd() {
      this.OrderInfo.Amount += this.countStep;
      this.amountCheck();
    },
    amountCheck() {
      if(this.OrderInfo.Amount <= this.minCount) {
        this.isReduce = false;
      } else {
        this.isReduce = true;
      }
      if(this.OrderInfo.Amount >= this.maxCount) {
        this.isAdd = false;
      } else {
        this.isAdd = true;
      }

      // 如果该服务品类存在价格梯度,根据当前的价格梯度修改为对应的价格,如果不在梯度范围内,则为原价格
      if(!this.isShowDeposit) {
        this.serviceList.map((val, ind) => {
          if (Utils.typeof(val.RangePrices) === 'array') {
            let isIn = false;
            val.RangePrices.map(value => {
              if (this.OrderInfo.Amount >= value.MinCount && this.OrderInfo.Amount <= value.MaxCount) {
                isIn = true;
                val.Price = value.Price;
                if (this.typeIndex === ind) {
                  this.unitPrice = value.Price;
                }
              }
            });

            if (!isIn && val.RangePrices.length > 0) {
              val.Price = val.OriginPrice;
              if (this.typeIndex === ind) {
                this.unitPrice = val.OriginPrice;
              }
            }
          }
        });
      }

      this.getCouponMaxAmount(this.totalPrice);
    },
    selectType(item, index) {
      // 切换四级品类时
      index = Number(index);

      // 如果下标不同
      if(this.typeIndex != index) {
        this.typeIndex = index;
        // 获取四级服务信息
        this.OrderInfo.FourServiceId = item.ServiceId;
        // 获取四级服务对应红包信息
        this.getCouponList(item.ServiceId);
        this.OrderInfo.SellType = item.SellType;
        this.OrderInfo.SpecialType = item.SpecialType;
        this.OrderInfo.Price = (item.DepositAmount && item.DepositAmount > 0) ? item.DepositAmount : item.Price;

        // 是否显示订金
        this.isShowDeposit = (item.DepositAmount && item.DepositAmount > 0) ? true : false;

        // 获取id对应活动信息
        this.getServiceActivity();

        // 修改单价、数量步长、最大最小数量
        this.unitPrice = Number((item.DepositAmount && item.DepositAmount > 0) ? item.DepositAmount : item.Price);
        this.countStep = Number(item.CountStep);
        this.maxCount = Number(item.MaxCount);
        this.minCount = Number(item.MinCount);

        // 初始化数量
        this.OrderInfo.Amount = this.isSpecialService ? 1 : Number(item.DefaultCount);

        this.getCouponMaxAmount(this.totalPrice);

        // 判断是否可增减
        this.amountCheck();

        // 判断是否可手动输入
        this.isMaunalInput = item.MaunalInput === '1' ? true : false;

        // 1元保险
        this.oneSafe.isShow = item.IsEnableClaims === '1' ? true : false;
        this.OrderInfo.IsClaims = item.IsEnableClaims === '1' ? '1' : '0';
        if (this.oneSafe.isShow) {
          this.oneSafe.isUsed = true;
          this.oneSafe.title = item.ClaimsNote.Title;
          this.oneSafe.content = item.ClaimsNote.Content;
          this.oneSafe.url = item.ClaimsNote.Url;
        } else {
          this.oneSafe.isUsed = false;
          this.oneSafe.title = '';
          this.oneSafe.content = '';
          this.oneSafe.url = '';
        }

        // 保存订单信息
        this.$store.commit('SetOrderInfo', this.OrderInfo);
      }
    },
    inputFilter(evt) {
      let val = evt.target.value;
      if (isNaN(val)) {
        //非数字
        evt.target.value = this.minCount;
      } else if (val > this.maxCount) {
        evt.target.value = this.maxCount;
      }
      this.OrderInfo.Amount = Number(evt.target.value);
      this.amountCheck();
    },
    inputBlurCheck(evt) {
      if(evt.target.value < this.minCount || !evt.target.value) {
        evt.target.value = this.minCount;
      } else if(evt.target.value > this.maxCount) {
        evt.target.value = this.maxCount;
      } else if(Number(evt.target.value) % this.countStep > 0) {
        // 如果输入的值除以步长存在余数，向上补齐
        evt.target.value = Number(evt.target.value) + this.countStep - Number(evt.target.value) % this.countStep;
      }

      this.OrderInfo.Amount = Number(evt.target.value);
      this.amountCheck();
    },
    toggleOneSafe() {
      if (this.oneSafe.isShow) {
        this.oneSafe.isUsed = !this.oneSafe.isUsed;
        this.OrderInfo.IsClaims = this.oneSafe.isUsed ? '1' : '0';
      }
    },
    orderSubmit() {
      if (!this.OrderInfo.Address || !this.OrderInfo.Address.Id) {
        this.$alert(this.ALERT_MSG.ADDRESS_EMPTY);
      } else if (this.isSpecialService && this.OrderInfo.ServiceContent === '') {
        this.$alert(this.ALERT_MSG.DEMAND_EMPTY);
      } else if (this.OrderInfo.DateTime === '') {
        this.$alert(this.ALERT_MSG.DATETIME_EMPTY);
      } else {
        this.$loading.open({
          type: 2,
          bottomMsg: '正在提交订单……'
        });
        this.$store.dispatch('SubmitOrder', {
            ServiceId: this.OrderInfo.FourServiceId,
            SpecialType: this.OrderInfo.SpecialType,
            ServiceAddressId: this.OrderInfo.Address.Id,
            Total: this.OrderInfo.Amount,
            ServiceStartAt: this.OrderInfo.DateTime,
            Price: this.OrderInfo.Price,
            SellType: this.OrderInfo.SellType,
            ServiceContent: this.OrderInfo.ServiceContent,
            IsClaims: this.OrderInfo.IsClaims
          })
          .then(res => {
            this.$loading.close();
            this.routeTo({
              name: 'order_pay',
              params: {
                orderId: res.OrderId
              }
            }, false);
          })
          .catch(err => {
            this.$loading.close();
            this.$alert(err.message || err.ErrorMsg);
          });
      }
    },
    routeTo(option={name:''}, isReplace=false) {
      // 保存订单信息
      this.$store.commit('SetOrderInfo', this.OrderInfo);

      if (isReplace) {
        this.$router.replace(option);
      } else {
        this.$router.push(option);
      }
    },
  },
  computed: {
    ...mapState(['OpenId', 'IsLogin', 'AppName', 'CurrentPosition', 'OrderInfo', 'CouponSelected', 'DefaultAddressId', 'ALERT_MSG']),
    // 总价
    totalPrice() {
      return Number(this.unitPrice) * Number(this.OrderInfo.Amount);
    },
    // 活动减免金额
    discountAmount: {
      get() {
        let discountAmount = 0;
        this.ServiceTypeRules.map(value => {
          value.Details.map(val => {
            let dis = 0,
              upp = 0;
            val.Rules.map(v => {
              // 计算当前优惠规则的最大折扣
              if (Number(v.Upper) >= upp && Number(v.Upper) <= Number(this.totalPrice)) {
                upp = Number(v.Upper);
                dis = Number(v.Minus);
              }
            });
            // 累加满足的折扣金额
            discountAmount += dis;
          });
        });

        return discountAmount;
      },
      set(val) {
        if(!isNaN(val)) {
          this.discountAmount = Number(val);
        }
      }
    },
    // 红包减免金额
    couponAmount() {
      if(this.CouponSelected.NoUse == '0') {
        return Number(this.CouponSelected.CouponDetails[0].DiscountAmount) || 0;
        return 0;
      } else {
        return 0;
      }
    },
    // 支付金额
    payAmount() {
      // 是否使用一元赔付
      let oneSafeAmount = this.oneSafe.isUsed ? 1 : 0;

      return (this.totalPrice * 100 + oneSafeAmount * 100 - this.discountAmount * 100 - this.couponAmount * 100) / 100;
    },
  },
  filters: {
    formatAmount(amount) {
      let a = amount + '';
      if(a.indexOf('.') === -1) {
        return amount + '.00';
      } else {
        return a.split('.')[0] + '.' + (a.split('.')[1].length === 1 ? a.split('.')[1] + '0' : a.split('.')[1]);
      }
    },
  }
}
</script>

<style scoped lang="scss">
.router-view-inner
{
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 1.6rem;
  background-color: #f7f7ff;
  overflow-y: scroll;
}
// 为同城到家分包的兼容处理
.router-view.name-tcjz
{
  box-sizing: border-box;
  height: 100%;
  overflow: scroll;
}
.txt-bolder
{
  font-weight: bolder;
}
.txt-light
{
  color: #999;
}
.txt-normal
{
  color: #333639;
}
.txt-price
{
  color: #f56165;
}
.section
{
  position: relative;
  height: 1.333333rem;
  margin: 0 0.266667rem;
  padding: 0 0.32rem;
  background-color: #fff;
  font-size: 15px;
  &.address
  {
    height: 1.76rem;
    .left
    {
      justify-content: initial;
      -webkit-justify-content: initial;
      flex-grow: 1;
      -webkit-flex-grow: 1;
      .icon-header
      {
        flex-shrink: 0;
        -webkit-flex-shrink: 0;
      }
      .address-info
      {
        flex-grow: 1;
        -webkit-flex-grow: 1;
        display: block;
        width: 3.813333rem;
        .address
        {
          display: block;
          font-size: 17px;
        }
        .info
        {
          display: block;
          margin-top: 0.133333rem;
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
  &.type
  {
    height: 1.173333rem;
    margin-top: 0.266667rem;
  }
  &.amount
  {
    padding-top: 0.133333rem;
    .icon-amount
    {
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
    }
    .amount-value
    {
      width: 1.6rem;
      height: 0.666667rem;
      line-height: 0.666667rem;
      border: none;
      outline: none;
      text-align: center;
      font-size: 14px;
    }
  }
  &.time
  {
    height: 0.746667rem;
    padding-top: 0.373333rem;
  }
  &.one-safe
  {
    margin-top: 0.266667rem;
    .icon-one-safe
    {
      width: 0.346667rem;
      height: 0.346667rem;
      margin-left: 0.12rem;
      vertical-align: middle;
    }
    .selector
    {
      position: relative;
      width: 1.333333rem;
      height: 0.746667rem;
      border: 1px solid #ddd;
      border-top-left-radius: 0.373333rem;
      border-top-right-radius: 0.373333rem;
      border-bottom-left-radius: 0.373333rem;
      border-bottom-right-radius: 0.373333rem;
      background-color: #fff;
      &.active
      {
        border-color: #f56165;
        background-color: #f56165;
        .toggle
        {
          transform: translateX(0.666667rem);
          transition: all .2s;
        }
      }
      .toggle
      {
        width: 0.666667rem;
        height: 0.666667rem;
        margin-top: 0.02rem;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 3px 2px rgba(35,35,35,.3);
        transition: all .2s;
      }
    }
  }
  &.statistics
  {
    .section.amount-detail
    {
      height: 1.04rem;
      line-height: 0.746667rem;
    }
    height: auto;
    padding: 0;
    .section
    {
      margin: 0;
    }
    .amount-detail
    {
      line-height: 1.173333rem;
      text-align: right;
      .discount
      {
        vertical-align: middle;
      }
      .total
      {
        margin-left: 0.32rem;
        .name
        {
          vertical-align: middle;
        }
        .amount
        {
          font-size: 20px;
          vertical-align: middle;
        }
      }
    }
  }
  &.remark
  {
    justify-content: initial;
    -webkit-justify-content: initial;
    margin-top: 0.266667rem;
    .txt-normal
    {
      -webkit-flex-shrink: 0;
      flex-shrink: 0;
    }
    .remark-input
    {
      display: block;
      width: 100%;
      height: 100%;
      margin-left: 0.133333rem;
      border: none;
      outline: none;
      font-size: 14px;
      .input-clear
      {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%) translateZ(0);
        width: 0.426667rem;
        height: 0.426667rem;
      }
    }
  }
  &.discount-item,
  &.coupon
  {
    height: 0.746667rem;
  }
  .icon-header
  {
    display: block;
    width: 0.586667rem;
    margin-right: 0.32rem;
  }
  .icon-link
  {
    display: block;
    width: 0.2rem;
    margin-left: 0.44rem;
    vertical-align: middle;
  }
}
.split-dotted
{
  display: block;
  height: 0.586667rem;
  background: url(../../assets/images/orders_split.png) no-repeat;
  background-size: 100% 100%;
}
.type-list
{
  margin: 0 0.266667rem;
  padding: 0 0.32rem;
  background-color: #fff;
  .list-item
  {
    height: 1.6rem;
    .type-img
    {
      display: block;
      width: 1.066667rem;
      height: 1.066667rem;
      margin-right: 0.466667rem;
      flex-shrink: 0;
      -webkit-flex-shrink: 0;
    }
    .list-right
    {
      width: 100%;
      height: 100%;
    }
    .type-info
    {
      .info-name
      {
        color: #333639;
        font-size: 14px;
      }
      .info-price
      {
        margin-top: 0.186667rem;
        color: #f56165;
        font-size: 16px;
      }
    }
    .icon-selector
    {
      display: block;
      width: 0.586667rem;
      height: 0.586667rem;
    }
  }
}
.bottom-button
{
  position: fixed;
  bottom: 0;
  left: 0;
  transform: translateZ(0);
  width: 100%;
  height: 1.333333rem;
  line-height: 1.333333rem;
  border-top: 1px solid #f0f0fd;
  background-color: #fff;
  .amount-detail
  {
    -webkit-flex-shrink: 0;
    flex-shrink: 0;
    padding: 0 0.4rem 0 0.266667rem;
    font-size: 14px;
    .total
    {
      margin-left: 0.32rem;
      .amount
      {
        font-size: 20px;
      }
    }
  }
  .btn-submit
  {
    display: block;
    width: 3.36rem;
    height: 100%;
    background-color: #f66165;
    color: #fff;
    text-align: center;
    font-size: 18px;
  }
}
.one-safe-alert
{
  position: fixed;
  top: 0;
  left: 0;
  transform: translateZ(0);
  width: 100%;
  height: 100%;
  .wrapper
  {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
  }
  .content
  {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    border-radius: 4px;
    background-color: #fff;
    .title
    {
      padding: 0.266667rem 0;
      font-size: 16px;
      text-align: center;
    }
    .split-line
    {
      height: 1px;
      background-color: #eef2f5;
    }
    .info
    {
      padding: 0.266667rem;
      font-size: 14px;
    }
    .tips
    {
      padding: 0.266667rem;
    }
    .safe-url
    {
      color: #27b8f3;
    }
    .btn-ok
    {
      display: block;
      padding: 0.266667rem 0;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>