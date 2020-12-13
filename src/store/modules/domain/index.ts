import { Module } from 'vuex';
import {
  domainStreamEditorModule,
  domainStreamColorizerModule,
  RootState,
} from '../internal';

export const domainModule: Module<RootState, RootState> = {
  namespaced: true,
  modules: {
    streamEditor: domainStreamEditorModule,
    streamColorizer: domainStreamColorizerModule,
  },
};
