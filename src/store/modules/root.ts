import { Module } from 'vuex-smart-module';
import { streamItemModule } from './index';

export const rootModule = new Module({
  modules: {
    streamItem: streamItemModule,
  },
});
