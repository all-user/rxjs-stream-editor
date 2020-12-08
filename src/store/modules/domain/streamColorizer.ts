import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';
import { defineInstanceMap, InstanceMap } from '../../../lib/InstanceMap';
import { ColorDefinition } from '../../../core/ColorDefinition';
import { RootState } from '../internal';

const ColorDefinitionInstanceMap = defineInstanceMap<ColorDefinition>('id');

export const domainStreamColorizerState = (): {
  colorMatcherSourceCode: string;
  colorDefinitionIds: string[];
  colorDefinitionMap: InstanceMap<ColorDefinition>;
  selectedColorDefinitionId: string | null;
} => {
  return {
    colorMatcherSourceCode: '',
    colorDefinitionIds: [],
    colorDefinitionMap: new ColorDefinitionInstanceMap(),
    selectedColorDefinitionId: null,
  };
};

export type DomainStreamColorizerState = ReturnType<
  typeof domainStreamColorizerState
>;

export const domainStreamColorizerGettters: GetterTree<
  DomainStreamColorizerState,
  RootState
> = {
  selectedColorCode(state) {
    if (state.selectedColorDefinitionId == null) {
      return null;
    }
    return (
      state.colorDefinitionMap.get(state.selectedColorDefinitionId)
        ?.colorCode ?? null
    );
  },
  colorDefinitions(state) {
    return state.colorDefinitionIds.map(id => state.colorDefinitionMap.get(id));
  },
  colorCodeGetter(state) {
    return (selector: string) => {
      const trimed = selector.toLowerCase().trim();
      const matched = /^([a-i])([1-9])$/.exec(trimed);
      if (matched) {
        const [, colStr, rowStr] = matched;
        const row = parseInt(rowStr, 10) - 1;
        const column = parseInt(colStr, 19) - 10;
        const index = row * 9 + column;
        return state.colorDefinitionMap.get(state.colorDefinitionIds[index])
          ?.colorCode;
      } else if (
        /^(?:#[0-9a-f]{3,4}|#[0-9a-f]{6}|#[0-9a-f]{8}|rgba?\((?:\s*\d{1,3}\s*,?){3,4}\s*\))$/.test(
          trimed,
        )
      ) {
        return trimed;
      } else {
        return null;
      }
    };
  },
  colorMatcher(state) {
    try {
      return new Function(
        'event',
        `return (${state.colorMatcherSourceCode})(event);`,
      );
    } catch {
      return () => undefined;
    }
  },
};

export const domainStreamColorizerMutations: MutationTree<DomainStreamColorizerState> = {
  setColorMatcherSourceCode(state, sourceCode: string) {
    state.colorMatcherSourceCode = sourceCode;
  },
  setColorCode(
    state,
    {
      colorDefinitionId,
      colorCode,
    }: {
      colorDefinitionId: string;
      colorCode: string | null;
    },
  ) {
    const colorDef = state.colorDefinitionMap.get(colorDefinitionId);
    if (colorDef == null) {
      return;
    }
    colorDef.colorCode = colorCode;
    state.colorDefinitionMap.set(colorDefinitionId, colorDef);
  },
  setColorDefinitions(state, definitions: ColorDefinition[]) {
    state.colorDefinitionMap = new ColorDefinitionInstanceMap(...definitions);
    state.colorDefinitionIds = definitions.map(def => def.id);
  },
  selectColorDefinition(state, id: string | null) {
    if (id == null || !state.colorDefinitionMap.has(id)) {
      state.selectedColorDefinitionId = null;
    } else {
      state.selectedColorDefinitionId = id;
    }
  },
};

export const domainStreamColorizerActions: ActionTree<
  DomainStreamColorizerState,
  RootState
> = {};

export const domainStreamColorizerModule: Module<
  DomainStreamColorizerState,
  RootState
> = {
  namespaced: true,
  mutations: domainStreamColorizerMutations,
  actions: domainStreamColorizerActions,
  state: domainStreamColorizerState,
  getters: domainStreamColorizerGettters,
};
