import { Actions, Mutations, Module, Getters } from 'vuex-smart-module';

export type BottomNavContentType = 'colorizer';

export class UiBottomNavState {
  public selectedContent: BottomNavContentType = 'colorizer';
  public enabled = false;
}

export class UiBottomNavGetters extends Getters<UiBottomNavState> {
  public get isColorizerSelected() {
    return this.state.selectedContent === 'colorizer';
  }
}

export class UiBottomNavMutations extends Mutations<UiBottomNavState> {
  public selectContent(content: BottomNavContentType) {
    this.state.selectedContent = content;
  }

  public setEnabled(bool: boolean) {
    this.state.enabled = bool;
  }
}

export class UiBottomNavActions extends Actions<
  UiBottomNavState,
  never,
  UiBottomNavMutations,
  UiBottomNavActions
> {
  public selectContent(content: BottomNavContentType) {
    this.commit('selectContent', content);
  }
  public selectContentOrToggleEnabled(content: BottomNavContentType) {
    if (this.state.selectedContent !== content) {
      this.commit('selectContent', content);
      this.commit('setEnabled', true);
      return;
    }
    this.commit('setEnabled', !this.state.enabled);
  }
  public enable() {
    this.commit('setEnabled', true);
  }
  public disable() {
    this.commit('setEnabled', false);
  }
}

export const uiBottomNavModule = new Module({
  namespaced: true,
  actions: UiBottomNavActions,
  mutations: UiBottomNavMutations,
  state: UiBottomNavState,
  getters: UiBottomNavGetters,
});
