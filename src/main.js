// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 引入需要全局注册的组件
import WarnInfo from './components/Plugs/warn-info.vue'
import MDialog from './components/Plugs/m-dialog.vue'
import MLoading from './components/Plugs/m-loading.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */

// 在实例化之前注册组件
Vue.component('warn-info', WarnInfo)
Vue.component('m-dialog', MDialog)
Vue.component('m-loading', MLoading)

// 全局mixin
Vue.mixin({
  methods: {
    // 用于显示文本（一般用于接口的结果显示）
    alert(alertMsg, alertTimeout=1000) {
      this.$store.dispatch('SetAlert', {
        alertMsg: alertMsg,
        alertTimeout: alertTimeout
      });
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
