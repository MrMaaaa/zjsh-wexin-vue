import Vue from 'vue';
import Component from './Alert.vue';
import Utils from '../../../config/utils.js';

const Constructor = Vue.extend(Component);

let timer = null;

const instance = new Constructor({
  el: document.createElement('div')
});

Constructor.prototype.close = () => {
  const el = instance.$el;
  el.parentNode && el.parentNode.removeChild(el);

  typeof this.callback === 'function' && this.callback();
}

export default (options = {}) => {
  if (Utils.typeof(options) === 'string') {
    instance.msg = options || '';
    instance.timeout = 1500;
  } else {
    instance.msg = options.msg || '';
    instance.timeout = options.timeout || 1500;
    instance.callback = options.callback;
  }

  document.body.appendChild(instance.$el);

  instance.$el.addEventListener('click', () => {
    clearTimeout(timer);
    instance.close();
  });

  timer = window.setTimeout(() => {
    clearTimeout(timer);
    instance.close();
  }, instance.timeout);
}
