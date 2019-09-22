import Vue from 'vue';
import Vuex from 'vuex';
import { createStore } from 'vuex-smart-module';
import { rootModule } from './modules';

Vue.use(Vuex);

export default createStore(rootModule);
