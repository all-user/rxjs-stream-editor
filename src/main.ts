import Vue from 'vue';
import App from './App.vue';
import store from './store';
import VueTextareaAutosize from 'vue-textarea-autosize';
import { modASomeFunction } from '@all-user/mod-a';
import { modBSomeFunction } from '@all-user/mod-b';

Vue.use(VueTextareaAutosize);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');

console.log(modASomeFunction());
console.log(modBSomeFunction());
