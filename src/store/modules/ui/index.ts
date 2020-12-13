import { Module } from 'vuex';
import { uiBottomNavModule, RootState } from '../internal';

export const uiModule: Module<RootState, RootState> = {
  namespaced: true,
  modules: {
    bottomNav: uiBottomNavModule,
  },
};
