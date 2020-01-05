import { Module } from 'vuex-smart-module';
import { domainModule, uiModule } from './internal';

export const rootModule = new Module({
  modules: {
    domain: domainModule,
    ui: uiModule,
  },
});
