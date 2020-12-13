import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';
import { RootState } from '../internal';

export type BottomNavContentType = 'colorizer';

export const uiBottomNavState = () => {
  const selectedContent: BottomNavContentType = 'colorizer';
  const enabled = false;
  return {
    selectedContent,
    enabled,
  };
};

export type UiBottomNavState = ReturnType<typeof uiBottomNavState>;

export const uiBottomNavGetters: GetterTree<UiBottomNavState, RootState> = {
  isColorizerSelected(state) {
    return state.selectedContent === 'colorizer';
  },
};

export const uiBottomNavMutations: MutationTree<UiBottomNavState> = {
  selectContent(state, content: BottomNavContentType) {
    state.selectedContent = content;
  },
  setEnabled(state, bool: boolean) {
    state.enabled = bool;
  },
};

export const uiBottomNavActions: ActionTree<UiBottomNavState, RootState> = {
  selectContent({ commit }, content: BottomNavContentType) {
    commit('selectContent', content);
  },
  selectContentOrToggleEnabled(
    { state, commit },
    content: BottomNavContentType,
  ) {
    if (state.selectedContent !== content) {
      commit('selectContent', content);
      commit('setEnabled', true);
      return;
    }
    commit('setEnabled', !state.enabled);
  },
  enable({ commit }) {
    commit('setEnabled', true);
  },
  disable({ commit }) {
    commit('setEnabled', false);
  },
};

export const uiBottomNavModule: Module<UiBottomNavState, RootState> = {
  namespaced: true,
  actions: uiBottomNavActions,
  mutations: uiBottomNavMutations,
  state: uiBottomNavState,
  getters: uiBottomNavGetters,
};
