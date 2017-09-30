import Vue from 'vue';
import App from './App';
import router from './router';
import 'mint-ui/lib/style.css';
import store from './store';
// 引入需要全局注册的组件
import WarnInfo from './components/Plugs/warn-info.vue';
import MDialog from './components/Plugs/m-dialog.vue';
import MLoading from './components/Plugs/m-loading.vue';
import { Picker } from 'mint-ui'

Vue.config.productionTip = false;

// 在实例化之前注册组件
Vue.component('warn-info', WarnInfo);
Vue.component('m-dialog', MDialog);
Vue.component('m-loading', MLoading);
Vue.component(Picker.name, Picker);

// 全局mixin
Vue.mixin({
  methods: {
    // 用于显示文本（一般用于接口的结果显示）
    alert(alertMsg, alertTimeout=1500, alertCallback) {
      this.$store.dispatch('SetAlert', {
        alertMsg,
        alertTimeout: typeof alertTimeout == 'function' ? 1500 : alertTimeout,
        alertCallback: typeof alertTimeout == 'function' ? alertTimeout : alertCallback,
      });
    },
    // 弹出登录
    openLogin(callback) {
      this.$store.commit('SetIsOpenLogin', '1');
      var login = document.getElementById('module_login');
      login.setAttribute('title', document.title);
      login.classList.add('active');
      if(callback && typeof callback == 'function') {
        this.$store.commit('SetLoginCallback', callback);
      }
      var WVJBIframe = document.createElement('iframe');
      document.title = '登录';
      WVJBIframe.style.display = 'none';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe)
      }, 0);
    },
  }
});

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
