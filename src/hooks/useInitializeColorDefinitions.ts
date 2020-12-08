import { useStore } from '../store';
import { ColorDefinition } from '../core/ColorDefinition';

export const useInitializeColorDefinitions = () => {
  const store = useStore();

  if (store.getters['domain/streamColorizer/colorDefinitions'].length) {
    return;
  }

  const blankDefinitions = new Array(9 * 9 - 4)
    .fill(void 0)
    .map(() => new ColorDefinition());
  const definitions = [
    new ColorDefinition({ colorCode: '#FC5137' }),
    new ColorDefinition({ colorCode: '#72D329' }),
    new ColorDefinition({ colorCode: '#FEC137' }),
    new ColorDefinition({ colorCode: '#348FBF' }),
  ].concat(blankDefinitions);

  store.commit('domain/streamColorizer/setColorDefinitions', definitions);
};
