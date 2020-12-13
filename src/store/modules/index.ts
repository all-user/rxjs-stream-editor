import { Module } from 'vuex';
import {
  domainModule,
  uiModule,
  DomainStreamColorizerState,
  DomainStreamEditorState,
  UiBottomNavState,
} from './internal';

export type RootState = {
  domain: {
    streamEditor: DomainStreamEditorState;
    streamColorizer: DomainStreamColorizerState;
  };
  ui: {
    bottomNav: UiBottomNavState;
  };
};

export const rootModule: Module<RootState, RootState> = {
  modules: {
    domain: domainModule,
    ui: uiModule,
  },
};
