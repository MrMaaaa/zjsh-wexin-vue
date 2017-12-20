import Vue from 'vue';
import Component from './Loading.vue';
import Utils from '../../../config/utils.js';

const Constructor = Vue.extend(Component);

const instance = new Constructor({
  el: document.createElement('div')
});

Constructor.prototype.open = (options = {}) => {
  if(Utils.typeof(options) === 'number') {
    instance.type = options;
    instance.topMsg ='';
    instance.bottomMsg = '';
  } else {
    instance.type = options.type || 0;
    instance.topMsg = options.topMsg || '';
    instance.bottomMsg = options.bottomMsg || '';
  }
  document.body.appendChild(instance.$el);
}

Constructor.prototype.close = () => {
  const el = instance.$el;
  el.parentNode && el.parentNode.removeChild(el);
}

export default {
  open: instance.open,
  close: instance.close
}
