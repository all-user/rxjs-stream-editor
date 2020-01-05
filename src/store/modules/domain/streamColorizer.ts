import { Actions, Mutations, Module, Getters } from 'vuex-smart-module';
import { defineInstanceMap, InstanceMap } from '../../../core/internal';
import { ColorDefinition } from '../../../domain/ColorDefinition';

const ColorDefinitionInstanceMap = defineInstanceMap<ColorDefinition>('id');

export class DomainStreamColorizerState {
  public colorMatcherSourceCode = '';
  public colorDefinitionIds: string[] = [];
  public colorDefinitionMap: InstanceMap<
    ColorDefinition
  > = new ColorDefinitionInstanceMap();
  public selectedColorDefinitionId: string | null = null;
}

export class DomainStreamColorizerGettters extends Getters<
  DomainStreamColorizerState
> {
  get selectedColorCode() {
    if (this.state.selectedColorDefinitionId == null) {
      return null;
    }
    return (
      this.state.colorDefinitionMap.get(this.state.selectedColorDefinitionId)
        ?.colorCode ?? null
    );
  }
  get colorDefinitions() {
    return this.state.colorDefinitionIds.map(id =>
      this.state.colorDefinitionMap.get(id),
    );
  }
}

export class DomainStreamColorizerMutations extends Mutations<
  DomainStreamColorizerState
> {
  public setColorMatcherSourceCode(sourceCode: string) {
    this.state.colorMatcherSourceCode = sourceCode;
  }
  public setColorCode({
    colorDefinitionId,
    colorCode,
  }: {
    colorDefinitionId: string;
    colorCode: string | null;
  }) {
    const colorDef = this.state.colorDefinitionMap.get(colorDefinitionId);
    if (colorDef == null) {
      return;
    }
    colorDef.colorCode = colorCode;
    this.state.colorDefinitionMap.set(colorDefinitionId, colorDef);
  }
  public setColorDefinitions(definitions: ColorDefinition[]) {
    this.state.colorDefinitionMap = new ColorDefinitionInstanceMap(
      ...definitions,
    );
    this.state.colorDefinitionIds = definitions.map(def => def.id);
  }
  public selectColorDefinition(id: string | null) {
    if (id == null || !this.state.colorDefinitionMap.has(id)) {
      this.state.selectedColorDefinitionId = null;
    } else {
      this.state.selectedColorDefinitionId = id;
    }
  }
}

export class DomainStreamColorizerActions extends Actions<
  DomainStreamColorizerState,
  DomainStreamColorizerGettters,
  DomainStreamColorizerMutations,
  DomainStreamColorizerActions
> {}

export const domainStreamColorizerModule = new Module({
  namespaced: true,
  mutations: DomainStreamColorizerMutations,
  actions: DomainStreamColorizerActions,
  state: DomainStreamColorizerState,
  getters: DomainStreamColorizerGettters,
});
