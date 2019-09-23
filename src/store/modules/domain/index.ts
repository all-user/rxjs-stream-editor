import { Module } from 'vuex-smart-module';
import { streamEditorModule } from './streamEditor';

export const domainModule = new Module({
  namespaced: true,
  modules: {
    streamEditor: streamEditorModule,
  },
});
