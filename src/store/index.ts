import { InjectionKey } from 'vue';
import { Store, createStore, useStore as baseUseStore } from 'vuex';
import { rootModule, RootState } from './modules/internal';

export const key: InjectionKey<Store<unknown>> = Symbol();

export const store = createStore(rootModule);

export const useStore = () => {
  return baseUseStore<RootState>(key);
};
