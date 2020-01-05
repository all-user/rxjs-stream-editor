import { Module } from 'vuex-smart-module';
import { uiBottomNavModule } from '../internal';

export const uiModule = new Module({
  namespaced: true,
  modules: {
    bottomNav: uiBottomNavModule,
  },
});
