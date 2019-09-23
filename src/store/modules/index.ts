import { Module } from 'vuex-smart-module';
import { domainModule } from './domain/internal';

export const rootModule = new Module({
  modules: {
    domain: domainModule,
  },
});
