import { Module } from 'vuex-smart-module';
import {
  domainStreamEditorModule,
  domainStreamColorizerModule,
} from '../internal';

export const domainModule = new Module({
  namespaced: true,
  modules: {
    streamEditor: domainStreamEditorModule,
    streamColorizer: domainStreamColorizerModule,
  },
});
