import Vue from 'vue';
import Component from './Dialog.vue';
import Utils from '../../../config/utils.js';

const Constructor = Vue.extend(Component);

const instance = new Constructor({
  el: document.createElement('div')
});

Constructor.prototype.close = (callback) => {
  const el = instance.$el;

  if(Utils.typeof(callback) === 'function') {
    callback();
  }

  el.parentNode && el.parentNode.removeChild(el);
}

export default (options = {}) => {
  instance.msg = options.msg || '';
  instance.title = options.title || '提示';
  instance.btns = options.btns || [{
    text: '确定'
  }];

  document.body.appendChild(instance.$el);
}