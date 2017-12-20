import Vue from 'vue';
import App from './App';
import router from './router';
import 'mint-ui/lib/style.css';
import store from './store';

import { Picker } from 'mint-ui';

import Alert from './components/common/Alert';
import Dialog from './components/common/Dialog';
import Loading from './components/common/Loading';

Vue.prototype.$alert = Alert;
Vue.prototype.$dialog = Dialog;
Vue.prototype.$loading = Loading;

Vue.config.productionTip = false;

Vue.component(Picker.name, Picker);

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
